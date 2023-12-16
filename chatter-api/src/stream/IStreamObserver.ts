import Client from "../lib/Client";

import {ReceiveChatObject} from "../lib/Utility";

export default interface IStreamObserver {

    onClientJoined(client: Client): void;

    onClientLeft(client: Client): void;

    onClientMessage(client: Client, message: ReceiveChatObject): void;
}