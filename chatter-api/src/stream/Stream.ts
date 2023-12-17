import IStreamObserver from "./IStreamObserver";
import IObservable from "../lib/IObservable";
import Client from "../lib/Client";
import ChatRoom from "../chat/ChatRoom";

import {Server, Socket} from "socket.io";
import {config, ReceiveChatObject, ReceiveUserDataObject, StatusObject, StreamEvents} from "../lib/Utility";

/**
 * Class for setting up socket.io stream
 * @author Connell Reffo
 */
export default class Stream implements IObservable<number, IStreamObserver> {

    /**
     * Server object that this stream listens on
     */
    protected io: Server;

    /**
     * Map of stream observers indexed by the room ID they listen for messages from
     */
    protected observers: Map<number, IStreamObserver[]>;

    /**
     * Map clients indexed by their corresponding socket connection
     */
    protected connections: Map<Socket, Client>;

    /**
     * Base constructor
     * @param io The socket.io server object to listen on
     */
    public constructor(io: Server) {
        this.io = io;
        this.observers = new Map<number, IStreamObserver[]>();
        this.connections = new Map<Socket, Client>();
    }

    /**
     * @inheritDoc
     */
    public attach(roomId: number, ...observers: IStreamObserver[]): void {
        this.observers.set(roomId, observers);
    }

    /**
     * Notifies <i>exactly one</i> of each stream observer that a client has either connected or disconnected from a room
     * @param event Either <b>RECEIVE_USER</b> or <b>DISCONNECT</b>
     * @param client The object that represents the client that triggered the specified stream event
     */
    public notifyClientConnectionStatus(event: StreamEvents.RECEIVE_USER|StreamEvents.DISCONNECT, client: Client): void {
        this.getEachObserver().forEach((observer: IStreamObserver): void => {
            switch (event) {
                case StreamEvents.RECEIVE_USER:
                    observer.onClientConnected(client);
                    break;
                case StreamEvents.DISCONNECT:
                    observer.onClientDisconnected(client);
                    break;
                default:
                    throw new Error("Invalid event argument supplied");
            }
        });
    }

    /**
     * Notifies stream observers of a specified room ID that a client sent a message
     * @param roomId The room ID the message was sent to
     * @param client The client that sent the message
     * @param data The object that encodes the message
     */
    public notifyClientMessage(roomId: number, client: Client, data: ReceiveChatObject): void {
        this.observers.get(roomId).forEach((observer: IStreamObserver): void => {
            observer.onClientMessage(client, data);
        });
    }

    /**
     * Starts listening on the socket server
     */
    public listen(): void {
        this.io.on(StreamEvents.CONNECTION, (socket: Socket): void => {
            socket.on(StreamEvents.RECEIVE_USER, (data: ReceiveUserDataObject): void => {
                socket.send(this.onReceiveUser(socket, data));
            });

            socket.on(StreamEvents.RECEIVE_CHAT, (data: ReceiveChatObject): void => {
                this.notifyClientMessage(data.roomId, this.connections.get(socket), data);
            });

            socket.on(StreamEvents.REQUEST_ROOMS, (): void => {
                socket.send(ChatRoom.Factory.encode());
            });

            socket.on(StreamEvents.DISCONNECT, (): void => {
                this.onDisconnect(socket);
            });
        });
    }

    /**
     * Triggered when <b>RECEIVE_USER</b> is triggered
     * @param socket The socket that triggered this event
     * @param data The object that encodes the user data received
     * @return An encoding of a status that can be sent back to the client
     */
    public onReceiveUser(socket: Socket, data: ReceiveUserDataObject): StatusObject {
        const client: Client = new Client(socket, data.username);
        let status: StatusObject = {success: true};

        if (data.username.length < config.MIN_NAME_LENGTH || data.username.length > config.MAX_NAME_LENGTH) {
            status.success = false;
        }
        else {
            this.connections.set(socket, client);
            this.notifyClientConnectionStatus(StreamEvents.RECEIVE_USER, client);
        }

        return status;
    }

    /**
     * Triggered when <b>DISCONNECT</b> is triggered
     * @param socket The socket that triggered this event
     */
    public onDisconnect(socket: Socket): void {
        const client: Client = this.connections.get(socket);

        this.connections.delete(socket);
        this.notifyClientConnectionStatus(StreamEvents.DISCONNECT, client);
    }

    /**
     * @inheritDoc
     */
    public getObserverMap(): Map<number, IStreamObserver[]> {
        return this.observers;
    }

    /**
     * @inheritDoc
     */
    public getEachObserver(): Set<IStreamObserver> {
        let final: Set<IStreamObserver> = new Set<IStreamObserver>();

        this.observers.forEach((observerArray: IStreamObserver[]): void => {
           observerArray.forEach((observer: IStreamObserver): void => {
                final.add(observer);
           });
        });

        return final;
    }

    /**
     * Gets a map of clients indexed by their corresponding socket connection
     */
    public getConnections(): Map<Socket, Client> {
        return this.connections;
    }
}