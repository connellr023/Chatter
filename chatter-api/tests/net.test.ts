import * as http from "http";
import * as ioc from "socket.io-client";

import Stream from "../src/stream/Stream";
import ChatRoom from "../src/chat/ChatRoom";

import {Server} from "socket.io";
import {
    config,
    ReceiveChatObject,
    ReceiveUserDataObject,
    SendChatObject,
    SendRoomsObject,
    StatusObject,
    StreamEvents
} from "../src/lib/utility";

let io: Server;
let stream: Stream;
let clientSocket1: ioc.Socket;
let clientSocket2: ioc.Socket;

const port: number = config.DEV_PORT;

beforeEach((): void => {
    ChatRoom.Factory.reset();
});

beforeAll((done): void => {
    const httpServer: http.Server = http.createServer();

    httpServer.listen(port, (): void => {
        clientSocket1 = ioc.io(`http://localhost:${port}`);
        clientSocket2 = ioc.io(`http://localhost:${port}`);

        io = new Server(httpServer);
        stream = new Stream(io);

        stream.listen();

        clientSocket1.on("connect", done);
        clientSocket2.on("connect", done);
    });
});

afterAll((): void => {
    io.close();

    clientSocket1.disconnect();
    clientSocket2.disconnect();
});

test("Test receive user data success", (done): void => {
    const data: ReceiveUserDataObject = {
        username: "alice"
    }

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(true);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});

test("Test receive bad user data with name too long", (done): void => {
    const data: ReceiveUserDataObject = {
        username: "sjdoifjiodsfgiodfjiogdf"
    }

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(false);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});

test("Test receive bad user data with name too short", (done): void => {
    const data: ReceiveUserDataObject = {
        username: ""
    }

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(false);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});

test("Test receive garbage user data", (done): void => {
    const data: {} = {};

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(false);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});

test("Test receive room encodings", (done): void => {
    ChatRoom.Factory.instantiate("1");
    ChatRoom.Factory.instantiate("34");

    clientSocket1.once(StreamEvents.SERVER_SEND_ROOMS, (data: SendRoomsObject): void => {
        expect(data).toStrictEqual(ChatRoom.Factory.encode());
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_REQUEST_ROOMS);
});

test("Test receive valid chat message", (done): void => {
    const r1: ChatRoom = ChatRoom.Factory.instantiate("test1");
    const message: string = "test message";
    const user: ReceiveUserDataObject = {username: "alice"};
    const chat: ReceiveChatObject = {roomId: 0, text: message};

    stream.attach(0, r1);

    clientSocket1.once(StreamEvents.SERVER_CHAT_RESPONSE, (data: SendChatObject): void => {
        expect(data.message).toEqual(message);
        done();
    });

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        if (!status.success) {
            throw new Error("Expected successful status for receiving userdata");
        }
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, user);
    clientSocket1.emit(StreamEvents.CLIENT_SEND_CHAT, chat);
});

test("Test only clients in room receive chat message", (done): void => {
    const r1: ChatRoom = ChatRoom.Factory.instantiate("test1");
    const r2: ChatRoom = ChatRoom.Factory.instantiate("test2");

    const message: string = "test message";
    const chat: ReceiveChatObject = {roomId: 0, text: message};

    const user1: ReceiveUserDataObject = {username: "phinger01"};
    const user2: ReceiveUserDataObject = {username: "phinger02"};

    stream.attach(0, r1);
    stream.attach(1, r2);

    clientSocket1.once(StreamEvents.SERVER_CHAT_RESPONSE, (data: SendChatObject): void => {
        expect(data.message).toEqual(message);
        done();
    });

    clientSocket2.once(StreamEvents.SERVER_CHAT_RESPONSE, (): void => {
        throw new Error("Client 2 was not expected to receive a message");
    });

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        if (!status.success) {
            throw new Error("Expected successful status for receiving userdata from Client 1");
        }
    });

    clientSocket2.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        if (!status.success) {
            throw new Error("Expected successful status for receiving userdata from Client 2");
        }
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, user1);
    clientSocket2.emit(StreamEvents.CLIENT_SEND_USERDATA, user2);

    clientSocket1.emit(StreamEvents.CLIENT_SEND_CHAT, chat);
});

test("Test receive message too long", (done): void => {
    const r1: ChatRoom = ChatRoom.Factory.instantiate("test1");
    const message: string = "dhfguidfifodshjiodfhgfdiuohjgifodfigduohosjsdklsdlf";
    const user: ReceiveUserDataObject = {username: "bob"};
    const chat: ReceiveChatObject = {roomId: 0, text: message};

    stream.attach(0, r1);

    clientSocket1.once(StreamEvents.SERVER_CHAT_RESPONSE, (): void => {
        throw new Error("Not expecting to receive a chat response");
    });

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status1: StatusObject): void => {
        if (!status1.success) {
            throw new Error("Expected successful first status");
        }

        clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status2: StatusObject): void => {
            expect(status2.success).toBe(false);
            done();
        });
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, user);
    clientSocket1.emit(StreamEvents.CLIENT_SEND_CHAT, chat);
});

test("Test receive message too short", (done): void => {
    const r1: ChatRoom = ChatRoom.Factory.instantiate("test1");
    const message: string = "";
    const user: ReceiveUserDataObject = {username: "frank"};
    const chat: ReceiveChatObject = {roomId: 0, text: message};

    stream.attach(0, r1);

    clientSocket1.once(StreamEvents.SERVER_CHAT_RESPONSE, (): void => {
        throw new Error("Not expecting to receive a chat response");
    });

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status1: StatusObject): void => {
        if (!status1.success) {
            throw new Error("Expected successful first status");
        }

        clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status2: StatusObject): void => {
            expect(status2.success).toBe(false);
            done();
        });
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, user);
    clientSocket1.emit(StreamEvents.CLIENT_SEND_CHAT, chat);
});

test("Test receive garbage message", (done): void => {
    const r1: ChatRoom = ChatRoom.Factory.instantiate("test1");
    const message: string = null;
    const user: ReceiveUserDataObject = {username: "frank"};
    const chat: ReceiveChatObject = {roomId: 0, text: message};

    stream.attach(0, r1);

    clientSocket1.once(StreamEvents.SERVER_CHAT_RESPONSE, (): void => {
        throw new Error("Not expecting to receive a chat response");
    });

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status1: StatusObject): void => {
        if (!status1.success) {
            throw new Error("Expected successful first status");
        }

        clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status2: StatusObject): void => {
            expect(status2.success).toBe(false);
            done();
        });
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, user);
    clientSocket1.emit(StreamEvents.CLIENT_SEND_CHAT, chat);
});