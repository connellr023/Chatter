import AbstractChatRoom from "../chat/AbstractChatRoom";
import GlobalChatRoom from "../chat/GlobalChatRoom";
import PrivateChatRoom from "../chat/PrivateChatRoom";
import Client from "../stream/Client";

import {RoomObject, RoomsListObject} from "./utility";

/**
 * Factory class that must be used to instantiate new chat rooms
 * @author Connell Reffo
 */
export default class ChatRoomFactory {

    /**
     * List of rooms instantiated by this factory
     */
    private static rooms: AbstractChatRoom[] = [];

    /**
     * Counter for maintaining unique identifiers
     */
    private static counter: number = 0;

    /**
     * Creates a new chat room object
     * @static
     * @param name The name of the room
     * @param isGlobal True if the room should be global, false to be private
     */
    public static instantiate(name: string, isGlobal: boolean = true): AbstractChatRoom {
        let room: AbstractChatRoom = isGlobal ? new GlobalChatRoom(name, this.counter) : new PrivateChatRoom(name, this.counter);

        this.rooms.push(room);
        this.counter++;

        return room;
    }

    /**
     * Gets a list of rooms that a specified client is a member of
     * @static
     * @param client The client to check
     */
    public static memberOf(client: Client): AbstractChatRoom[] {
        let list: AbstractChatRoom[] = [];

        this.rooms.forEach((room: AbstractChatRoom): void => {
            if (room.hasClient(client)) {
                list.push(room);
            }
        });

        return list;
    }

    /**
     * Encodes an array of rooms in JSON format
     * @static
     */
    public static encode(rooms: AbstractChatRoom[]): RoomsListObject {
        let roomObjects: RoomObject[] = [];

        rooms.forEach((room: AbstractChatRoom): void => {
            roomObjects.push({
                name: room.getName(),
                id: room.getID(),
                isGlobal: (room instanceof GlobalChatRoom)
            });
        });

        return {
            rooms: roomObjects
        };
    }

    /**
     * Resets the chat room factory <br />
     * <b>Should only be used for testing</b>
     * @static
     */
    public static reset(): void {
        this.rooms = [];
        this.counter = 0;
    }
}