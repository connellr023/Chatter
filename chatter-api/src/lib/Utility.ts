/**
 * Object to represent constants used to configure certain aspects of this API
 * @author Connell Reffo
 */
export const config = {
    DEV_PORT: 8000,                                     // Port to be used for development testing
    MIN_MESSAGE_LENGTH: 1,                              // The minimum length of a chat message
    MAX_MESSAGE_LENGTH: 30,                             // The maximum length of a chat message
    MIN_NAME_LENGTH: 1,                                 // The minimum length of a client username
    MAX_NAME_LENGTH: 15                                 // The maximum length of a client username
};

/**
 * Enumeration of events that are permissible to occur on the socket stream
 * @author Connell Reffo
 */
export enum StreamEvents {
    CONNECTION = "connection",
    DISCONNECT = "disconnect",
    REQUEST_ROOMS = "req_rooms",
    RECEIVE_CHAT = "recv_chat",
    RECEIVE_USER = "recv_user",
    SEND_STATUS = "send_status",
    SEND_ROOMS = "send_rooms"
}

/**
 * Represents an object that encodes of a status message sent over a socket stream
 * @author Connell Reffo
 */
export interface StatusObject {
    success: boolean
}

/**
 * Represents an object that encodes a room
 * @author Connell Reffo
 */
export interface RoomObject {
    name: string,
    id: number
}

/**
 * Represents an object that encodes a sent chat message
 * @author Connell Reffo
 */
export interface SendChatObject {
    username: string,
    roomId: number,
    message: string
}

/**
 * Represents an object that encodes a list of room objects to be sent
 * @author Connell Reffo
 */
export interface SendRoomsObject {
    rooms: RoomObject[]
}

/**
 * Represents an object that encodes a chat message that was received
 * @author Connell Reffo
 */
export interface ReceiveChatObject {
    roomId: number,
    text: string
}

/**
 * Represents an object that encodes user data that was received
 * @author Connell Reffo
 */
export interface ReceiveUserDataObject {
    username: string
}