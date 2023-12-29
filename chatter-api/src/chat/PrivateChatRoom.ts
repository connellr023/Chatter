import AbstractChatRoom from "./AbstractChatRoom";
import Client from "../stream/Client";

/**
 * Represents a private chat room with select clients as members
 * @author Connell Reffo
 */
export default class PrivateChatRoom extends AbstractChatRoom {

    /**
     * @inheritDoc
     */
    public onClientJoined(client: Client): void {
        this.addClientAndBroadcast(client);
    }

    /**
     * @inheritDoc
     * Unused
     */
    public onClientConnected(client: Client): void {}
}