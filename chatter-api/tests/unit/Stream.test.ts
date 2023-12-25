import Stream from "../../src/services/Stream";
import IRoomObserver from "../../src/connections/IRoomObserver";
import Client from "../../src/connections/Client";
import IRoomObserverStub from "../stubs/IRoomObserverStub";

import {Server, type Socket} from "socket.io";
import {StatusObject, StreamEvents} from "../../src/lib/utility";

const io: Server = new Server();
let stream: Stream;

beforeEach((): void => {
    stream = new Stream(io);
});

test("Test attach() with multiple observers to single event", (): void => {
    const o1: IRoomObserver = new IRoomObserverStub();
    const o2: IRoomObserver = new IRoomObserverStub();

    const expected: Map<number, IRoomObserver[]> = new Map<number, IRoomObserver[]>([[0, [o1, o2]]]);

    stream.attach(0, o1, o2);

    expect(stream.getObserverMap()).toStrictEqual(expected);
});

test("Test attach() with multiple observers to multiple events", (): void => {
    const o1: IRoomObserver = new IRoomObserverStub();
    const o2: IRoomObserver = new IRoomObserverStub();
    const o3: IRoomObserver = new IRoomObserverStub();

    const expected: Map<number, IRoomObserver[]> = new Map<number, IRoomObserver[]>([[0, [o1, o2]], [1, [o1, o2, o3]], [2, [o2]]]);

    stream.attach(0, o1, o2);
    stream.attach(1, o1, o2, o3);
    stream.attach(2, o2);

    expect(stream.getObserverMap()).toStrictEqual(expected);
});

test("Test getEachObserver() has no duplicate instances", (): void => {
    const o1: IRoomObserver = new IRoomObserverStub();
    const o2: IRoomObserver = new IRoomObserverStub();
    const o3: IRoomObserver = o1;

    const expected: IRoomObserver[] = [o1, o2];

    stream.attach(0, o1);
    stream.attach(1, o2, o3);

    const actual: IRoomObserver[] = Array.from(stream.getEachObserver());

    expect(actual).toStrictEqual(expected);
});

test("Test onReceiveUser() with valid username", (): void => {
    const socket: Socket = null as Socket; // Hack to mock services.io services object
    const client: Client = new Client(socket, "alice");

    const expected: Map<Socket, Client> = new Map<Socket, Client>([[socket, client]]);

    stream.handleReceiveUser(client, {username: "alice"});

    expect(stream.getConnections()).toStrictEqual(expected);
});

test("Test onReceiveUser() with username exactly at maximum length", (): void => {
    const socket: Socket = null as Socket;
    const client: Client = new Client(socket, "bob");

    const status: StatusObject = stream.handleReceiveUser(client, {username: "aaaaaaaaaaaaaaa"});

    expect(status.success).toBe(true);
});

test("Test onReceiveUser() with username exactly at minimum length", (): void => {
    const socket: Socket = null as Socket;
    const client: Client = new Client(socket, "charlie");

    const status: StatusObject = stream.handleReceiveUser(client, {username: "a"});

    expect(status.success).toBe(true);
});

test("Test onReceiveUser() with username too long", (): void => {
    const socket: Socket = null as Socket;
    const client: Client = new Client(socket, "charlie");

    const status: StatusObject = stream.handleReceiveUser(client, {username: "aaaaaaaaaaaaaaaa"});

    expect(status.success).toBe(false);
});

test("Test onReceiveUser() with username too short", (): void => {
    const socket: Socket = null as Socket;
    const client: Client = new Client(socket, "charlie");

    const status: StatusObject = stream.handleReceiveUser(client, {username: ""});

    expect(status.success).toBe(false);
});

test("Test onDisconnect()", (): void => {
    const socket: Socket = null as Socket;
    const client: Client = new Client(socket, "charlie");
    const expected: Map<Socket, Client> = new Map<Socket, Client>();

    stream.handleReceiveUser(client, {username: "alice"});
    stream.handleDisconnect(client);

    expect(stream.getConnections()).toStrictEqual(expected);
});

test("Test notifyConnect()", (): void => {
    const o1: IRoomObserverStub = new IRoomObserverStub();
    const o2: IRoomObserverStub = new IRoomObserverStub();

    const shouldRun: IRoomObserverStub[] = [o1, o2];
    const expectedTrigger: string = "join";

    stream.attach(0, o1, o2);

    stream.notifyClientConnectionStatus(StreamEvents.CLIENT_SEND_USERDATA, null);

    shouldRun.forEach((observer: IRoomObserverStub): void => {
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

test("Test notifyClientConnectionStatus() for client services with additional data", (): void => {
    const o1: IRoomObserverStub = new IRoomObserverStub();
    const o2: IRoomObserverStub = new IRoomObserverStub();

    const shouldRun: IRoomObserverStub[] = [o1, o2];
    const expectedAdditional: {} = {testObj: 0};
    const expectedTrigger: string = "join";

    stream.attach(0, o1, o2);

    stream.notifyClientConnectionStatus(StreamEvents.CLIENT_SEND_USERDATA, null, expectedAdditional);

    shouldRun.forEach((observer: IRoomObserverStub): void => {
        if (observer.getTrigger() != expectedTrigger) {
            if (observer.getTrigger().length == 0) {
                throw new Error("Not triggered when should have");
            }
            else {
                throw new Error("Wrong trigger");
            }
        }
        else if (observer.getAdditionalData() != expectedAdditional) {
            throw new Error("Incorrect additional data received");
        }
    });
});

test("Test notifyClientConnectionStatus() for client disconnection", (): void => {
    const o1: IRoomObserverStub = new IRoomObserverStub();
    const o2: IRoomObserverStub = new IRoomObserverStub();

    const shouldRun: IRoomObserverStub[] = [o1, o2];
    const expectedTrigger: string = "left";

    stream.attach(0, o1, o2);

    stream.notifyClientConnectionStatus(StreamEvents.CLIENT_DISCONNECTED, null);

    shouldRun.forEach((observer: IRoomObserverStub): void => {
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
    stream.attach(0, new IRoomObserverStub());

    expect((): void => stream.notifyClientConnectionStatus(null, null)).toThrow(Error);
});

test("Test notifyClientMessage()", (): void => {
    const o1: IRoomObserverStub = new IRoomObserverStub();
    const o2: IRoomObserverStub = new IRoomObserverStub();
    const o3: IRoomObserverStub = new IRoomObserverStub();

    const shouldReceive: IRoomObserverStub[] = [o1, o2];
    const shouldNotReceive: IRoomObserverStub[] = [o3];
    const expectedTrigger: string = "test message"

    stream.attach(0, o1, o2);
    stream.attach(1, o3);
    stream.notifyClientMessage(0, null, {roomId: 0, text: expectedTrigger});

    shouldReceive.forEach((observer: IRoomObserverStub): void => {
        if (observer.getTrigger() != expectedTrigger) {
            if (observer.getTrigger().length == 0) {
                throw new Error("Not triggered when expected");
            }
            else {
                throw new Error("Incorrect message received");
            }
        }
    });

    shouldNotReceive.forEach((observer: IRoomObserverStub): void => {
        if (observer.getTrigger().length > 0) {
            throw new Error("Triggered when not expected");
        }
    });
});