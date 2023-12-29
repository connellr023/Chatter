import AbstractChatRoom from "./AbstractChatRoom";
import Client from "../stream/Client";

/**
 * Represents a global chat room that everyone is automatically connected to
 * @author Connell Reffo
 */
export default class GlobalChatRoom extends AbstractChatRoom {

    /**
     * @inheritDoc
     */
    public onClientConnected(client: Client): void {
        this.addClientAndBroadcast(client);
    }

    /**
     * @inheritDoc
     * Unused
     */
    public onClientJoined(client: Client): void {}
}