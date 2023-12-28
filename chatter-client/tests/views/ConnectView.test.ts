import * as http from "http";

import ConnectView from "../../src/views/ConnectView.vue";
import CornerLogo from "../../src/components/CornerLogo.vue";
import WelcomeTitle from "../../src/components/WelcomeTitle.vue";
import LoadingButton from "../../src/components/LoadingButton.vue";
import NameLabel from "../../src/components/NameLabel.vue";

import {test, expect, beforeAll, afterAll, afterEach} from "vitest";
import {mount} from "@vue/test-utils";
import {createPinia, Pinia} from "pinia";
import {Server, Socket} from "socket.io";
import {StreamEvents, UserDataObject} from "../../src/lib/utility";
import {createRouter, createWebHistory, Router} from "vue-router";

let httpServer: http.Server;
let io: Server;

const port: number = 8000;

const pinia: Pinia = createPinia();
const router: Router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/chat",
            component: {template: "<div>Chat</div>"}
        },
        {
            path: "/error",
            component: {template: "<div>Error</div>"}
        },
        {
            path: "/",
            component: {template: "<div>Root</div>"}
        }
    ]
});

beforeAll((): void => {
    httpServer = http.createServer();
    httpServer.listen(port, "localhost");

    io = new Server(httpServer, {
        httpCompression: false,
        transports: ["websocket", "polling"],
        allowUpgrades: false,
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
});

afterAll((): void => {
    io.close();
    httpServer.close();
});

afterEach((): void => {
    io.removeAllListeners();
});

test("Child components exist on mount", async (): Promise<void> => {
    expect(ConnectView).toBeTruthy();

    const wrapper = mount(ConnectView, {
        global: {
            plugins: [pinia, router]
        }
    });

    expect(wrapper.findComponent(CornerLogo).exists()).toBe(true);
    expect(wrapper.findComponent(WelcomeTitle).exists()).toBe(true);
    expect(wrapper.findComponent(LoadingButton).exists()).toBe(true);
    expect(wrapper.findComponent(NameLabel).exists()).toBe(true);
});

test("Server received request from connect()", async (): Promise<void> => {
    expect(ConnectView).toBeTruthy();

    const wrapper = mount(ConnectView, {
        global: {
            plugins: [pinia, router]
        }
    });

    const button = wrapper.find("#connect-button");
    const input = wrapper.find("#username-input");

    const expected: UserDataObject = {
        username: "test"
    };

    await input.setValue(expected.username);
    await wrapper.vm.$nextTick();

    const onDataReceived: Promise<void> = new Promise((resolve): void => {
        io.once("connection", (socket: Socket): void => {
            socket.once(StreamEvents.CLIENT_SEND_USERDATA, (data: UserDataObject): void => {
                expect(data).toStrictEqual(expected);
                resolve();
            });
        });
    });

    await button.trigger("click");
    await wrapper.vm.$nextTick();

    await onDataReceived;
});