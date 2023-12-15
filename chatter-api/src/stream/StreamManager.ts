import IStreamer from "./IStreamer";
import IStreamObserver from "./IStreamObserver";

import {SocketEvents} from "./SocketEvents";
import {Server, Socket} from "socket.io";
import StreamError from "../exceptions/StreamException";
import AbstractManager from "../lib/AbstractManager";

/**
 * Class responsible for managing a set of socket stream observers
 * @author Connell Reffo
 */
export default class StreamManager extends AbstractManager<IStreamObserver> {

    /**
     * @inheritDoc
     */
    public ready(io: Server): void {
        io.on(SocketEvents.CONNECTION, (socket: Socket): void => {
            this.notifySocketConnected(socket);

            socket.on(SocketEvents.DISCONNECT, (): void => {
                this.notifySocketDisconnected(socket);
            });

            this.observers.forEach((observers: IStreamObserver[], event: string): void => {
                observers.forEach((observer: IStreamObserver): void => {
                    socket.on(event, (data: {}): void => {
                        observer.onReceived(socket, event, data);
                    });
                });
            });
        });
    }

    /**
     * @inheritDoc
     */
    public attach(events: string[], ...observers: IStreamObserver[]): void {
        events.forEach((event: string): void => {
            if ([SocketEvents.CONNECTION.toString(), SocketEvents.DISCONNECT.toString()].includes(event)) {
                throw new StreamError(`Not allowed to use: "${event}" as an event for stream observers`);
            }

            if (!this.observers.has(event)) {
                this.observers.set(event, []);
            }

            this.observers.get(event)?.push(...observers);
        });
    }

    /**
     * @inheritDoc
     */
    public notifySocketConnected(socket: Socket): void {
        this.getJustObservers().forEach((observer: IStreamObserver): void => {
            observer.onSocketConnected(socket);
        });
    }

    /**
     * @inheritDoc
     */
    public notifySocketDisconnected(socket: Socket): void {
        this.getJustObservers().forEach((observer: IStreamObserver): void => {
            observer.onSocketDisconnected(socket);
        });
    }
}