/**
 * Client utility file
 * @author Connell Reffo
 */

/**
 * Object to represent constants used to configure certain aspects of the client
 */
export const config = {
    SOCKET_DEV_PORT: 8000,                              // Port to of the socket server to connect to in development mode
    SOCKET_DEV_HOSTNAME: "localhost",                   // Hostname of the socket server to connect to in development mode
    MIN_MESSAGE_LENGTH: 1,                              // The minimum length of a chat message
    MAX_MESSAGE_LENGTH: 30,                             // The maximum length of a chat message
    MIN_NAME_LENGTH: 1,                                 // The minimum length of a client username
    MAX_NAME_LENGTH: 15                                 // The maximum length of a client username
};

/**
 * Enumeration of events that are permissible to occur on the stream
 */
export enum StreamEvents {
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    ERROR = "connect_error",
    CLIENT_REQUEST_ROOMS = "client_request_rooms",
    CLIENT_SEND_CHAT = "client_send_chat",
    CLIENT_SEND_USERDATA = "client_send_userdata",
    CLIENT_JOIN_ROOM = "client_join_room",
    CLIENT_LEAVE_ROOM = "client_leave_room",
    SERVER_SEND_STATUS = "server_send_status",
    SERVER_SEND_ROOMS = "server_send_rooms",
    SERVER_CHAT_RESPONSE = "server_send_chat",
    SERVER_UPDATE_CONNECTIONS = "server_update_connection"
}

/**
 * Enumeration of events that can happen globally over the Vue app
 */
export enum GlobalClientEvents {
    NOTIFICATION = "notification"
}

/**
 * Represents an object that encodes an array of connected users by their username
 */
export interface ConnectedUsersObject {
    roomId: number,
    connections: UserDataObject[]
}

/**
 * Represents an object that only encodes a room ID
 */
export interface RoomActionObject {
    roomId: number
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
 * Object that the represents a single chat message
 */
export interface MessageObject {
    sender: string,
    body: string
}

/**
 * Represents an object that encodes a chat message that was received
 */
export interface ReceiveChatObject {
    username: string,
    roomId: number,
    message: string
}

/**
 * Represents an object that encodes a list of room objects to be received
 */
export interface RoomsListObject {
    rooms: RoomObject[]
}

/**
 * Represents an object that encodes a chat message that was sent
 */
export interface ChatObject {
    roomId: number,
    text: string
}

/**
 * Represents an object that encodes user data that was sent
 */
export interface UserDataObject {
    username: string
}

/**
 * Represents a client side notification
 */
export interface NotificationObject {
    id: number
    body: string,
    clear: () => void
}