import IConnectionObserver from "../connections/IConnectionObserver";
import IMessageable from "./IMessageable";
import ResponseObject from "./ResponseObject";

/**
 * Class responsible for tracking client action in a chat room
 * @author Connell Reffo
 */
export default class ChatRoom implements IConnectionObserver, IMessageable {

    /**
     * @inheritDoc
     */
    public send(data: ResponseObject): void {
    }
}