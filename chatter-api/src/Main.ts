/**
 * Main API entry point
 * @author Connell Reffo
 */

import * as http from "http";

// @ts-ignore
import express, {Application} from "express";
import Stream from "./stream/Stream";

import {Server} from "socket.io";

let app: Application = express();

// Setup server
let server: http.Server = app.listen(8000, (): void => {
    console.log("Server started")
});

// Setup stream
let io: Server = new Server(server, {httpCompression: false, transports: ["websocket"], allowUpgrades: false});
let stream: Stream = new Stream(io);

stream.listen();