import {type Socket} from "socket.io";
import {StreamEvents} from "../lib/utility";

/**
 * Represents a client services with restriction on access to services functionality
 * @author Connell Reffo
 */
export default class Client {

    /**
     * The services.io services object this client corresponds to
     */
    protected socket: Socket;

    /**
     * The name of this client
     */
    protected name: string;

    /**
     * Base constructor
     * @param socket The corresponding services object for this client
     * @param name The name of this client
     */
    public constructor(socket: Socket, name: string) {
        this.socket = socket;
        this.name = name;
    }

    /**
     * Emits an event and message over this client's services services
     * @param event The event to emit
     * @param data The data to be sent
     */
    public emit(event: StreamEvents|string, data: {}): void {
        this.socket.emit(event, data);
    }

    /**
     * Gets the name of this client
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Gets the ID of this client's socket.io object
     */
    public getSocketID(): string {
        return this.socket.id;
    }
}