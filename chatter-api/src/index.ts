/**
 * Main API entry point
 * @author Connell Reffo
 */
import * as http from "http";

import AbstractChatRoom from "./chat/AbstractChatRoom";
import ChatRoomFactory from "./lib/ChatRoomFactory";
import Logger from "./lib/Logger";
import express, {Application} from "express";
import Stream from "./stream/Stream";
import path from "node:path";
import cors from "cors";

import {Server, type Socket} from "socket.io";
import {config, StreamEvents} from "./lib/utility";

const port: number = (process.env["PORT"] as any) || config.DEV_PORT;
const origins: string[] = [
    "http://localhost:5173",
    `http://localhost:${port}`,
    "https://chatter-lqqb.onrender.com"
];

// Setup express
const app: Application = express();

app.use(cors());

// HTTP Routing (Vue project must be built in the src folder)
app.use("/", express.static(path.join(__dirname, "build")));

app.get("*", (_req, res): void => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Setup HTTP server
const server: http.Server = app.listen(port, (): void => {
    Logger.ok(`Server started on port ${port}`);
});

// Setup stream
const io: Server = new Server(server, {
    httpCompression: false,
    transports: ["websocket", "polling"],
    allowUpgrades: false,
    cors: {
        origin: origins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on(StreamEvents.CLIENT_CONNECTED, (socket: Socket): void => {
    Logger.ok(`${socket.id} connected`)
    socket.on(StreamEvents.CLIENT_DISCONNECTED, (): void => Logger.error(`${socket.id} disconnected`));
});

const stream: Stream = new Stream(io);

// Setup global chat rooms
const globalChatRoomsCount: number = 3;

for (let i: number = 0; i < globalChatRoomsCount; i++) {
    const globalChatRoom: AbstractChatRoom = ChatRoomFactory.instantiate(`Global Chat Room ${i + 1}`);
    stream.attach(i, globalChatRoom);
}

// Listen
stream.listen();