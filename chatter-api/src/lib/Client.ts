import {Socket} from "socket.io";

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

    public send(data: {}): void {
        this.socket.send(data);
    }

    public getName(): string {
        return this.name;
    }
}