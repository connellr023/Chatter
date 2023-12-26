import IStreamObserver from "../../src/stream/IStreamObserver";
import Client from "../../src/stream/Client";

import {ChatObject} from "../../src/lib/utility";

export default class IStreamObserverStub implements IStreamObserver {

    private trigger: string;

    public constructor() {
        this.trigger = "";
    }

    public onClientJoined(client: Client): void {
        this.trigger = "join";
    }

    public onClientConnected(client: Client): void {
        this.trigger = "connect";
    }

    public onClientDisconnected(client: Client): void {
        this.trigger = "disconnect";
    }

    public onClientMessage(client: Client, message: ChatObject): void {
        this.trigger = message.text;
    }

    public getTrigger(): string {
        return this.trigger;
    }
}