import AbstractChatRoom from "../../src/chat/AbstractChatRoom";
import ChatRoomFactory from "../../src/lib/ChatRoomFactory";
import Client from "../../src/stream/Client";

import {RoomsListObject} from "../../src/lib/utility";

beforeEach((): void => {
    ChatRoomFactory.reset();
});

test("Test unique ID assignment", (): void => {
    const f1: AbstractChatRoom = ChatRoomFactory.instantiate("1");
    const f2: AbstractChatRoom = ChatRoomFactory.instantiate("2");

    expect(f1.getID()).not.toEqual(f2.getID());
});

test("Test memberOf() with global chat rooms", (): void => {
    const f1: AbstractChatRoom = ChatRoomFactory.instantiate("1");
    const f2: AbstractChatRoom = ChatRoomFactory.instantiate("2");

    const c: Client = new Client(null, "phinger");

    const expected: AbstractChatRoom[] = [f1, f2];

    try {
        f1.onClientConnected(c);
    }
    catch (e) {}

    try {
        f2.onClientConnected(c);
    }
    catch (e) {}

    expect(ChatRoomFactory.memberOf(c)).toStrictEqual(expected);
});

test("Test memberOf() with private chat rooms", (): void => {
    const f1: AbstractChatRoom = ChatRoomFactory.instantiate("1", false);
    const f2: AbstractChatRoom = ChatRoomFactory.instantiate("2", false);

    const c: Client = new Client(null, "phinger");

    const expected: AbstractChatRoom[] = [f1, f2];

    try {
        f1.onClientJoined(c);
    }
    catch (e) {}

    try {
        f2.onClientJoined(c);
    }
    catch (e) {}

    expect(ChatRoomFactory.memberOf(c)).toStrictEqual(expected);
});

test("Test encode()", (): void => {
    const f1: AbstractChatRoom = ChatRoomFactory.instantiate("1");
    const f2: AbstractChatRoom = ChatRoomFactory.instantiate("2");

    const arr: AbstractChatRoom[] = [f1, f2];

    const expected: RoomsListObject = {
        rooms: [
            {
                name: "1",
                id: 0
            },
            {
                name: "2",
                id: 1
            }
        ]
    };

    expect(ChatRoomFactory.encode(arr)).toStrictEqual(expected);
});