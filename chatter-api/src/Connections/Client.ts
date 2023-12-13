import IMessageable from "../Chat/IMessageable";
import ResponseObject from "../Chat/ResponseObject";

import {Socket} from "socket.io";
import NamedIdentity from "../Lib/NamedIdentity";

/**
 * Class responsible for passing off socket stream messaging to other
 * classes without giving full access to the socket object
 * @author Connell Reffo
 */
export default class Client extends NamedIdentity implements IMessageable {

    /**
     * Corresponding client socket
     */
    protected socket: Socket;

    /**
     * Base constructor
     * @param socket The socket object for this client
     * @param name The name of this client
     */
    public constructor(socket: Socket, name: string) {
        super(name, socket.id);

        this.socket = socket;
    }

    /**
     * @inheritDoc
     */
    public send(data: ResponseObject): void {
    }
}