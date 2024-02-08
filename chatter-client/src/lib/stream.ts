/**
 * Main socket.io initialization
 * @author Connell Reffo
 */
import {io, type Socket} from "socket.io-client";

export let stream: Socket;
const inDev: boolean = (import.meta.env.MODE == "development");

export function initializeStream(port: number, hostname: string): void {
    stream = io(`${inDev ? "http" : "https"}://${hostname}:${port}`, {autoConnect: false});
}

const port: number = inDev ? 8000 : parseInt(window.location.port);
const hostname: string = inDev ? "localhost" : window.location.hostname;

initializeStream(port, hostname);