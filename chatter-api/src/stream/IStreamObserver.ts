import Client from "./Client";

import {ChatObject} from "../lib/utility";

/**
 * Abstract representation of a class that observes events on a chat stream
 * @author Connell Reffo
 */
export default interface IStreamObserver {

    /**
     * Triggered when a client connected to the stream
     * @param client The client object that connected
     * @param additional Is additional data that can be passed to stream observers
     */
    onClientConnected(client: Client, additional?: {}): void;

    /**
     * Triggered when a client disconnects from the stream
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