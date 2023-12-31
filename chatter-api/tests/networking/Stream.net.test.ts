import * as http from "http";
import * as ioc from "socket.io-client";

import Stream from "../../src/stream/Stream";
import ChatRoomFactory from "../../src/lib/ChatRoomFactory";

import {Server} from "socket.io";
import {
    UserDataObject,
    RoomsListObject,
    StatusObject,
    StreamEvents
} from "../../src/lib/utility";
import AbstractChatRoom from "../../src/chat/AbstractChatRoom";

let io: Server;
let stream: Stream;
let clientSocket1: ioc.Socket;
let clientSocket2: ioc.Socket;

const port: number = 8001;

beforeEach((): void => {
    ChatRoomFactory.reset();
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

test("Receive user data success", (done): void => {
    const data: UserDataObject = {
        username: "alice"
    };

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(true);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});

test("Receive bad user data with name too long", (done): void => {
    const data: UserDataObject = {
        username: "sjdoifjiodsfgiodfjiogdf"
    };

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(false);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});

test("Receive bad user data with name too short", (done): void => {
    const data: UserDataObject = {
        username: ""
    };

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(false);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});

test("Receive garbage user data", (done): void => {
    const data: {} = {};

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(false);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});

test("Send room encodings", (done): void => {
    const r1: AbstractChatRoom = ChatRoomFactory.instantiate("1");
    const r2: AbstractChatRoom = ChatRoomFactory.instantiate("34");
    const r3: AbstractChatRoom = ChatRoomFactory.instantiate("private", false);

    stream.attach(r1.getID(), r1);
    stream.attach(r2.getID(), r2);
    stream.attach(r3.getID(), r3);

    const data: UserDataObject = {
        username: "arhp"
    };

    const expected: RoomsListObject = {
      rooms: [
          {
              name: "1",
              id: 0,
              isGlobal: true
          },
          {
              name: "34",
              id: 1,
              isGlobal: true
          }
      ]
    };

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        if (!status.success) {
            throw Error("Expected successful status when sending user data");
        }

        clientSocket1.once(StreamEvents.SERVER_SEND_ROOMS, (data: RoomsListObject): void => {
            expect(data).toStrictEqual(expected);
            done();
        });

        clientSocket1.emit(StreamEvents.CLIENT_REQUEST_ROOMS);
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});