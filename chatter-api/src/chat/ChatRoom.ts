import Client from "../lib/Client";
import IStreamObserver from "../stream/IStreamObserver";

import {Server} from "socket.io";
import {ReceiveChatObject, RoomObject, SendRoomsObject} from "../lib/Utility";

export default class ChatRoom implements IStreamObserver {

    protected io: Server;
    protected clients: Set<Client>;

    protected name: string;
    protected id: number;

    private constructor(io: Server, name: string, id: number) {
        this.io = io;
        this.name = name;
        this.id = id;
        this.clients = new Set<Client>;
    }

    public onClientJoined(client: Client): void {
        this.clients.add(client);
    }

    public onClientLeft(client: Client): void {
        this.clients.delete(client);
    }

    public onClientMessage(client: Client, message: ReceiveChatObject): void {
        this.broadcastData(message);
    }

    public broadcastData(data: {}): void {
        this.clients.forEach((client: Client): void => {
            client.send(data);
        });
    }

    public getName(): string {
        return this.name;
    }

    public getID(): number {
        return this.id;
    }

    /**
     * Factory class that must be used to instantiate new chat rooms
     * @author Connell Reffo
     */
    public static Factory = class {

        private static rooms: ChatRoom[];

        /**
         * Creates a new chat room object
         * @static
         * @param io The namespace socket.io object this room should use
         * @param name The name of the room
         */
        public static instantiate(io: Server, name: string): ChatRoom {
            let room: ChatRoom = new ChatRoom(io, name, this.rooms.length);
            this.rooms.push(room);

            return room;
        }

        public static encode(): SendRoomsObject {
            let roomObjects: RoomObject[] = [];

            this.rooms.forEach((room: ChatRoom): void => {
                roomObjects.push({
                    name: room.getName(),
                    id: room.getID()
                });
            });

            return {
                rooms: roomObjects
            };
        }

        /**
         * <b>WARNING</b><br />
         * This method should only be used in test cases
         */
        public static reset(): void {
            this.rooms = [];
        }
    }
}