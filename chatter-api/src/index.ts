/**
 * Main API entry point
 * @author Connell Reffo
 */
import * as http from "http";

import Logger from "./lib/Logger";
import express, {Application} from "express";
import Stream from "./stream/Stream";
import ChatRoom from "./chat/ChatRoom";
import cors from "cors";

import {Server, Socket} from "socket.io";
import {config, StreamEvents} from "./lib/utility";

const port: number = config.DEV_PORT;

// Setup express
const app: Application = express();

app.use(cors());

// Setup HTTP server
const server: http.Server = app.listen(port, (): void => {
    Logger.ok(`Server started on port ${port}`);
});

// Setup stream
const io: Server = new Server(server, {
    httpCompression: false,
    transports: ["websocket", "polling"],
    allowUpgrades: false,
    allowEIO3: true,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on(StreamEvents.CLIENT_CONNECTED, (socket: Socket): void => {
    Logger.ok(`${socket.id} connected`)

    socket.on(StreamEvents.CLIENT_DISCONNECTED, (): void => Logger.error(`${socket.id} disconnected`));
});

const stream: Stream = new Stream(io);

// Setup chat rooms
const defaultRoomCount: number = 3;

for (let i: number = 0; i < defaultRoomCount; i++) {
    stream.attach(i, ChatRoom.Factory.instantiate(`Default Room ${i + 1}`));
}

// Listen
stream.listen();