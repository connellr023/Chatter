import AbstractStreamer from "./AbstractStreamer";
import ChatRoom from "../connection/ChatRoom";

import {Server} from "socket.io";

/**
 * Class for setting up socket.io stream
 * @author Connell Reffo
 */
export default class Stream extends AbstractStreamer<Server> {

    public constructor(io: Server) {
        super(io);
    }

    public listen(): void {
        ChatRoom.factory(this.io.of("/room1"), "Default Room 1");
        ChatRoom.factory(this.io.of("/room2"), "Default Room 2");

        this.io.on("connection", (): void => {
            // TODO
        });
    }
}