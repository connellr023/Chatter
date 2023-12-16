import AbstractRoom from "./AbstractRoom";

import {Server, Socket} from "socket.io";
import {StreamEvents} from "../lib/Utility";

export default class ChatRoom extends AbstractRoom {

    private constructor(io: Server, name: string, id: number) {
        super(io, name, id);
    }

    public listen(): void {
        this.io.on(StreamEvents.CONNECTION, (socket: Socket): void => {
            // TODO
        });
    }

    /**
     * Factory class that must be used to instantiate new chat rooms
     * @author Connell Reffo
     */
    public static Factory = class {

        private static count: number;

        /**
         * Creates a new chat room object
         * @static
         * @param io The namespace socket.io object this room should use
         * @param name The name of the room
         */
        public static create(io: Server, name: string): ChatRoom {
            let room: ChatRoom = new ChatRoom(io, name, this.count);
            this.count++;

            return room;
        }
    }
}