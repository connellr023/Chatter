import IManager from "../lib/IManager";
import IStreamObserver from "./IStreamObserver";

import {Server, Socket} from "socket.io";

/**
 * Abstract representation of a class that manages a set of socket stream observers <br />
 * No observer detachment functionality currently as it is not needed for this project
 * @author Connell Reffo
 */
export default interface IStreamer extends IManager<IStreamObserver> {

    /**
     * Links each attached observer to a socket.io server object <br />
     * Should only be called after all observers have been attached
     * @param io The socket.io server
     * @return The socket.io server object created
     */
    ready(io: Server): void;

    /**
     * Attaches stream observer(s) to a specified set of events
     * @throws StreamError If <i>connect</i> or <i>disconnect</i> events were passed to events parameter
     * @param events The event(s) to listen for
     * @param observers The observer(s) to be attached
     */
    attach(events: string[], ...observers: IStreamObserver[]): void;

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
}