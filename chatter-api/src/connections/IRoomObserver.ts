import Client from "./Client";

import {ChatObject} from "../lib/utility";

/**
 * Abstract representation of a class that observes events on a chat room
 * @author Connell Reffo
 */
export default interface IRoomObserver {

    /**
     * Triggered when a client joins the room this observer watches
     * @param client The client joined
     */
    onClientJoined(client: Client): void;

    /**
     * Triggered when any client connects to the server
     * @param client The client that connected
     */
    onClientConnected(client: Client): void;

    /**
     * Triggered when a client disconnects from the room
     * @param client The client object that disconnected
     */
    onClientDisconnected(client: Client): void;

    /**
     * Triggered when a client sends a message to room listened on by this
     * @param client The client that sent the message
     * @param message The object that encodes the received message
     */
    onClientMessage(client: Client, message: ChatObject): void;
}