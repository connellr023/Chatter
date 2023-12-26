import IStreamObserver from "./IStreamObserver";
import Client from "./Client";
import ChatRoomFactory from "../lib/ChatRoomFactory";

import {Server, type Socket} from "socket.io";
import {ChatObject, config, StatusObject, StreamEvents, UserDataObject} from "../lib/utility";

/**
 * Class for managing socket.io connections
 * @author Connell Reffo
 */
export default class Stream {

    /**
     * Server object that this manager listens on
     */
    protected io: Server;

    /**
     * Map of observers indexed by the room ID they listen for messages from
     */
    protected roomObservers: Map<number, IStreamObserver[]>;

    /**
     * Map clients indexed by their corresponding socket ID
     */
    protected connections: Map<string, Client>;

    /**
     * Base constructor
     * @param io The stream.io server object to listen on
     */
    public constructor(io: Server) {
        this.io = io;
        this.roomObservers = new Map<number, IStreamObserver[]>();
        this.connections = new Map<string, Client>();
    }

    /**
     * Starts listening for incoming socket events <br />
     * <b>All observers must be attached prior to this function being run</b>
     */
    public listen(): void {
        this.io.on(StreamEvents.CLIENT_CONNECTED, (socket: Socket): void => {
            socket.on(StreamEvents.CLIENT_SEND_USERDATA, (data: UserDataObject): void => {
                socket.emit(StreamEvents.SERVER_SEND_STATUS, this.handleVerifyClient(socket, data));
            });

            socket.on(StreamEvents.CLIENT_SEND_CHAT, (data: ChatObject): void => {
                this.notifyClientMessage(data.roomId, this.connections.get(socket.id), data);
            });

            socket.on(StreamEvents.CLIENT_REQUEST_ROOMS, (): void => {
                socket.emit(StreamEvents.SERVER_SEND_ROOMS, ChatRoomFactory.encode(ChatRoomFactory.memberOf(this.connections.get(socket.id))));
            });

            socket.on(StreamEvents.CLIENT_DISCONNECTED, (): void => {
                this.handleDisconnect(socket);
            });
        });
    }

    /**
     * Attaches a sequence of observers to a specified room ID
     * @param roomId The room ID to listen for
     * @param observers The sequence of observers to attach
     */
    public attach(roomId: number, ...observers: IStreamObserver[]): void {
        if (!this.roomObservers.has(roomId)) {
            this.roomObservers.set(roomId, []);
        }

        this.roomObservers.get(roomId).push(...observers);
    }

    /**
     * Notifies room observers of a specified room ID that a client joined that room
     * @param client The client that joined
     * @param roomId The ID of the room they joined
     */
    public notifyJoin(client: Client, roomId: number): void {
        this.roomObservers.get(roomId).forEach((observer: IStreamObserver): void => {
            observer.onClientJoined(client);
        });
    }

    /**
     * Globally notifies every room observer that a client connected to the server
     * @param client The client that connected
     */
    public notifyConnect(client: Client): void {
        this.getEachObserver().forEach((observer: IStreamObserver): void => {
            observer.onClientConnected(client);
        });
    }

    /**
     * Globally notifies every room observer that a client disconnected from the server
     * @param client The client that disconnected
     */
    public notifyDisconnect(client: Client): void {
        this.getEachObserver().forEach((observer: IStreamObserver): void => {
            observer.onClientDisconnected(client);
        });
    }

    /**
     * Notifies stream observers of a specified room ID that a client sent a message
     * @param roomId The room ID the message was sent to
     * @param client The client that sent the message
     * @param data The object that encodes the message
     */
    public notifyClientMessage(roomId: number, client: Client, data: ChatObject): void {
        this.roomObservers.get(roomId).forEach((observer: IStreamObserver): void => {
            observer.onClientMessage(client, data);
        });
    }

    /**
     * Executed when <b>RECEIVE_USER</b> is triggered
     * @param socket The socket connection that triggered this event
     * @param data The object that encodes the user data received
     * @return An encoding of a status that can be sent back to the client
     */
    public handleVerifyClient(socket: Socket, data: UserDataObject): StatusObject {
        let status: StatusObject = {success: false};

        if (typeof data.username == "string") {
            if (data.username.length >= config.MIN_NAME_LENGTH && data.username.length <= config.MAX_NAME_LENGTH) {
                status.success = true;

                const client: Client = new Client(socket, data.username);

                this.connections.set(socket.id, client);
                this.notifyConnect(client);
            }
        }

        return status;
    }

    /**
     * Executed when <b>DISCONNECT</b> is triggered
     * @param socket The socket that disconnected
     */
    public handleDisconnect(socket: Socket): void {
        const client: Client = this.connections.get(socket.id);

        this.connections.delete(socket.id);
        this.notifyDisconnect(client);
    }

    /**
     * Gets a map of observers indexed by the event they listen for
     */
    public getObserverMap(): Map<number, IStreamObserver[]> {
        return this.roomObservers;
    }

    /**
     * Gets <i>exactly one</i> of each observer attached to this as a set
     */
    public getEachObserver(): Set<IStreamObserver> {
        let final: Set<IStreamObserver> = new Set<IStreamObserver>();

        this.roomObservers.forEach((observerArray: IStreamObserver[]): void => {
           observerArray.forEach((observer: IStreamObserver): void => {
                final.add(observer);
           });
        });

        return final;
    }

    /**
     * Gets a map of clients indexed by their corresponding socket ID
     */
    public getConnections(): Map<string, Client> {
        return this.connections;
    }
}