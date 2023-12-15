import AbstractStreamer from "../stream/AbstractStreamer";
import IJoinable from "../lib/IJoinable";
import Client from "./Client";

import {Namespace} from "socket.io";

export default class ChatRoom extends AbstractStreamer<Namespace> implements IJoinable {

    private static rooms: ChatRoom[] = [];

    public static factory(io: Namespace, name: string): ChatRoom {
        let room = new ChatRoom(io, name, ChatRoom.rooms.length);
        ChatRoom.rooms.push(room);

        return room;
    }

    public static getAll(): ChatRoom[] {
        return ChatRoom.rooms;
    }

    protected name: string;
    protected id: number;

    private constructor(io: Namespace, name: string, id: number) {
        super(io);

        this.name = name;
        this.id = id;
    }

    public listen(): void {
        // TODO
    }

    public getName(): string {
        return this.name;
    }

    public getID(): number {
        return this.id;
    }

    public getMembers(): Client[] {
        return undefined;
    }
}