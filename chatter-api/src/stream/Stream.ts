import IStreamObserver from "./IStreamObserver";
import IObservable from "../lib/IObservable";
import Client from "../lib/Client";
import ChatRoom from "../chat/ChatRoom";

import {Server, Socket} from "socket.io";
import {ReceiveChatObject, ReceiveUserDataObject, StreamEvents} from "../lib/Utility";

/**
 * Class for setting up socket.io stream
 * @author Connell Reffo
 */
export default class Stream implements IObservable<number, IStreamObserver> {

    protected io: Server;

    protected observers: Map<number, IStreamObserver[]>;
    protected connections: Map<Socket, Client>;

    public constructor(io: Server) {
        this.io = io;
        this.observers = new Map<number, IStreamObserver[]>();
        this.connections = new Map<Socket, Client>();
    }

    public attach(event: number, ...observers: IStreamObserver[]): void {
        this.observers.set(event, observers);
    }

    public notifyClientConnectionStatus(event: StreamEvents.RECEIVE_USER|StreamEvents.DISCONNECT, client: Client): void {
        this.getEachObserver().forEach((observer: IStreamObserver): void => {
            switch (event) {
                case StreamEvents.RECEIVE_USER:
                    observer.onClientJoined(client);
                    break;
                case StreamEvents.DISCONNECT:
                    observer.onClientLeft(client);
                    break;
                default:
                    throw new Error("Invalid event argument supplied");
            }
        });
    }

    public notifyClientMessage(roomId: number, client: Client, data: ReceiveChatObject): void {
        this.observers.get(roomId).forEach((observer: IStreamObserver): void => {
            observer.onClientMessage(client, data);
        });
    }

    public listen(): void {
        this.io.on(StreamEvents.CONNECTION, (socket: Socket): void => {
            socket.on(StreamEvents.RECEIVE_USER, (data: ReceiveUserDataObject): void => {
                this.onReceiveUser(socket, data);
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

    public onReceiveUser(socket: Socket, data: ReceiveUserDataObject): void {
        const client: Client = new Client(socket, data.username);

        this.connections.set(socket, client);
        this.notifyClientConnectionStatus(StreamEvents.RECEIVE_USER, client);
    }

    public onDisconnect(socket: Socket): void {
        const client: Client = this.connections.get(socket);

        this.connections.delete(socket);
        this.notifyClientConnectionStatus(StreamEvents.DISCONNECT, client);
    }

    public getObserverMap(): Map<number, IStreamObserver[]> {
        return this.observers;
    }

    public getEachObserver(): Set<IStreamObserver> {
        let final: Set<IStreamObserver> = new Set<IStreamObserver>();

        this.observers.forEach((observerArray: IStreamObserver[]): void => {
           observerArray.forEach((observer: IStreamObserver): void => {
                final.add(observer);
           });
        });

        return final;
    }

    public getConnections(): Map<Socket, Client> {
        return this.connections;
    }
}