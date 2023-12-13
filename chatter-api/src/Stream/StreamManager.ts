import IStreamable from "./IStreamable";
import {SocketEvents} from "./SocketEvents";
import IStreamObserver from "./IStreamObserver";
import {Socket} from "socket.io";

/**
 * Class responsible for managing a set of socket stream observers
 * @author Connell Reffo
 */
export default class StreamManager implements IStreamable {

    /**
     * @inheritDoc
     */
    attach(events: SocketEvents[], ...observers: IStreamObserver[]): void {
    }

    /**
     * @inheritDoc
     */
    notifyDataReceived(socket: Socket, event: SocketEvents, data: Object): void {
    }

    /**
     * @inheritDoc
     */
    notifySocketConnected(socket: Socket): void {
    }

    /**
     * @inheritDoc
     */
    notifySocketDisconnected(socket: Socket): void {
    }

    /**
     * @inheritDoc
     */
    getObservers(): Map<string, IStreamObserver[]> {
        return undefined;
    }
}