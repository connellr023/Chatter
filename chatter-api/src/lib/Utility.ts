export enum StreamEvents {
    CONNECTION = "connection",
    DISCONNECT = "disconnect",
    REQUEST_ROOMS = "req_rooms",
    RECEIVE_CHAT = "recv_chat",
    RECEIVE_USER = "recv_user"
}

export interface StatusObject {
    success: boolean
}

export interface RoomObject {
    name: string,
    id: number
}

export interface SendChatObject {
    username: string,
    roomId: number,
    message: string
}

export interface SendRoomsObject {
    rooms: RoomObject[]
}

export interface ReceiveChatObject {
    roomId: number,
    message: string
}

export interface ReceiveUserDataObject {
    username: string
}