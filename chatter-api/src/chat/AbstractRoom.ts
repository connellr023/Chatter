import AbstractStreamer from "../stream/AbstractStreamer";

import {Server} from "socket.io";

export default abstract class AbstractRoom extends AbstractStreamer {

    protected name: string;
    protected id: number;

    protected constructor(io: Server, name: string, id: number) {
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