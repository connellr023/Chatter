import AbstractStreamer from "../stream/AbstractStreamer";
import IIdentifiable from "../lib/IIdentifiable";

import {Namespace} from "socket.io";

export default abstract class AbstractRoom extends AbstractStreamer<Namespace> implements IIdentifiable {

    protected name: string;
    protected id: number;

    protected constructor(io: Namespace, name: string, id: number) {
        super(io);

        this.name = name;
        this.id = id;
    }

    public getName(): string {
        return this.name;
    }

    public getID(): number {
        return this.id;
    }
}