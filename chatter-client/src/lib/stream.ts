/**
 * Main socket.io initialization
 * @author Connell Reffo
 */
import {io, type Socket} from "socket.io-client";
import {config} from "@/lib/utility";

export let stream: Socket;

export function initializeStream(port: number, hostname: string): void {
    stream = io(`http://${hostname}:${port}`, {autoConnect: false});
}

const port: number = import.meta.env.MODE == "development" ? config.SOCKET_DEV_PORT : parseInt(window.location.port);
const hostname: string = import.meta.env.MODE == "development" ? config.SOCKET_DEV_HOSTNAME : window.location.hostname;

initializeStream(port, hostname);