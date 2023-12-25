import Stream from "../../src/services/Stream";
import IRoomObserver from "../../src/connections/IRoomObserver";
import IRoomObserverStub from "../stubs/IRoomObserverStub";

import {Server, type Socket} from "socket.io";
import {StatusObject} from "../../src/lib/utility";

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

test("Test onReceiveUser() with username too long", (): void => {
    const socket: Socket = null as Socket;
    const status: StatusObject = stream.handleVerifyClient(socket, {username: "aaaaaaaaaaaaaaaa"});

    expect(status.success).toBe(false);
});

test("Test onReceiveUser() with username too short", (): void => {
    const socket: Socket = null as Socket;
    const status: StatusObject = stream.handleVerifyClient(socket, {username: ""});

    expect(status.success).toBe(false);
});

test("Test notifyJoin()", (): void => {
    const o1: IRoomObserverStub = new IRoomObserverStub();
    const o2: IRoomObserverStub = new IRoomObserverStub();

    const shouldRun: IRoomObserverStub[] = [o1];
    const shouldNotRun: IRoomObserver[] = [o2];

    const expectedTrigger: string = "join";

    stream.attach(0, o1);
    stream.attach(1, o2);
    stream.notifyJoin(null, 0);

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

    shouldNotRun.forEach((observer: IRoomObserverStub): void => {
        if (observer.getTrigger() != "") {
            throw new Error("Triggered when not expected to");
        }
    });
});

test("Test notifyConnect()", (): void => {
    const o1: IRoomObserverStub = new IRoomObserverStub();
    const o2: IRoomObserverStub = new IRoomObserverStub();

    const shouldRun: IRoomObserverStub[] = [o1, o2];
    const expectedTrigger: string = "connect";

    stream.attach(0, o1, o2);
    stream.notifyConnect(null);

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

test("Test notifyDisconnect()", (): void => {
    const o1: IRoomObserverStub = new IRoomObserverStub();
    const o2: IRoomObserverStub = new IRoomObserverStub();

    const shouldRun: IRoomObserverStub[] = [o1, o2];
    const expectedTrigger: string = "disconnect";

    stream.attach(0, o1, o2);
    stream.notifyDisconnect(null);

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