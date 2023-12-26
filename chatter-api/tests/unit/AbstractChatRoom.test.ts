import {ConnectedUsersObject, StatusObject} from "../../src/lib/utility";

import AbstractChatRoom from "../../src/chat/AbstractChatRoom";
import AbstractChatRoomStub from "../stubs/AbstractChatRoomStub";
import Client from "../../src/stream/Client";

let room: AbstractChatRoom;

beforeEach((): void => {
    room = new AbstractChatRoomStub("stub", 0);
});

test("Test verifyClientMessage() with valid message", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: "sample"})

    expect(result.success).toBe(true);
});

test("Test verifyClientMessage() with wrong room ID", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 1, text: "sample"})

    expect(result.success).toBe(false);
});

test("Test verifyClientMessage() with garbage data", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: null})

    expect(result.success).toBe(false);
});

test("Test verifyClientMessage() message text 1 character too long", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1"})

    expect(result.success).toBe(false);
});

test("Test verifyClientMessage() with message exactly at maximum length", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"})

    expect(result.success).toBe(true);
});

test("Test verifyClientMessage() with message 1 character too short", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: ""})

    expect(result.success).toBe(false);
});

test("Test verifyClientMessage() with message exactly at minimum length", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: "a"})

    expect(result.success).toBe(true);
});

test("Test encodeConnections()", (): void => {
    const c: Client = new Client(null, "arhp");

    try {
        room.addClient(c);
    }
    catch (e) {}

    const expected: ConnectedUsersObject = {
        roomId: room.getID(),
        connections: [
            {
                username: c.getName()
            }
        ]
    };

    expect(room.encodeConnections()).toStrictEqual(expected);
});