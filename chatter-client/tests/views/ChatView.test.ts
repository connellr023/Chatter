import * as http from "http";

import ChatView from "../../src/views/ChatView.vue";
import ConnectView from "../../src/views/ConnectView.vue";

import {afterAll, afterEach, beforeAll, beforeEach, expect, test} from "vitest";
import {pinia, router, serverSocketOptions, hostname} from "../testUtility";
import {Server} from "socket.io";
import {shallowMount} from "@vue/test-utils";
import {useUserStore} from "../../src/hooks/useUserStore";
import {initializeStream} from "../../src/lib/stream";
import {useNotifications} from "../../src/hooks/useNotifications";

let httpServer: http.Server;
let io: Server;

const port: number = 7000;

beforeAll((): void => {
    initializeStream(true, port);

    httpServer = http.createServer();
    httpServer.listen(port, hostname);

    io = new Server(httpServer, serverSocketOptions);
});

beforeEach((): void => {
    expect(ConnectView).toBeTruthy();
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

test("Notification is pushed when attempting to send message one character too long", async (): Promise<void> => {
    const wrapper = shallowMount(ChatView, {
        global: {
            plugins: [pinia, router]
        }
    });

    const {notifications} = useNotifications();
    const userStore = useUserStore();

    userStore.username = "test";
    userStore.connected = true;

    await wrapper.vm.$nextTick();

    const chatInput = wrapper.find("#chat-input");
    const sendButton = wrapper.find("#send-button");

    expect(notifications.size).toBe(0);

    await chatInput.setValue("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjja");
    await wrapper.vm.$nextTick();

    await sendButton.trigger("click");
    await wrapper.vm.$nextTick();

    expect(notifications.size).toBe(1);
});

test("No notification is pushed when attempting to send message one character too short", async (): Promise<void> => {
    const wrapper = shallowMount(ChatView, {
        global: {
            plugins: [pinia, router]
        }
    });

    const {notifications} = useNotifications();
    const userStore = useUserStore();

    userStore.username = "test";
    userStore.connected = true;

    await wrapper.vm.$nextTick();

    const sendButton = wrapper.find("#send-button");

    await sendButton.trigger("click");
    await wrapper.vm.$nextTick();

    expect(notifications.size).toBe(0);
});

/**********************************************************************************************
 * The next test is large (almost end to end) and it simulates major user interaction <br />  *
 * Dummy responses are sent to the client socket throughout the test                          *
 * ********************************************************************************************
 */

// const testRouter: Router = createRouter({
//     history: createWebHistory(),
//     routes: [
//         {
//             path: "/",
//             component: ConnectView
//         },
//         {
//             path: "/chat",
//             name: "chat",
//             component: ChatView
//         }
//     ]
// });

// test("Connect to server, send a chat message, then return to home", async (): Promise<void> => {
//     const connectViewWrapper = mount(ConnectView, {
//         global: {
//             plugins: [pinia, testRouter]
//         }
//     });

//     const connectButton = connectViewWrapper.find("#connect-button");
//     const usernameInput = connectViewWrapper.find("#username-input");

//     const expected: UserDataObject = {
//         username: "test"
//     };

//     await usernameInput.setValue(expected.username);
//     await connectViewWrapper.vm.$nextTick();

//     const onDataReceived: Promise<void> = new Promise((resolve): void => {
//         io.once("connection", (socket: Socket): void => {
//             socket.once(StreamEvents.CLIENT_SEND_USERDATA, (): void => {
//                 const connections: ConnectedUsersObject = {
//                     roomId: 0,
//                     connections: [expected]
//                 };

//                 socket.emit(StreamEvents.SERVER_SEND_STATUS, {success: true});
//                 socket.emit(StreamEvents.SERVER_UPDATE_CONNECTIONS, connections)
//             });

//             socket.once(StreamEvents.CLIENT_SEND_CHAT, (data: ChatObject): void => {
//                 socket.emit(StreamEvents.SERVER_CHAT_RESPONSE, data);
//             });

//             socket.once(StreamEvents.CLIENT_REQUEST_ROOMS, (): void => {
//                 const res: RoomsListObject = {
//                     rooms: [
//                         {
//                             isGlobal: true,
//                             name: "test room",
//                             id: 0
//                         },
//                         {
//                             isGlobal: false,
//                             name: "test private",
//                             id: 1
//                         }
//                     ]
//                 };

//                 const chatViewWrapper = mount(ChatView, {
//                     global: {
//                         plugins: [pinia, testRouter],
//                     },
//                 });

//                 socket.emit(StreamEvents.SERVER_SEND_ROOMS, res);
//                 chatViewWrapper.vm.$nextTick();

//                 window.setTimeout((): void => {
//                     expect(testRouter.currentRoute.value.path).toBe("/chat");

//                     const chatInput = chatViewWrapper.find("#chat-input");
//                     const sendButton = chatViewWrapper.find("#send-button");

//                     const chat = chatViewWrapper.find("#messages-container");
//                     expect(chat.find("#empty-messages").exists()).toBe(true);

//                     chatInput.setValue("test message");
//                     chatViewWrapper.vm.$nextTick();

//                     sendButton.trigger("click");
//                     chatViewWrapper.vm.$nextTick();

//                     window.setTimeout((): void => {
//                         expect(chat.find(".message-element").exists()).toBe(true);

//                         const userInfo = chatViewWrapper.find("#user-info");
//                         userInfo.trigger("click");
//                         chatViewWrapper.vm.$nextTick();

//                         expect(router.currentRoute.value.path).not.toBe("/chat");

//                         chatViewWrapper.unmount();
//                         resolve();
//                     }, 100);
//                 }, 100);
//             });
//         });
//     });

//     await connectButton.trigger("click");
//     await connectViewWrapper.vm.$nextTick();

//     await onDataReceived;
// });