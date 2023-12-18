import ChatRoom from "../../src/chat/ChatRoom";

import {StatusObject} from "../../src/lib/Utility";

let room: ChatRoom;

beforeEach((): void => {
    ChatRoom.Factory.reset();
    room = ChatRoom.Factory.instantiate("test");
});

test("Test verify valid client message", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: "sample"})

    expect(result.success).toBe(true);
});

test("Test verify client message with wrong room ID", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 1, text: "sample"})

    expect(result.success).toBe(false);
});

test("Test verify garbage client message", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: null})

    expect(result.success).toBe(false);
});

test("Test verify client message 1 too long", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1"})

    expect(result.success).toBe(false);
});

test("Test verify client message exactly right at maximum length", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"})

    expect(result.success).toBe(true);
});

test("Test verify client message 1 too short", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: ""})

    expect(result.success).toBe(false);
});

test("Test verify client message exactly at minimum length", (): void => {
    const result: StatusObject = room.verifyClientMessage({roomId: 0, text: "a"})

    expect(result.success).toBe(true);
});