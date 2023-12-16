import Client from "../lib/Client";

import {Server, Socket} from "socket.io";

/**
 * Abstract representation of a class that listens and broadcasts on a socket.io server
 * @author Connell Reffo
 */
export default abstract class AbstractStreamer {

    protected io: Server;
    protected connections: Map<Socket, Client>;

    protected constructor(io: Server) {
        this.io = io;
        this.connections = new Map<Socket, Client>();
    }

    public abstract listen(): void;

    public getConnections(): Map<Socket, Client> {
        return this.connections;
    }
}