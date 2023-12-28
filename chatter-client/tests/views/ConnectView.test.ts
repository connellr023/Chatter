import * as http from "http";

import ConnectView from "../../src/views/ConnectView.vue";
import CornerLogo from "../../src/components/CornerLogo.vue";
import WelcomeTitle from "../../src/components/WelcomeTitle.vue";
import LoadingButton from "../../src/components/LoadingButton.vue";
import NameLabel from "../../src/components/NameLabel.vue";

import {test, expect, beforeAll, afterAll, afterEach, beforeEach} from "vitest";
import {mount} from "@vue/test-utils";
import {createPinia, Pinia} from "pinia";
import {Server, Socket} from "socket.io";
import {StreamEvents, UserDataObject} from "../../src/lib/utility";
import {createRouter, createWebHistory, Router} from "vue-router";
import {useNotifications} from "../../src/hooks/useNotifications";

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

beforeEach((): void => {
    expect(ConnectView).toBeTruthy();
});

afterAll((): void => {
    io.close();
    httpServer.close();
});

afterEach((): void => {
    io.disconnectSockets();
    io.removeAllListeners();
});

test("Child components exist on mount", async (): Promise<void> => {
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

test("Server was sent request from connect()", async (): Promise<void> => {
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

test("Route changes to `/chat` on successful status received using connect()", async (): Promise<void> => {
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
            socket.once(StreamEvents.CLIENT_SEND_USERDATA, (): void => {
                socket.emit(StreamEvents.SERVER_SEND_STATUS, {success: true});

                window.setTimeout((): void => {
                    expect(router.currentRoute.value.path).toBe("/chat");
                    resolve();
                }, 100);
            });
        });
    });

    await button.trigger("click");
    await wrapper.vm.$nextTick();

    await onDataReceived;
});

test("Notification is pushed on unsuccessful status received using connect()", async (): Promise<void> => {
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
        const {notifications} = useNotifications();
        expect(notifications.size).toBe(0);

        io.once("connection", (socket: Socket): void => {
            socket.once(StreamEvents.CLIENT_SEND_USERDATA, (): void => {
                socket.emit(StreamEvents.SERVER_SEND_STATUS, {success: false});

                window.setTimeout((): void => {
                    expect(notifications.size).not.toBe(0);
                    resolve();
                }, 100);
            });
        });
    });

    await button.trigger("click");
    await wrapper.vm.$nextTick();

    await onDataReceived;
});

test("Notification is pushed on unsuccessful connection using connect()", async (): Promise<void> => {
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
        const {notifications} = useNotifications();
        expect(notifications.size).toBe(0);

        io.once("connection", (socket: Socket): void => {
            socket._error("test error");

            window.setTimeout((): void => {
                expect(notifications.size).not.toBe(0);
                resolve();
            }, 100);
        });
    });

    await button.trigger("click");
    await wrapper.vm.$nextTick();

    await onDataReceived;
});


test("Notification is pushed on username one character too short entered", async (): Promise<void> => {
    const wrapper = mount(ConnectView, {
        global: {
            plugins: [pinia, router]
        }
    });

    const button = wrapper.find("#connect-button");

    await wrapper.vm.$nextTick();

    const {notifications} = useNotifications();
    expect(notifications.size).toBe(0);

    await button.trigger("click");
    await wrapper.vm.$nextTick();

    expect(notifications.size).not.toBe(0);
});

test("Notification is pushed on username one character too long entered", async (): Promise<void> => {
    const wrapper = mount(ConnectView, {
        global: {
            plugins: [pinia, router]
        }
    });

    const button = wrapper.find("#connect-button");
    const input = wrapper.find("#username-input");

    await input.setValue("aaaaaaaaaaaaaaaa");
    await wrapper.vm.$nextTick();

    const {notifications} = useNotifications();
    expect(notifications.size).toBe(0);

    await button.trigger("click");
    await wrapper.vm.$nextTick();

    expect(notifications.size).not.toBe(0);
});