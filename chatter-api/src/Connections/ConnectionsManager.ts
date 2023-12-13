import IConnectable from "./IConnectable";
import IStreamObserver from "../Stream/IStreamObserver";
import IConnectionObserver from "./IConnectionObserver";
import NamedIdentity from "../Lib/NamedIdentity";
import {Socket} from "socket.io";
import Client from "./Client";

/**
 * Class responsible for managing client connections to chat rooms and routing messages to the correct room
 * @author Connell Reffo
 */
export default class ConnectionsManager implements IConnectable, IStreamObserver {

    /**
     * @inheritDoc
     */
    notifyClientJoined(client: Client, room: NamedIdentity): void {
    }

    /**
     * @inheritDoc
     */
    notifyClientLeft(client: Client, room: NamedIdentity): void {
    }

    /**
     * @inheritDoc
     */
    notifyMessageSent(client: Client, message: string, room: NamedIdentity): void {
    }

    /**
     * @inheritDoc
     */
    getRooms(): Map<NamedIdentity, number> {
        return undefined;
    }

    /**
     * @inheritDoc
     */
    getSockets(): Map<Socket, NamedIdentity[]> {
        return undefined;
    }

    /**
     * @inheritDoc
     */
    getObservers(): Map<string, IConnectionObserver[]> {
        return undefined;
    }
}