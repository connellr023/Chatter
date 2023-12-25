import * as http from "http";
import * as ioc from "socket.io-client";

import Stream from "../../src/services/Stream";
import AbstractChatRoom from "../../src/chat/AbstractChatRoom";
import AbstractChatRoomStub from "../stubs/AbstractChatRoomStub";
import ChatRoomFactory from "../../src/lib/ChatRoomFactory";

import {Server} from "socket.io";
import {
    ConnectedUsersObject,
    ChatObject,
    UserDataObject,
    SendChatObject,
    StatusObject,
    StreamEvents
} from "../../src/lib/utility";

let io: Server;
let stream: Stream;
let clientSocket1: ioc.Socket;
let clientSocket2: ioc.Socket;

const port: number = 5000;

beforeEach((): void => {
    ChatRoomFactory.reset();
    stream.getObserverMap().clear();
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

test("Test clients receive updated list of connected users on client connect with GlobalChatRoom", (done): void => {
    const globalRoom: AbstractChatRoom = ChatRoomFactory.instantiate("t1");

    const user1: UserDataObject = {username: "arhp"};
    const user2: UserDataObject = {username: "phinger023"};

    stream.attach(globalRoom.getID(), globalRoom);

    clientSocket1.once(StreamEvents.SERVER_UPDATE_CONNECTIONS, (data: ConnectedUsersObject): void => {
        expect(data).toStrictEqual({
            roomId: globalRoom.getID(),
            connections: [user1]
        });
    });

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        if (!status.success) {
            throw new Error("Expected successful status for receiving userdata for user1");
        }

        clientSocket2.once(StreamEvents.SERVER_UPDATE_CONNECTIONS, (data: ConnectedUsersObject): void => {
            expect(data).toStrictEqual({
                roomId: globalRoom.getID(),
                connections: [user1, user2]
            });

            done();
        });

        clientSocket2.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
            if (!status.success) {
                throw new Error("Expected successful status for receiving userdata for user2");
            }
        });

        clientSocket2.emit(StreamEvents.CLIENT_SEND_USERDATA, user2);
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, user1);
});

test("Test only correct clients receive updated list of connected users on client connect with PrivateChatRoom", (done): void => {
    const privateRoom: AbstractChatRoom = ChatRoomFactory.instantiate("t1", false);

    const user1: UserDataObject = {username: "finger"};
    const user2: UserDataObject = {username: "phinger"};

    stream.attach(privateRoom.getID(), privateRoom);

    const failListener = (): void => {
        throw new Error("Should not have received update since client1 not member of private room");
    }

    clientSocket1.on(StreamEvents.SERVER_UPDATE_CONNECTIONS, failListener);

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        if (!status.success) {
            throw new Error("Expected successful status for receiving userdata for user1");
        }

        clientSocket2.once(StreamEvents.SERVER_UPDATE_CONNECTIONS, (data: ConnectedUsersObject): void => {
            expect(data).toStrictEqual({
                roomId: privateRoom.getID(),
                connections: [user2]
            });

            clientSocket1.removeListener(StreamEvents.SERVER_UPDATE_CONNECTIONS, failListener);
            done();
        });

        clientSocket2.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
            if (!status.success) {
                throw new Error("Expected successful status for receiving userdata for user2");
            }

            stream.notifyJoin(stream.getConnections().get(clientSocket2.id), privateRoom.getID());
        });

        clientSocket2.emit(StreamEvents.CLIENT_SEND_USERDATA, user2);
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, user1);
});

test("Test clients receive updated list of connected users on client disconnect with GlobalChatRoom", (done): void => {
    const room: AbstractChatRoom = ChatRoomFactory.instantiate("test");
    const user1: UserDataObject = {username: "crisp"};
    const user2: UserDataObject = {username: "hp123"};

    stream.attach(room.getID(), room);

    clientSocket1.once(StreamEvents.SERVER_UPDATE_CONNECTIONS, (): void => {
        clientSocket1.once(StreamEvents.SERVER_UPDATE_CONNECTIONS, (data: ConnectedUsersObject): void => {
            expect(data).toStrictEqual({
                roomId: room.getID(),
                connections: [user1]
            });

            done();
        });

        clientSocket2.disconnect();
    });

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        if (!status.success) {
            throw new Error("Expected successful status for receiving userdata for user1");
        }

        clientSocket2.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
            if (!status.success) {
                throw new Error("Expected successful status for receiving userdata for user2");
            }
        });

        clientSocket2.emit(StreamEvents.CLIENT_SEND_USERDATA, user2);
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, user1);
});

test("Test receive valid chat message with GlobalChatRoom", (done): void => {
    const room: AbstractChatRoom = ChatRoomFactory.instantiate("test");
    const message: string = "test message";
    const user: UserDataObject = {username: "alice"};
    const chat: ChatObject = {roomId: 0, text: message};

    stream.attach(room.getID(), room);

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

test("Test only clients in room receive chat message with GlobalChatRoom", (done): void => {
    const r1: AbstractChatRoom = ChatRoomFactory.instantiate("test1");
    const r2: AbstractChatRoom = ChatRoomFactory.instantiate("test1");

    const message: string = "test message";
    const chat: ChatObject = {roomId: 0, text: message};

    const user1: UserDataObject = {username: "phinger01"};
    const user2: UserDataObject = {username: "phinger02"};

    stream.attach(r1.getID(), r1);
    stream.attach(r2.getID(), r2);

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

test("Test receive message too long with GlobalChatRoom", (done): void => {
    const r1: AbstractChatRoom = new AbstractChatRoomStub("test1", 50);
    const message: string = "dhfguidfifodshjiodfhgfdiuohjgifodfigduohosjsdklsdlf";
    const user: UserDataObject = {username: "bob"};
    const chat: ChatObject = {roomId: r1.getID(), text: message};

    stream.attach(r1.getID(), r1);

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

test("Test receive message too short with GlobalChatRoom", (done): void => {
    const r1: AbstractChatRoom = ChatRoomFactory.instantiate("test");
    const message: string = "";
    const user: UserDataObject = {username: "frank"};
    const chat: ChatObject = {roomId: r1.getID(), text: message};

    stream.attach(r1.getID(), r1);

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

test("Test receive garbage message with GlobalChatRoom", (done): void => {
    const r1: AbstractChatRoom = ChatRoomFactory.instantiate("test");
    const message: string = null;
    const user: UserDataObject = {username: "frank"};
    const chat: ChatObject = {roomId: r1.getID(), text: message};

    stream.attach(r1.getID(), r1);

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