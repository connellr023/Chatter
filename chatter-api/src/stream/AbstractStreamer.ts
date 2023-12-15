import {Namespace, Server, Socket} from "socket.io";

/**
 * Abstract representation of a class that listens and broadcasts on a socket.io server
 * @author Connell Reffo
 */
export default abstract class AbstractStreamer<Emitter extends Server|Namespace> {

    protected io: Emitter;
    protected connections: Set<Socket>;

    protected constructor(io: Emitter) {
        this.io = io;
        this.connections = new Set<Socket>();
    }

    public abstract listen(): void;

    public getConnections(): Set<Socket> {
        return this.connections;
    }
}