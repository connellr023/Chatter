/**
 * Object to represent constants used to configure certain aspects of the client
 * @author Connell Reffo
 */
export const config = {
    MIN_MESSAGE_LENGTH: 1,                              // The minimum length of a chat message
    MAX_MESSAGE_LENGTH: 30,                             // The maximum length of a chat message
    MIN_NAME_LENGTH: 1,                                 // The minimum length of a client username
    MAX_NAME_LENGTH: 15                                 // The maximum length of a client username
};

/**
 * Enumeration of events that are permissible to occur on the stream
 * @author Connell Reffo
 */
export enum StreamEvents {
    CLIENT_CONNECTED = "connect",
    CLIENT_DISCONNECTED = "disconnect",
    ERROR = "connect_error",
    CLIENT_REQUEST_ROOMS = "client_request_rooms",
    CLIENT_SEND_CHAT = "client_send_chat",
    CLIENT_SEND_USERDATA = "client_send_userdata",
    SERVER_SEND_STATUS = "server_send_status",
    SERVER_SEND_ROOMS = "server_send_rooms",
    SERVER_CHAT_RESPONSE = "server_send_chat"
}

/**
 * Enumeration of events that can happen globally over the Vue app
 * @author Connell Reffo
 */
export enum GlobalEvents {
    NOTIFICATION = "notification"
}

/**
 * Represents an object that encodes of a status message sent over a stream
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
 * Object that the represents a single chat message
 * @author Connell Reffo
 */
export interface MessageObject {
    sender: string,
    body: string
}

/**
 * Represents an object that encodes a chat message that was received
 * @author Connell Reffo
 */
export interface ReceiveChatObject {
    username: string,
    roomId: number,
    message: string
}

/**
 * Represents an object that encodes a list of room objects to be received
 * @author Connell Reffo
 */
export interface ReceiveRoomsObject {
    rooms: RoomObject[]
}

/**
 * Represents an object that encodes a chat message that was sent
 * @author Connell Reffo
 */
export interface SendChatObject {
    roomId: number,
    text: string
}

/**
 * Represents an object that encodes user data that was sent
 * @author Connell Reffo
 */
export interface SendUserDataObject {
    username: string
}

/**
 * Represents a client side notification
 * @author Connell Reffo
 */
export interface NotificationObject {
    id: number
    sender: string,
    body: string,
    symbol: string,
    color: string,
    clear: () => void
}