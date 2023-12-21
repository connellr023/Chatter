import IStreamObserver from "../../src/stream/IStreamObserver";
import Client from "../../src/stream/Client";

import {ReceiveChatObject} from "../../src/lib/utility";

export default class StreamObserverStub implements IStreamObserver {

    private trigger: string;

    public constructor() {
        this.trigger = "";
    }

    public onClientConnected(client: Client): void {
        this.trigger = "join";
    }

    public onClientDisconnected(client: Client): void {
        this.trigger = "left";
    }

    public onClientMessage(client: Client, message: ReceiveChatObject): void {
        this.trigger = message.text;
    }

    public getTrigger(): string {
        return this.trigger;
    }
}