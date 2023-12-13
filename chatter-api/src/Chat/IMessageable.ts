import ResponseObject from "./ResponseObject";

/**
 * Abstract representation of a class that can send messages over a socket stream
 * @author Connell Reffo
 */
export default interface IMessageable {

    /**
     * Sends a response object over a socket stream
     * @param data The data as a response object to send
     */
    send(data: ResponseObject): void;
}