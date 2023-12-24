import IStreamObserver from "../../src/stream/IStreamObserver";
import Client from "../../src/stream/Client";

import {ChatObject} from "../../src/lib/utility";

export default class StreamObserverStub implements IStreamObserver {

    private trigger: string;
    private additional: {};

    public constructor() {
        this.trigger = "";
        this.additional = {};
    }

    public onClientConnected(client: Client, additional: {}): void {
        this.trigger = "join";
        this.additional = additional;
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

    public getAdditionalData(): {} {
        return this.additional;
    }
}