import {Server, Socket} from "socket.io";

/**
 * Abstract representation of a class that listens and broadcasts on a socket.io server
 * @author Connell Reffo
 */
export default abstract class AbstractStreamer {

    protected io: Server;
    protected connections: Set<Socket>;

    protected constructor(io: Server) {
        this.io = io;
        this.connections = new Set<Socket>();
    }

    public abstract listen(): void;

    public getConnections(): Set<Socket> {
        return this.connections;
    }
}