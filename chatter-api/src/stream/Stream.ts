import AbstractStreamer from "./AbstractStreamer";
import AbstractRoom from "../chat/AbstractRoom";
import Client from "../lib/Client";

import {Server, Socket} from "socket.io";
import {ReceiveUserDataObject, StreamEvents} from "../lib/Utility";

/**
 * Class for setting up socket.io stream
 * @author Connell Reffo
 */
export default class Stream extends AbstractStreamer {

    protected rooms: Map<number, AbstractRoom>;

    public constructor(io: Server) {
        super(io);

        this.rooms = new Map<number, AbstractRoom>();
    }

    public registerRoom(room: AbstractRoom): void {
        this.rooms.set(room.getID(), room);
    }

    public listen(): void {
        this.io.on(StreamEvents.CONNECTION, (socket: Socket): void => {
            socket.on(StreamEvents.RECEIVE_USER, (data: ReceiveUserDataObject): void => {
                this.connections.set(socket, new Client(socket, data.username));
            });

            socket.on(StreamEvents.DISCONNECT, (): void => {
                this.connections.delete(socket);
            });
        });

        this.rooms.forEach((room: AbstractRoom): void => {
            room.listen();
        });
    }

    public getRooms(): AbstractRoom[] {
        return Array.from(this.rooms.values());
    }
}