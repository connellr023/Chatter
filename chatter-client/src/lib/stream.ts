/**
 * Main socket.io initialization
 * @author Connell Reffo
 */
import {io, type Socket} from "socket.io-client";

export let stream: Socket;

const inDev: boolean = (import.meta.env.MODE == "development");
const prodUri: string = "https://chatter-lqqb.onrender.com";

export function initializeStream(isTest: boolean, port: number = 8000 | parseInt(window.location.port)): void {
    const devUri: string = `http://localhost:${port}`;

    stream = io(`${(isTest || inDev) ? devUri : prodUri}`, {autoConnect: false});
}

initializeStream(false);