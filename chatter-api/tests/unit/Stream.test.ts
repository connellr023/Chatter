import Stream from "../../src/stream/Stream";
import IStreamObserver from "../../src/stream/IStreamObserver";
import IStreamObserverStub from "../stubs/IStreamObserverStub";

import {Server, type Socket} from "socket.io";
import {StatusObject} from "../../src/lib/utility";

const io: Server = new Server();
let stream: Stream;

beforeEach((): void => {
    stream = new Stream(io);
});

test("attach() with multiple observers to single event", (): void => {
    const o1: IStreamObserver = new IStreamObserverStub();
    const o2: IStreamObserver = new IStreamObserverStub();

    const expected: Map<number, IStreamObserver[]> = new Map<number, IStreamObserver[]>([[0, [o1, o2]]]);

    stream.attach(0, o1, o2);

    expect(stream.getObserverMap()).toStrictEqual(expected);
});

test("attach() with multiple observers to multiple events", (): void => {
    const o1: IStreamObserver = new IStreamObserverStub();
    const o2: IStreamObserver = new IStreamObserverStub();
    const o3: IStreamObserver = new IStreamObserverStub();

    const expected: Map<number, IStreamObserver[]> = new Map<number, IStreamObserver[]>([[0, [o1, o2]], [1, [o1, o2, o3]], [2, [o2]]]);

    stream.attach(0, o1, o2);
    stream.attach(1, o1, o2, o3);
    stream.attach(2, o2);

    expect(stream.getObserverMap()).toStrictEqual(expected);
});

test("getEachObserver() has no duplicate instances", (): void => {
    const o1: IStreamObserver = new IStreamObserverStub();
    const o2: IStreamObserver = new IStreamObserverStub();
    const o3: IStreamObserver = o1;

    const expected: IStreamObserver[] = [o1, o2];

    stream.attach(0, o1);
    stream.attach(1, o2, o3);

    const actual: IStreamObserver[] = Array.from(stream.getEachObserver());

    expect(actual).toStrictEqual(expected);
});

test("onReceiveUser() with username too long", (): void => {
    const socket: Socket = null as Socket;
    const status: StatusObject = stream.handleVerifyClient(socket, {username: "aaaaaaaaaaaaaaaa"});

    expect(status.success).toBe(false);
});

test("onReceiveUser() with username too short", (): void => {
    const socket: Socket = null as Socket;
    const status: StatusObject = stream.handleVerifyClient(socket, {username: ""});

    expect(status.success).toBe(false);
});

test("notifyJoin() notifies only select observers properly", (): void => {
    const o1: IStreamObserverStub = new IStreamObserverStub();
    const o2: IStreamObserverStub = new IStreamObserverStub();

    const shouldRun: IStreamObserverStub[] = [o1];
    const shouldNotRun: IStreamObserver[] = [o2];

    const expectedTrigger: string = "join";

    stream.attach(0, o1);
    stream.attach(1, o2);
    stream.notifyJoin(null, 0);

    shouldRun.forEach((observer: IStreamObserverStub): void => {
        if (observer.getTrigger() != expectedTrigger) {
            if (observer.getTrigger().length == 0) {
                throw new Error("Not triggered when should have");
            }
            else {
                throw new Error("Wrong trigger");
            }
        }
    });

    shouldNotRun.forEach((observer: IStreamObserverStub): void => {
        if (observer.getTrigger() != "") {
            throw new Error("Triggered when not expected to");
        }
    });
});

test("notifyConnect() notifies all observers properly", (): void => {
    const o1: IStreamObserverStub = new IStreamObserverStub();
    const o2: IStreamObserverStub = new IStreamObserverStub();

    const shouldRun: IStreamObserverStub[] = [o1, o2];
    const expectedTrigger: string = "connect";

    stream.attach(0, o1, o2);
    stream.notifyConnect(null);

    shouldRun.forEach((observer: IStreamObserverStub): void => {
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

test("notifyDisconnect() notifies all observers properly", (): void => {
    const o1: IStreamObserverStub = new IStreamObserverStub();
    const o2: IStreamObserverStub = new IStreamObserverStub();

    const shouldRun: IStreamObserverStub[] = [o1, o2];
    const expectedTrigger: string = "disconnect";

    stream.attach(0, o1, o2);
    stream.notifyDisconnect(null);

    shouldRun.forEach((observer: IStreamObserverStub): void => {
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

test("notifyClientMessage() notifies only select observers properly", (): void => {
    const o1: IStreamObserverStub = new IStreamObserverStub();
    const o2: IStreamObserverStub = new IStreamObserverStub();
    const o3: IStreamObserverStub = new IStreamObserverStub();

    const shouldReceive: IStreamObserverStub[] = [o1, o2];
    const shouldNotReceive: IStreamObserverStub[] = [o3];
    const expectedTrigger: string = "message"

    stream.attach(0, o1, o2);
    stream.attach(1, o3);
    stream.notifyClientMessage(0, null, {roomId: 0, text: expectedTrigger});

    shouldReceive.forEach((observer: IStreamObserverStub): void => {
        if (observer.getTrigger() != expectedTrigger) {
            if (observer.getTrigger().length == 0) {
                throw new Error("Not triggered when expected");
            }
            else {
                throw new Error("Incorrect message received");
            }
        }
    });

    shouldNotReceive.forEach((observer: IStreamObserverStub): void => {
        if (observer.getTrigger().length > 0) {
            throw new Error("Triggered when not expected");
        }
    });
});