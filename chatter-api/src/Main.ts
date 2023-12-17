/**
 * Main API entry point
 * @author Connell Reffo
 */
import * as http from "http";

import express, {Application} from "express";
import Stream from "./stream/Stream";
import ChatRoom from "./chat/ChatRoom";

import {Server} from "socket.io";

// Setup express
const app: Application = express();

// Setup HTTP server
const server: http.Server = app.listen(8000, (): void => {
    console.log("Server started")
});

// Setup stream
const io: Server = new Server(server, {httpCompression: false, transports: ["websocket"], allowUpgrades: false});
const stream: Stream = new Stream(io);

// Setup chat rooms
const defaultRoomCount: number = 3;

for (let i: number = 0; i < defaultRoomCount; i++) {
    stream.attach(i, ChatRoom.Factory.instantiate(io, `Default Room ${i + 1}`));
}

// Listen
stream.listen();