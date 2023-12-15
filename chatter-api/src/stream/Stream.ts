import AbstractStreamer from "./AbstractStreamer";
import ChatRoom from "../connection/ChatRoom";

import {Server, Socket} from "socket.io";

/**
 * Class for setting up socket.io stream
 * @author Connell Reffo
 */
export default class Stream extends AbstractStreamer<Server> {

    public constructor(io: Server) {
        super(io);
    }

    public listen(): void {
        ChatRoom.Factory.create(this.io.of("/room1"), "Default Room 1");
        ChatRoom.Factory.create(this.io.of("/room2"), "Default Room 2");

        this.io.on("connection", (socket: Socket): void => {
            this.connections.add(socket);

            socket.on("disconnect", (): void => {
                this.connections.delete(socket);
            });
        });
    }
}