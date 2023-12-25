import * as http from "http";
import * as ioc from "socket.io-client";

import Stream from "../../src/services/Stream";
import ChatRoomFactory from "../../src/lib/ChatRoomFactory";

import {Server} from "socket.io";
import {
    UserDataObject,
    RoomsListObject,
    StatusObject,
    StreamEvents
} from "../../src/lib/utility";

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

test("Test receive user data success", (done): void => {
    const data: UserDataObject = {
        username: "alice"
    }

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(true);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});

test("Test receive bad user data with name too long", (done): void => {
    const data: UserDataObject = {
        username: "sjdoifjiodsfgiodfjiogdf"
    }

    clientSocket1.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(false);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_SEND_USERDATA, data);
});

test("Test receive bad user data with name too short", (done): void => {
    const data: UserDataObject = {
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
    ChatRoomFactory.instantiate("1");
    ChatRoomFactory.instantiate("34");
    ChatRoomFactory.instantiate("private", false);

    const expected: RoomsListObject = {
      rooms: [
          {
              name: "1",
              id: 0
          },
          {
              name: "34",
              id: 1
          }
      ]
    };

    clientSocket1.once(StreamEvents.SERVER_SEND_ROOMS, (data: RoomsListObject): void => {
        expect(data).toStrictEqual(expected);
        done();
    });

    clientSocket1.emit(StreamEvents.CLIENT_REQUEST_ROOMS);
});