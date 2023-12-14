import IManager from "../lib/IManager";
import IStreamObserver from "./IStreamObserver";

import {Socket} from "socket.io";
import {SocketEvents} from "./SocketEvents";

/**
 * Abstract representation of a class that manages a set of socket stream observers <br />
 * No observer detachment functionality currently as it is not needed for this project
 * @author Connell Reffo
 */
export default interface IStreamable extends IManager<IStreamObserver> {

    /**
     * Attaches a stream observe
     * @param events The event(s) to listen for
     * @param observers The observer(s) to be attached
     */
    attach(events: SocketEvents[]|string[], ...observers: IStreamObserver[]): void;

    /**
     * Notifies all observers that a socket connected <br />
     * Each observer will be notified <i>exactly once</i>
     * @param socket The socket of the data sender
     */
    notifySocketConnected(socket: Socket): void;

    /**
     * Notifies all observers that a socket disconnected <br />
     * Each observer will be notified <i>exactly once</i>
     * @param socket The socket of the data sender
     */
    notifySocketDisconnected(socket: Socket): void;

    /**
     * Notifies observers registered to the event triggered <br />
     * Each observer will be notified <i>exactly once</i>
     * @param socket The socket of the data sender
     * @param event The event that triggered it (some observers may be registered to multiple events)
     * @param data The data sent
     */
    notifyDataReceived(socket: Socket, event: SocketEvents|string, data: Object): void;
}