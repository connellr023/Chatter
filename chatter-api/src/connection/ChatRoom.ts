import AbstractRoom from "./AbstractRoom";

import {Namespace, Socket} from "socket.io";

export default class ChatRoom extends AbstractRoom {

    private constructor(io: Namespace, name: string, id: number) {
        super(io, name, id);
    }

    public listen(): void {
        this.io.on("connection", (socket: Socket): void => {
            this.connections.add(socket);

            socket.on("disconnect", (): void => {
                this.connections.delete(socket);
            });
        });
    }

    /**
     * Factory class that must be used to instantiate new chat rooms
     * @author Connell Reffo
     */
    public static Factory  = class {

        /**
         * List of all rooms created by this factory
         */
        private static rooms: ChatRoom[] = [];

        /**
         * Creates a new chat room object
         * @static
         * @param io The namespace socket.io object this room should use
         * @param name The name of the room
         */
        public static create(io: Namespace, name: string): ChatRoom {
            let room: ChatRoom = new ChatRoom(io, name, this.rooms.length);
            this.rooms.push(room);

            return room;
        }

        /**
         * Gets a list of all rooms created by this factory
         * @static
         */
        public static getAll(): ChatRoom[] {
            return this.rooms;
        }
    }
}