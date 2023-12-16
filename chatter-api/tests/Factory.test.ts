import ChatRoom from "../src/chat/ChatRoom";

import {Namespace, Server} from "socket.io";

let io: Server = new Server();

test("Test unique ID assignment", (): void => {
    let f1: ChatRoom = ChatRoom.Factory.create(io, "1");
    let f2: ChatRoom = ChatRoom.Factory.create(io, "2");

    expect(f1.getID()).not.toEqual(f2.getID());
});