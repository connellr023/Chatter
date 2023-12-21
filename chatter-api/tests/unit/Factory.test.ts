import ChatRoom from "../../src/chat/ChatRoom";

import {SendRoomsObject} from "../../src/lib/utility";

beforeEach((): void => {
    ChatRoom.Factory.reset();
});

test("Test unique ID assignment", (): void => {
    let f1: ChatRoom = ChatRoom.Factory.instantiate("1");
    let f2: ChatRoom = ChatRoom.Factory.instantiate("2");

    expect(f1.getID()).not.toEqual(f2.getID());
});

test("Test chat room encoding", (): void => {
    ChatRoom.Factory.instantiate("1");
    ChatRoom.Factory.instantiate("2");
    ChatRoom.Factory.instantiate("3");

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