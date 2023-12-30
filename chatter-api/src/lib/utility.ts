/**
 * Server API utility file
 * @author Connell Reffo
 */

/**
 * Object to represent constants used to configure certain aspects of this API
 */
export const config = {
    DEV_PORT: 8000,                                     // Port to be used for development testing
    MIN_MESSAGE_LENGTH: 1,                              // The minimum length of a chat message
    MAX_MESSAGE_LENGTH: 30,                             // The maximum length of a chat message
    MIN_NAME_LENGTH: 1,                                 // The minimum length of a client username
    MAX_NAME_LENGTH: 15,                                // The maximum length of a client username
    MIN_ROOM_NAME_LENGTH: 1,
    MAX_ROOM_NAME_LENGTH: 15
};

/**
 * Enumeration of events that are permissible to occur on the stream
 */
export enum StreamEvents {
    CLIENT_CONNECTED = "connection",
    CLIENT_DISCONNECTED = "disconnect",
    CLIENT_REQUEST_ROOMS = "client_request_rooms",
    CLIENT_SEND_CHAT = "client_send_chat",
    CLIENT_SEND_USERDATA = "client_send_userdata",
    CLIENT_OPEN_ROOM = "client_open_room",
    CLIENT_JOIN_ROOM = "client_join_room",
    SERVER_SEND_STATUS = "server_send_status",
    SERVER_SEND_ROOMS = "server_send_rooms",
    SERVER_CHAT_RESPONSE = "server_send_chat",
    SERVER_UPDATE_CONNECTIONS = "server_update_connection"
}

/**
 * Represents an object that encodes an array of connected users by their username
 */
export interface ConnectedUsersObject {
    roomId: number,
    connections: UserDataObject[]
}

/**
 * Represents an object that encodes of a status message sent over a stream
 */
export interface StatusObject {
    success: boolean
}

/**
 * Represents an object that encodes a room
 */
export interface RoomObject {
    name: string,
    id: number,
    isGlobal: boolean
}

/**
 * Represents an object that encodes a message that was sent
 */
export interface SendChatObject {
    username: string,
    roomId: number,
    message: string
}

/**
 * Represents an object that encodes a list of room objects to be sent
 */
export interface RoomsListObject {
    rooms: RoomObject[]
}

/**
 * Represents an object that encodes a chat message that was received
 */
export interface ChatObject {
    roomId: number,
    text: string
}

/**
 * Represents an object that encodes user data that was received
 */
export interface UserDataObject {
    username: string
}

/**
 * Verifies that a given variable is a string and its length is within the min and max values
 * @param data The variable to check
 * @param min The minimum length
 * @param max The maximum length
 */
export function verifyString(data: any, min: number, max: number): boolean {
    if (typeof data == "string") {
        if (data.length >= min && data.length <= max) {
            return true;
        }
    }

    return false;
}