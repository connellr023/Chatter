/**
 * Main socket.io initialization
 * @author Connell Reffo
 */
import {io, type Socket} from "socket.io-client";

const url: string = "http://localhost:8000";
const stream: Socket = io(url, {autoConnect: false});

export default stream;