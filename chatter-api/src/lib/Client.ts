import {Socket} from "socket.io";
import {StreamEvents} from "./Utility";

/**
 * Represents a client socket with restriction on access to socket functionality
 * @author Connell Reffo
 */
export default class Client {

    protected socket: Socket;
    protected name: string;

    public constructor(socket: Socket, name: string) {
        this.socket = socket;
        this.name = name;
    }

    public emit(event: StreamEvents, data: {}): void {
        this.socket.emit(event, data);
    }

    public getName(): string {
        return this.name;
    }
}