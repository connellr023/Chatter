import StreamManager from "../src/stream/StreamManager";
import IStreamObserver from "../src/stream/IStreamObserver";
import IStreamable from "../src/stream/IStreamable";

import {SocketEvents} from "../src/stream/SocketEvents";
import {Socket} from "socket.io";

let sm: IStreamable;

beforeEach((): void => {
    sm = new StreamManager();
});

afterEach((): void => {
   sm = null;
});

test("Register single observer to single event", (): void => {
    let event = SocketEvents.CONNECT;
    let observer = new StreamObserverStub();

    let expected = new Map<SocketEvents|string, IStreamObserver[]>();
    expected.set(event, [observer]);

    sm.attach([event], observer);

    expect(sm.getObservers()).toStrictEqual(expected);
});

test("Register single observer to multiple events", (): void => {
    let events = ["test1", "test2"];
    let observer = new StreamObserverStub();

    let expected = new Map<string, IStreamObserver[]>();
    expected.set(events[0], [observer]);
    expected.set(events[1], [observer]);

    sm.attach(events, observer);

    expect(sm.getObservers()).toStrictEqual(expected);
});

test("Register multiple observers to single event", (): void => {
    let event = SocketEvents.CONNECT;
    let observer1 = new StreamObserverStub();
    let observer2 = new StreamObserverStub();

    let expected = new Map<string, IStreamObserver[]>();
    expected.set(event, [observer1, observer2]);

    sm.attach([event], observer1, observer2);

    expect(sm.getObservers()).toStrictEqual(expected);
});

class StreamObserverStub implements IStreamObserver {

    private trigger: string;

    public constructor() {
        this.trigger = "";
    }

    public onReceived(socket: Socket, event: SocketEvents, data: Object): void {
        this.trigger = "receive";
    }

    public onSocketConnected(socket: Socket): void {
        this.trigger = "connect";
    }

    public onSocketDisconnected(socket: Socket): void {
        this.trigger = "disconnect";
    }

    public getTrigger(): string {
        return this.trigger;
    }
}