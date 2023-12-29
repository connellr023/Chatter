/**
 * Main socket.io initialization
 * @author Connell Reffo
 */
import {io, type Socket} from "socket.io-client";

export let stream: Socket;

export function initializeStream(port: number, hostname: string): void {
    stream = io(`http://${hostname}:${port}`, {autoConnect: false});
}

const port: number = import.meta.env.MODE == "development" ? 8000 : parseInt(window.location.port);
const hostname: string = import.meta.env.MODE == "development" ? "localhost" : window.location.hostname;

initializeStream(port, hostname);