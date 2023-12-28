import * as http from "http";

import ChatView from "../../src/views/ChatView.vue";

import {afterAll, afterEach, beforeAll, beforeEach, expect, test} from "vitest";
import {pinia, router, serverSocketOptions, hostname} from "../testUtility";
import {Server} from "socket.io";
import {shallowMount} from "@vue/test-utils";
import {useUserStore} from "../../src/hooks/useUserStore";
import {initializeStream} from "../../src/lib/stream";

let httpServer: http.Server;
let io: Server;

const port: number = 6000;

beforeAll((): void => {
    initializeStream(port, hostname);

    httpServer = http.createServer();
    httpServer.listen(port, hostname);

    io = new Server(httpServer, serverSocketOptions);
});

beforeEach((): void => {
    expect(ChatView).toBeTruthy();
});

afterAll((): void => {
    io.close();
    httpServer.close();
});

afterEach((): void => {
    io.disconnectSockets();
    io.removeAllListeners();
});

test("Route goes to error on mount before connecting", async (): Promise<void> => {
    shallowMount(ChatView, {
        global: {
            plugins: [pinia, router]
        }
    });

    const {getUserState} = useUserStore();

    expect(getUserState.username).toBe("");
    expect(router.currentRoute.value.path).not.toBe("/chat");
});

test("Mount component with user store initialized", async (): Promise<void> => {
    const wrapper = shallowMount(ChatView, {
        global: {
            plugins: [pinia, router]
        }
    });

    const userStore = useUserStore();
    userStore.username = "test";
    userStore.connected = true;

    await wrapper.vm.$nextTick();

    const username = wrapper.find("#username");
    expect(username.text()).toContain(userStore.username);
});