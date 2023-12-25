import IRoomObserver from "../connections/IRoomObserver";
import Client from "../connections/Client";
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
    protected roomObservers: Map<number, IRoomObserver[]>;

    /**
     * Map of client listeners indexed by the services event they listen for
     */
    protected clientListeners: Map<StreamEvents|string, ClientListenerCallback[]>;

    /**
     * Map clients indexed by their corresponding socket ID
     */
    protected connections: Map<string, Client>;

    /**
     * Base constructor
     * @param io The services.io server object to listen on
     */
    public constructor(io: Server) {
        this.io = io;
        this.roomObservers = new Map<number, IRoomObserver[]>();
        this.clientListeners = new Map<StreamEvents|string, ClientListenerCallback[]>();
        this.connections = new Map<string, Client>();
    }

    /**
     * Starts listening for incoming socket events <br />
     * <b>All observers and listeners must be attached prior to this function being run</b>
     */
    public listen(): void {
        this.register(StreamEvents.CLIENT_SEND_CHAT, (client: Client, data: ChatObject): void => {
            this.notifyClientMessage(data.roomId, client, data);
        });

        this.register(StreamEvents.CLIENT_REQUEST_ROOMS, (client: Client): void => {
            client.emit(StreamEvents.SERVER_SEND_ROOMS, ChatRoomFactory.encode(ChatRoomFactory.memberOf(client)));
        });

        this.register(StreamEvents.CLIENT_SEND_USERDATA, (client: Client, data: UserDataObject): void => {
            client.emit(StreamEvents.SERVER_SEND_STATUS, this.handleReceiveUser(client, data));
        });

        this.register(StreamEvents.CLIENT_DISCONNECTED, this.handleDisconnect);

        this.io.on(StreamEvents.CLIENT_CONNECTED, (socket: Socket): void => {

            // Activate client listeners
            this.clientListeners.forEach((listeners: ClientListenerCallback[], event: StreamEvents|string): void => {
                socket.on(event, (data: any): void => {
                    listeners.forEach((listener: ClientListenerCallback): void => listener(this.connections.get(socket.id), data));
                });
            });
        });
    }

    /**
     * Attaches a sequence of observers to a specified room ID
     * @param roomId The room ID to listen for
     * @param observers The sequence of observers to attach
     */
    public attach(roomId: number, ...observers: IRoomObserver[]): void {
        if (!this.roomObservers.has(roomId)) {
            this.roomObservers.set(roomId, []);
        }

        this.roomObservers.get(roomId).push(...observers);
    }

    /**
     * Facade for listening for socket interactions through a client object
     * @param event The services event to listen for
     * @param listeners A sequence of callbacks to be executed when the event is triggered
     */
    public register(event: StreamEvents|string, ...listeners: ClientListenerCallback[]): void {
        if (!this.clientListeners.has(event)) {
            this.clientListeners.set(event, []);
        }

        this.clientListeners.get(event).push(...listeners);
    }

    /**
     * Notifies room observers of a specified room ID that a client joined that room
     * @param client The client that joined
     * @param roomId The ID of the room they joined
     */
    public notifyJoin(client: Client, roomId: number): void {
        this.roomObservers.get(roomId).forEach((observer: IRoomObserver): void => {
            observer.onClientJoined(client);
        });
    }

    /**
     * Globally notifies every room observer that a client connected to the server
     * @param client The client that connected
     */
    public notifyConnect(client: Client): void {
        this.getEachObserver().forEach((observer: IRoomObserver): void => {
            observer.onClientConnected(client);
        });
    }

    /**
     * Globally notifies every room observer that a client disconnected from the server
     * @param client The client that disconnected
     */
    public notifyDisconnect(client: Client): void {
        this.getEachObserver().forEach((observer: IRoomObserver): void => {
            observer.onClientDisconnected(client);
        });
    }

    /**
     * Notifies services observers of a specified room ID that a client sent a message
     * @param roomId The room ID the message was sent to
     * @param client The client that sent the message
     * @param data The object that encodes the message
     */
    public notifyClientMessage(roomId: number, client: Client, data: ChatObject): void {
        this.roomObservers.get(roomId).forEach((observer: IRoomObserver): void => {
            observer.onClientMessage(client, data);
        });
    }

    /**
     * Executed when <b>RECEIVE_USER</b> is triggered
     * @param client The client that triggered this event
     * @param data The object that encodes the user data received
     * @return An encoding of a status that can be sent back to the client
     */
    public handleReceiveUser(client: Client, data: UserDataObject): StatusObject {
        let status: StatusObject = {success: false};

        if (typeof data.username == "string") {
            if (data.username.length >= config.MIN_NAME_LENGTH && data.username.length <= config.MAX_NAME_LENGTH) {
                status.success = true;

                this.connections.set(client.getSocketID(), client);
                this.notifyConnect(client);
            }
        }

        return status;
    }

    /**
     * Executed when <b>DISCONNECT</b> is triggered
     * @param client The client that disconnected
     */
    public handleDisconnect(client: Client): void {
        this.connections.delete(client.getSocketID());
        this.notifyDisconnect(client);
    }

    /**
     * Gets a map of observers indexed by the event they listen for
     */
    public getObserverMap(): Map<number, IRoomObserver[]> {
        return this.roomObservers;
    }

    /**
     * Gets <i>exactly one</i> of each observer attached to this as a set
     */
    public getEachObserver(): Set<IRoomObserver> {
        let final: Set<IRoomObserver> = new Set<IRoomObserver>();

        this.roomObservers.forEach((observerArray: IRoomObserver[]): void => {
           observerArray.forEach((observer: IRoomObserver): void => {
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

type ClientListenerCallback = (client: Client, data?: any) => void;