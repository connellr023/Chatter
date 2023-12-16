import ChatRoom from "../src/chat/ChatRoom";

import {Server} from "socket.io";
import {SendRoomsObject} from "../src/lib/Utility";

let io: Server = new Server();

beforeEach((): void => {
    ChatRoom.Factory.reset();
});

test("Test unique ID assignment", (): void => {
    let f1: ChatRoom = ChatRoom.Factory.create(io, "1");
    let f2: ChatRoom = ChatRoom.Factory.create(io, "2");

    expect(f1.getID()).not.toEqual(f2.getID());
});

test("Test chat room encoding", (): void => {
    ChatRoom.Factory.create(io, "1");
    ChatRoom.Factory.create(io, "2");
    ChatRoom.Factory.create(io, "3");

    const expected: SendRoomsObject = {
        rooms: [
            {
                name: "1",
                id: 0
            },
            {
                name: "2",
                id: 1
            },
            {
                name: "3",
                id: 2
            }
        ]
    };

    expect(ChatRoom.Factory.encode()).toStrictEqual(expected);
});