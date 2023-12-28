/**
 * Main socket.io initialization
 * @author Connell Reffo
 */
import {io, type Socket} from "socket.io-client";

export const port: number = 8000;
export let stream: Socket;

export function initializeStream(port: number, hostname: string): void {
    stream = io(`http://${hostname}:${port}`, {autoConnect: false});
}

initializeStream(port, "localhost");