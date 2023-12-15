/**
 * Main API entry point
 * @author Connell Reffo
 */

import StreamManager from "./stream/StreamManager";

// @ts-ignore
import express, {Application} from "express";
import {Server} from "socket.io";
import IStreamer from "./stream/IStreamer";

let app: Application = express();
let streamManager: IStreamer = new StreamManager();

// Setup server
let server = app.listen(8000, (): void => {
    console.log("Server started")
});

// Setup stream manager
let io = new Server(server, {httpCompression: false, transports: ["websocket"], allowUpgrades: false});
streamManager.ready(io);