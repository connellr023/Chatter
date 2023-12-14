import {Socket} from "socket.io";
import {SocketEvents} from "./SocketEvents";

/**
 * Observes socket stream event(s)
 * @author Connell Reffo
 */
export default interface IStreamObserver {

    /**
     * Triggered when a socket connects to the socket stream
     * @param socket The socket object
     */
    onSocketConnected(socket: Socket): void;

    /**
     * Triggered when a socket disconnects from the socket stream
     * @param socket The socket object
     */
    onSocketDisconnected(socket: Socket): void;

    /**
     * Triggered when a socket sends a message through the stream
     * @param socket The socket object
     * @param event Is the event that triggered this observer
     * @param data The data object that was received
     */
    onReceived(socket: Socket, event: SocketEvents|string, data: Object): void;
}