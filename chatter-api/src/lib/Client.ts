import {Socket} from "socket.io";
import {StreamEvents} from "./utility";

/**
 * Represents a client socket with restriction on access to socket functionality
 * @author Connell Reffo
 */
export default class Client {

    /**
     * The socket.io socket object this client corresponds to
     */
    protected socket: Socket;

    /**
     * The name of this client
     */
    protected name: string;

    /**
     * Base constructor
     * @param socket The corresponding socket object for this client
     * @param name The name of this client
     */
    public constructor(socket: Socket, name: string) {
        this.socket = socket;
        this.name = name;
    }

    /**
     * Emits an event and message over this client's socket connection
     * @param event The event to emit
     * @param data The data to be sent
     */
    public emit(event: StreamEvents, data: {}): void {
        this.socket.emit(event, data);
    }

    /**
     * Gets the name of this client
     */
    public getName(): string {
        return this.name;
    }
}