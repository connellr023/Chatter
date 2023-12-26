import AbstractChatRoom from "../../src/chat/AbstractChatRoom";
import Client from "../../src/stream/Client";

export default class AbstractChatRoomStub extends AbstractChatRoom {

    public onClientConnected(client: Client): void {}

    public onClientJoined(client: Client): void {}
}