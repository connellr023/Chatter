import Client from "../stream/Client";
import {
    config,
    ChatObject,
    StatusObject,
    StreamEvents,
    ConnectedUsersObject, UserDataObject, SendChatObject
} from "../lib/utility";
import IStreamObserver from "../stream/IStreamObserver";

/**
 * Class containing base logic every chat room should include
 * @author Connell Reffo
 */
export default abstract class AbstractChatRoom implements IStreamObserver {

    /**
     * Set of unique clients connected to this chat room
     */
    protected clients: Set<Client>;

    /**
     * Name of this chat room
     */
    protected name: string;

    /**
     * Unique ID of this chat room <br />
     * Generated by the factory
     */
    protected id: number;

    /**
     * Base constructor
     * @param name The name of this room
     * @param id The ID of this room
     */
    public constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
        this.clients = new Set<Client>;
    }

    /**
     * @inheritDoc
     */
    public abstract onClientJoined(client: Client): void;

    /**
     * @inheritDoc
     */
    public abstract onClientConnected(client: Client): void;

    /**
     * @inheritDoc
     */
    public onClientDisconnected(client: Client): void {
        this.clients.delete(client);
        this.broadcast(StreamEvents.SERVER_UPDATE_CONNECTIONS, this.encodeConnections());
    }

    /**
     * @inheritDoc
     */
    public onClientMessage(client: Client, message: ChatObject): void {
        const data: SendChatObject = {
            username: client.getName(),
            roomId: message.roomId,
            message: message.text
        };

        const status: StatusObject = this.verifyClientMessage(message);

        if (status.success) {
            this.broadcast(StreamEvents.SERVER_CHAT_RESPONSE, data);
        }
        else {
            client.emit(StreamEvents.SERVER_SEND_STATUS, status);
        }
    }

    /**
     * Adds a client as a member to this chat room and broadcasts that a client was added to the rest of the room
     * @param client The client to add
     */
    public addClient(client: Client): void {
        this.clients.add(client);
        this.broadcast(StreamEvents.SERVER_UPDATE_CONNECTIONS, this.encodeConnections());
    }

    /**
     * Verifies that a message received by this room is valid to be broadcast <br />
     * Essentially a filter
     * @param message The message to be verified
     */
    public verifyClientMessage(message: ChatObject): StatusObject {
        let success: boolean = false;

        if (typeof message.text == "string") {
            if (this.id == message.roomId && message.text.length >= config.MIN_MESSAGE_LENGTH && message.text.length <= config.MAX_MESSAGE_LENGTH) {
                success = true;
            }
        }

        return {
            success: success
        };
    }

    /**
     * Encodes the connections of this room as an object
     */
    public encodeConnections(): ConnectedUsersObject {
        return {
            roomId: this.id,
            connections: Array.from(this.clients).map((c: Client): UserDataObject => ({username: c.getName()}))
        };
    }

    /**
     * Emits a message to every client connected to this room
     * @param event The event to emit
     * @param data The data to be sent
     */
    public broadcast(event: StreamEvents|string, data: {}): void {
        this.clients.forEach((client: Client): void => {
            client.emit(event, data);
        });
    }

    /**
     * Gets the name of this chat room
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Gets the ID of this chat room
     */
    public getID(): number {
        return this.id;
    }

    /**
     * Checks if this chat room has a specified client
     * @param client Is the client to check membership for
     */
    public hasClient(client: Client): boolean {
        return this.clients.has(client);
    }
}