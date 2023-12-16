import {Socket} from "socket.io";

/**
 * Represents a client socket object with additional fields
 * @author Connell Reffo
 */
export default class Client {

    protected socket: Socket;
    protected name: string;

    public constructor(socket: Socket, name: string) {
        this.socket = socket;
        this.name = name;
    }

    public getSocket(): Socket {
        return this.socket;
    }

    public getName(): string {
        return this.name;
    }
}