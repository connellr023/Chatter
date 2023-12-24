import GlobalChatRoom from "../../src/chat/GlobalChatRoom";

import {SendRoomsObject} from "../../src/lib/utility";

beforeEach((): void => {
    GlobalChatRoom.Factory.reset();
});

test("Test unique ID assignment", (): void => {
    let f1: GlobalChatRoom = GlobalChatRoom.Factory.instantiate("1");
    let f2: GlobalChatRoom = GlobalChatRoom.Factory.instantiate("2");

    expect(f1.getID()).not.toEqual(f2.getID());
});

test("Test encode()", (): void => {
    GlobalChatRoom.Factory.instantiate("1");
    GlobalChatRoom.Factory.instantiate("2");
    GlobalChatRoom.Factory.instantiate("3");

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

    expect(GlobalChatRoom.Factory.encode()).toStrictEqual(expected);
});