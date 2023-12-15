/**
 * Main API entry point
 * @author Connell Reffo
 */

import IStreamable from "./stream/IStreamable";
import Stream from "./stream/Stream";

// @ts-ignore
import express, {Application} from "express";
import {Server} from "socket.io";

let app: Application = express();

// Setup server
let server = app.listen(8000, (): void => {
    console.log("Server started")
});

// Setup stream
let io = new Server(server, {httpCompression: false, transports: ["websocket"], allowUpgrades: false});
let stream: IStreamable = new Stream(io);

stream.listen();