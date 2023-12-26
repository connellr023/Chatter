import AbstractChatRoom from "./AbstractChatRoom";
import Client from "../stream/Client";

/**
 * Represents a private chat room with select clients as members
 * @author Connell Reffo
 */
export default class PrivateChatRoom extends AbstractChatRoom {

    /**
     * @inheritDoc
     * Unused
     */
    public onClientJoined(client: Client): void {
        super.addClient(client);
    }

    /**
     * @inheritDoc
     * Unused
     */
    public onClientConnected(client: Client): void {}
}