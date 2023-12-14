import IConnectable from "./IConnectable";
import IStreamObserver from "../stream/IStreamObserver";
import IConnectionObserver from "./IConnectionObserver";
import NamedIdentity from "../lib/NamedIdentity";
import Client from "./Client";

import {Socket} from "socket.io";
import {SocketEvents} from "../stream/SocketEvents";

/**
 * Class responsible for managing client connections to chat rooms and routing messages to the correct room
 * @author Connell Reffo
 */
export default class ConnectionsManager implements IConnectable, IStreamObserver {

    /**
     * @inheritDoc
     */
    public onReceived(socket: Socket, event: SocketEvents | string, data: Object): void {
    }

    /**
     * @inheritDoc
     */
    public onSocketConnected(socket: Socket): void {
    }

    /**
     * @inheritDoc
     */
    public onSocketDisconnected(socket: Socket): void {
    }

    /**
     * @inheritDoc
     */
    public notifyClientJoined(client: Client, room: NamedIdentity): void {
    }

    /**
     * @inheritDoc
     */
    public notifyClientLeft(client: Client, room: NamedIdentity): void {
    }

    /**
     * @inheritDoc
     */
    public notifyMessageSent(client: Client, message: string, room: NamedIdentity): void {
    }

    /**
     * @inheritDoc
     */
    public getRooms(): Map<NamedIdentity, number> {
        return undefined;
    }

    /**
     * @inheritDoc
     */
    public getSockets(): Map<Socket, NamedIdentity[]> {
        return undefined;
    }

    /**
     * @inheritDoc
     */
    public getObservers(): Map<string, IConnectionObserver[]> {
        return undefined;
    }
}