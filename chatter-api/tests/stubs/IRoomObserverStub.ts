import IRoomObserver from "../../src/connections/IRoomObserver";
import Client from "../../src/connections/Client";

import {ChatObject} from "../../src/lib/utility";

export default class IRoomObserverStub implements IRoomObserver {

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
        this.trigger = "left";
    }

    public onClientMessage(client: Client, message: ChatObject): void {
        this.trigger = message.text;
    }

    public getTrigger(): string {
        return this.trigger;
    }
}