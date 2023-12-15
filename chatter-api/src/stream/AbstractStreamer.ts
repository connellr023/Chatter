import {Namespace, Server} from "socket.io";
import {StrictEventEmitter} from "socket.io/dist/typed-events";
import IStreamable from "./IStreamable";

/**
 * Abstract representation of a class that listens and broadcasts on a socket.io server
 * @author Connell Reffo
 */
export default abstract class AbstractStreamer<Emitter extends Server|Namespace> implements IStreamable {

    protected io: Emitter;

    protected constructor(io: Emitter) {
        this.io = io;
    }

    public abstract listen(): void;
}