import Stream from "../src/stream/Stream";
import IStreamObserver from "../src/stream/IStreamObserver";
import Client from "../src/lib/Client";

import {Server, Socket} from "socket.io";
import {ReceiveChatObject, StreamEvents} from "../src/lib/Utility";

const io: Server = new Server();
let stream: Stream;

beforeEach((): void => {
    stream = new Stream(io);
});

test("Test attach multiple observers to single event", (): void => {
    const o1: IStreamObserver = new StreamObserverStub();
    const o2: IStreamObserver = new StreamObserverStub();

    const expected: Map<number, IStreamObserver[]> = new Map<number, IStreamObserver[]>([[0, [o1, o2]]]);

    stream.attach(0, o1, o2);

    expect(stream.getObserverMap()).toStrictEqual(expected);
});

test("Test attach multiple observers to multiple events", (): void => {
    const o1: IStreamObserver = new StreamObserverStub();
    const o2: IStreamObserver = new StreamObserverStub();
    const o3: IStreamObserver = new StreamObserverStub();

    const expected: Map<number, IStreamObserver[]> = new Map<number, IStreamObserver[]>([[0, [o1, o2]], [1, [o1, o2, o3]], [2, [o2]]]);

    stream.attach(0, o1, o2);
    stream.attach(1, o1, o2, o3);
    stream.attach(2, o2);

    expect(stream.getObserverMap()).toStrictEqual(expected);
});

test("Test get exactly one of each observer", (): void => {
    const o1: IStreamObserver = new StreamObserverStub();
    const o2: IStreamObserver = new StreamObserverStub();
    const o3: IStreamObserver = o1;

    const expected: IStreamObserver[] = [o1, o2];

    stream.attach(0, o1);
    stream.attach(1, o2, o3);

    const actual: IStreamObserver[] = Array.from(stream.getEachObserver());

    expect(actual).toStrictEqual(expected);
});

test("Test on receive user", (): void => {
    const socket: Socket = null as Socket; // Hack to mock socket.io socket object
    const client: Client = new Client(socket, "alice");

    const expected: Map<Socket, Client> = new Map<Socket, Client>([[socket, client]]);

    stream.onReceiveUser(socket, {username: "alice"});

    expect(stream.getConnections()).toStrictEqual(expected);
});

test("Test on disconnect", (): void => {
    const socket: Socket = null as Socket;
    const expected: Map<Socket, Client> = new Map<Socket, Client>();

    stream.onReceiveUser(socket, {username: "alice"});
    stream.onDisconnect(socket);

    expect(stream.getConnections()).toStrictEqual(expected);
});

test("Test notify connect", (): void => {
    const o1: StreamObserverStub = new StreamObserverStub();
    const o2: StreamObserverStub = new StreamObserverStub();

    const shouldRun: StreamObserverStub[] = [o1, o2];
    const expectedTrigger: string = "join";

    stream.attach(0, o1, o2);

    stream.notifyClientConnectionStatus(StreamEvents.RECEIVE_USER, null);

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

test("Test notify disconnect", (): void => {
    const o1: StreamObserverStub = new StreamObserverStub();
    const o2: StreamObserverStub = new StreamObserverStub();

    const shouldRun: StreamObserverStub[] = [o1, o2];
    const expectedTrigger: string = "left";

    stream.attach(0, o1, o2);

    stream.notifyClientConnectionStatus(StreamEvents.DISCONNECT, null);

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

test("Test attempt to notify invalid connection event", (): void => {
    stream.attach(0, new StreamObserverStub());

    expect((): void => stream.notifyClientConnectionStatus(null, null)).toThrow(Error);
});

class StreamObserverStub implements IStreamObserver {

    private trigger: string;

    public constructor() {
        this.trigger = "";
    }

    public onClientJoined(client: Client): void {
        this.trigger = "join";
    }

    public onClientLeft(client: Client): void {
        this.trigger = "left";
    }

    public onClientMessage(client: Client, message: ReceiveChatObject): void {
        this.trigger = "message";
    }

    public getTrigger(): string {
        return this.trigger;
    }
}