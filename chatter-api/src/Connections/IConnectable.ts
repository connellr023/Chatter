import IManager from "../Lib/IManager";
import IConnectionObserver from "./IConnectionObserver";
import Client from "./Client";
import NamedIdentity from "../Lib/NamedIdentity";

import {Socket} from "socket.io";

/**
 * Abstract representation of a class that is responsible for managing client connections to a socket stream
 * @author Connell Reffo
 */
export default interface IConnectable extends IManager<IConnectionObserver> {

    /**
     * Notifies all connection observers of a specific room that a client joined <br />
     * Each observer will be notified <i>exactly once</i>
     * @param client The client object
     * @param room Is the room that the client joined
     */
    notifyClientJoined(client: Client, room: NamedIdentity): void;

    /**
     * Notifies all connection observers of a specific room that client left <br />
     * Each observer will be notified <i>exactly once</i>
     * @param client The client object
     * @param room Is the room that the client left
     */
    notifyClientLeft(client: Client, room: NamedIdentity): void;

    /**
     * Notifies all connection observers of a specific room that a client sent a message <br />
     * Each observer will be notified <i>exactly once</i>
     * @param client The client object
     * @param message The message they sent
     * @param room Is the room they sent the message in
     */
    notifyMessageSent(client: Client, message: string, room: NamedIdentity): void;

    /**
     * Gets a mapping of room objects to the number of members in them
     */
    getRooms(): Map<NamedIdentity, number>;

    /**
     * Gets a mapping of sockets to an array of room objects they are connected to
     */
    getSockets(): Map<Socket, NamedIdentity[]>;
}