import IStreamable from "./IStreamable";
import IStreamObserver from "./IStreamObserver";

import {SocketEvents} from "./SocketEvents";
import {Socket} from "socket.io";

/**
 * Class responsible for managing a set of socket stream observers
 * @author Connell Reffo
 */
export default class StreamManager implements IStreamable {

    /**
     * Map of stream observers indexed by the event they listen for
     */
    protected observers: Map<SocketEvents, IStreamObserver[]>;

    /**
     * Base constructor
     */
    public constructor() {
        this.observers = new Map<SocketEvents, IStreamObserver[]>();
    }

    /**
     * @inheritDoc
     */
    public attach(events: SocketEvents[]|string[], ...observers: IStreamObserver[]): void {
        events.forEach((event: SocketEvents): void => {
            if (!this.observers.has(event)) {
                this.observers.set(event, []);
            }

            this.observers.get(event).push(...observers);
        });
    }

    /**
     * @inheritDoc
     */
    public notifyDataReceived(socket: Socket, event: SocketEvents, data: Object): void {
    }

    /**
     * @inheritDoc
     */
    public notifySocketConnected(socket: Socket): void {
    }

    /**
     * @inheritDoc
     */
    public notifySocketDisconnected(socket: Socket): void {
    }

    /**
     * @inheritDoc
     */
    public getObservers(): Map<SocketEvents|string, IStreamObserver[]> {
        return this.observers;
    }
}