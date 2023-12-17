import * as http from "http";
import * as ioc from "socket.io-client";

import Stream from "../../src/stream/Stream";
import ChatRoom from "../../src/chat/ChatRoom";

import {Server} from "socket.io";
import {config, ReceiveUserDataObject, SendRoomsObject, StatusObject, StreamEvents} from "../../src/lib/Utility";

let io: Server;
let stream: Stream;
let clientSocket: ioc.Socket;

const port: number = config.DEV_PORT;

beforeEach((): void => {
    ChatRoom.Factory.reset();
});

beforeAll((done): void => {
    const httpServer: http.Server = http.createServer();

    httpServer.listen(port, (): void => {
        clientSocket = ioc.io(`http://localhost:${port}`);

        io = new Server(httpServer);
        stream = new Stream(io);

        stream.listen();

        clientSocket.on("connect", done);
    });
});

afterAll((): void => {
    io.close();
    clientSocket.disconnect();
});

test("Test receive user data success", (done): void => {
    const data: ReceiveUserDataObject = {
        username: "alice"
    }

    clientSocket.once(StreamEvents.SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(true);
        done();
    });

    clientSocket.emit(StreamEvents.RECEIVE_USER, data);
});

test("Test receive bad user data with name too long", (done): void => {
    const data: ReceiveUserDataObject = {
        username: "sjdoifjiodsfgiodfjiogdf"
    }

    clientSocket.once(StreamEvents.SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(false);
        done();
    });

    clientSocket.emit(StreamEvents.RECEIVE_USER, data);
});

test("Test receive bad user data with name too short", (done): void => {
    const data: ReceiveUserDataObject = {
        username: ""
    }

    clientSocket.once(StreamEvents.SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(false);
        done();
    });

    clientSocket.emit(StreamEvents.RECEIVE_USER, data);
});

test("Test receive garbage user data", (done): void => {
    const data: {} = {};

    clientSocket.once(StreamEvents.SEND_STATUS, (status: StatusObject): void => {
        expect(status.success).toBe(false);
        done();
    });

    clientSocket.emit(StreamEvents.RECEIVE_USER, data);
});

test("Test receive room encodings", (done): void => {
    ChatRoom.Factory.instantiate("1");
    ChatRoom.Factory.instantiate("34");

    clientSocket.once(StreamEvents.SEND_ROOMS, (data: SendRoomsObject): void => {
        expect(data).toStrictEqual(ChatRoom.Factory.encode());
        done();
    });

    clientSocket.emit(StreamEvents.REQUEST_ROOMS);
});