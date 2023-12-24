import Stream from "../../src/stream/Stream";
import IStreamObserver from "../../src/stream/IStreamObserver";
import Client from "../../src/stream/Client";
import StreamObserverStub from "../stubs/StreamObserverStub";

import {Server, type Socket} from "socket.io";
import {StatusObject, StreamEvents} from "../../src/lib/utility";

const io: Server = new Server();
let stream: Stream;

beforeEach((): void => {
    stream = new Stream(io);
});

test("Test attach() with multiple observers to single event", (): void => {
    const o1: IStreamObserver = new StreamObserverStub();
    const o2: IStreamObserver = new StreamObserverStub();

    const expected: Map<number, IStreamObserver[]> = new Map<number, IStreamObserver[]>([[0, [o1, o2]]]);

    stream.attach(0, o1, o2);

    expect(stream.getObserverMap()).toStrictEqual(expected);
});

test("Test attach() with multiple observers to multiple events", (): void => {
    const o1: IStreamObserver = new StreamObserverStub();
    const o2: IStreamObserver = new StreamObserverStub();
    const o3: IStreamObserver = new StreamObserverStub();

    const expected: Map<number, IStreamObserver[]> = new Map<number, IStreamObserver[]>([[0, [o1, o2]], [1, [o1, o2, o3]], [2, [o2]]]);

    stream.attach(0, o1, o2);
    stream.attach(1, o1, o2, o3);
    stream.attach(2, o2);

    expect(stream.getObserverMap()).toStrictEqual(expected);
});

test("Test getEachObserver() has no duplicate instances", (): void => {
    const o1: IStreamObserver = new StreamObserverStub();
    const o2: IStreamObserver = new StreamObserverStub();
    const o3: IStreamObserver = o1;

    const expected: IStreamObserver[] = [o1, o2];

    stream.attach(0, o1);
    stream.attach(1, o2, o3);

    const actual: IStreamObserver[] = Array.from(stream.getEachObserver());

    expect(actual).toStrictEqual(expected);
});

test("Test onReceiveUser() with valid username", (): void => {
    const socket: Socket = null as Socket; // Hack to mock stream.io stream object
    const client: Client = new Client(socket, "alice");

    const expected: Map<Socket, Client> = new Map<Socket, Client>([[socket, client]]);

    stream.onReceiveUser(socket, {username: "alice"});

    expect(stream.getConnections()).toStrictEqual(expected);
});

test("Test onReceiveUser() with username exactly at maximum length", (): void => {
    const socket: Socket = null as Socket;
    const status: StatusObject = stream.onReceiveUser(socket, {username: "aaaaaaaaaaaaaaa"});

    expect(status.success).toBe(true);
});

test("Test onReceiveUser() with username exactly at minimum length", (): void => {
    const socket: Socket = null as Socket;
    const status: StatusObject = stream.onReceiveUser(socket, {username: "a"});

    expect(status.success).toBe(true);
});

test("Test onReceiveUser() with username too long", (): void => {
    const socket: Socket = null as Socket;
    const status: StatusObject = stream.onReceiveUser(socket, {username: "aaaaaaaaaaaaaaaa"});

    expect(status.success).toBe(false);
});

test("Test onReceiveUser() with username too short", (): void => {
    const socket: Socket = null as Socket;
    const status: StatusObject = stream.onReceiveUser(socket, {username: ""});

    expect(status.success).toBe(false);
});

test("Test onDisconnect()", (): void => {
    const socket: Socket = null as Socket;
    const expected: Map<Socket, Client> = new Map<Socket, Client>();

    stream.onReceiveUser(socket, {username: "alice"});
    stream.onDisconnect(socket);

    expect(stream.getConnections()).toStrictEqual(expected);
});

test("Test notifyClientConnectionStatus() for client connection", (): void => {
    const o1: StreamObserverStub = new StreamObserverStub();
    const o2: StreamObserverStub = new StreamObserverStub();

    const shouldRun: StreamObserverStub[] = [o1, o2];
    const expectedTrigger: string = "join";

    stream.attach(0, o1, o2);

    stream.notifyClientConnectionStatus(StreamEvents.CLIENT_SEND_USERDATA, null);

    shouldRun.forEach((observer: StreamObserverStub): void => {
        if (observer.getTrigger() != expectedTrigger) {
            if (observer.getTrigger().length == 0) {
                fail("Not triggered when should have");
            }
            else {
                fail("Wrong trigger");
            }
        }
    });
});

test("Test notifyClientConnectionStatus() for client disconnection", (): void => {
    const o1: StreamObserverStub = new StreamObserverStub();
    const o2: StreamObserverStub = new StreamObserverStub();

    const shouldRun: StreamObserverStub[] = [o1, o2];
    const expectedTrigger: string = "left";

    stream.attach(0, o1, o2);

    stream.notifyClientConnectionStatus(StreamEvents.CLIENT_DISCONNECTED, null);

    shouldRun.forEach((observer: StreamObserverStub): void => {
        if (observer.getTrigger() != expectedTrigger) {
            if (observer.getTrigger().length == 0) {
                throw new Error("Not triggered when should have");
            }
            else {
                throw new Error("Wrong trigger");
            }
        }
    });
});

test("Test notifyClientConnectionStatus() with null arguments", (): void => {
    stream.attach(0, new StreamObserverStub());

    expect((): void => stream.notifyClientConnectionStatus(null, null)).toThrow(Error);
});

test("Test notifyClientMessage()", (): void => {
    const o1: StreamObserverStub = new StreamObserverStub();
    const o2: StreamObserverStub = new StreamObserverStub();
    const o3: StreamObserverStub = new StreamObserverStub();

    const shouldReceive: StreamObserverStub[] = [o1, o2];
    const shouldNotReceive: StreamObserverStub[] = [o3];
    const expectedTrigger: string = "test message"

    stream.attach(0, o1, o2);
    stream.attach(1, o3);
    stream.notifyClientMessage(0, null, {roomId: 0, text: expectedTrigger});

    shouldReceive.forEach((observer: StreamObserverStub): void => {
        if (observer.getTrigger() != expectedTrigger) {
            if (observer.getTrigger().length == 0) {
                throw new Error("Not triggered when expected");
            }
            else {
                throw new Error("Incorrect message received");
            }
        }
    });

    shouldNotReceive.forEach((observer: StreamObserverStub): void => {
        if (observer.getTrigger().length > 0) {
            throw new Error("Triggered when not expected");
        }
    });
});