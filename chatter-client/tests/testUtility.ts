/**
 * Utility file for tests
 * @author Connell Reffo
 */
import {createPinia, Pinia} from "pinia";
import {createRouter, createWebHistory, Router} from "vue-router";

export const pinia: Pinia = createPinia();

export const router: Router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/chat",
            component: {template: "<div>Chat</div>"}
        },
        {
            path: "/error/:code/:message",
            name: "error",
            component: {template: "<div>Error</div>"}
        },
        {
            path: "/",
            component: {template: "<div>Root</div>"}
        }
    ]
});

export const serverSocketOptions: any = {
    httpCompression: false,
    transports: ["websocket", "polling"],
    allowUpgrades: false,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
};

export const hostname: string = "localhost";