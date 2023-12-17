import Client from "../lib/Client";
import IStreamObserver from "../stream/IStreamObserver";

import {config, ReceiveChatObject, RoomObject, SendChatObject, SendRoomsObject, StatusObject} from "../lib/Utility";

export default class ChatRoom implements IStreamObserver {

    protected clients: Set<Client>;

    protected name: string;
    protected id: number;

    private constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
        this.clients = new Set<Client>;
    }

    public onClientConnected(client: Client): void {
        this.clients.add(client);
    }

    public onClientDisconnected(client: Client): void {
        this.clients.delete(client);
    }

    public onClientMessage(client: Client, message: ReceiveChatObject): void {
        const data: SendChatObject = {
            username: client.getName(),
            roomId: message.roomId,
            message: message.text
        };

        const status: StatusObject = this.verifyClientMessage(client, message);

        if (status.success) {
            this.broadcastData(data);
        }
        else {
            client.send(status);
        }
    }

    public verifyClientMessage(client: Client, message: ReceiveChatObject): StatusObject {
        let success: boolean = false;

        if (this.clients.has(client) && this.id == message.roomId && message.text.length >= config.MIN_MESSAGE_LENGTH && message.text.length <= config.MAX_MESSAGE_LENGTH) {
            success = true;
        }

        return {
            success: success
        };
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

        /**
         * List of rooms instantiated by this factory
         */
        private static rooms: ChatRoom[];

        /**
         * Creates a new chat room object
         * @static
         * @param name The name of the room
         */
        public static instantiate(name: string): ChatRoom {
            let room: ChatRoom = new ChatRoom(name, this.rooms.length);
            this.rooms.push(room);

            return room;
        }

        /**
         * Encodes the rooms this factory has instantiated as an object
         */
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