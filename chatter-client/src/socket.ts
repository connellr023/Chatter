/**
 * Main socket.io initialization
 * @author Connell Reffo
 */
import {io, type Socket} from "socket.io-client";
import {useUserStore} from "./stores/userStore";

const url: string = "http://localhost:8000";
const socket: Socket = io(url, {autoConnect: false});
const userStore = useUserStore();

socket.on("connect", (): void => {
    userStore.connected = true;
});

socket.on("disconnect", (): void => {
    userStore.connected = false;
});

export default socket;