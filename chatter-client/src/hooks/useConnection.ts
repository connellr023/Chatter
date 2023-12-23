import {type Router, useRouter} from "vue-router";
import {useUserStore} from "@/hooks/useUserStore";
import {type Ref, ref} from "vue";
import type {SendUserDataObject, StatusObject} from "@/lib/utility";
import {config, GlobalEvents, StreamEvents} from "@/lib/utility";

import EventBus from "@/lib/EventBus";
import stream from "@/lib/stream";

const eventBus: EventBus = EventBus.getInstance();

/**
 * Function implementing socket connection with client view
 * @author Connell Reffo
 */
export function useConnection() {
    const router: Router = useRouter();
    const userStore = useUserStore();

    const attemptingConnection: Ref<boolean> = ref(false);
    const enteredName: Ref<string> = ref("");

    function connect(): void {
        const userData: SendUserDataObject = {username: enteredName.value};

        if (userData.username.length >= config.MIN_NAME_LENGTH && userData.username.length <= config.MAX_NAME_LENGTH) {
            attemptingConnection.value = true;

            stream.connect();
            stream.once(StreamEvents.CLIENT_CONNECTED, (): void => {
                attemptingConnection.value = false;
                userStore.connected = true;

                eventBus.emit(GlobalEvents.NOTIFICATION, {body: "Connected", color: "var(--main-green-color)"});
                stream.emit(StreamEvents.CLIENT_SEND_USERDATA, userData);
                stream.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
                    if (status.success) {
                        userStore.username = userData.username;
                        router.push("/chat").then();
                    }
                    else {
                        eventBus.emit(GlobalEvents.NOTIFICATION, {body: "Server rejected request"});
                    }
                });
            });

            stream.once(StreamEvents.ERROR, (): void => {
                stream.disconnect();

                attemptingConnection.value = false;
                eventBus.emit(GlobalEvents.NOTIFICATION, {body: "Connection failed"});
            });
        }
        else {
            eventBus.emit(GlobalEvents.NOTIFICATION, {body: `Username must be within ${config.MIN_NAME_LENGTH} and ${config.MAX_NAME_LENGTH} characters`});
        }
    }

    function disconnect(): void {
        if (stream.connected) {
            stream.disconnect();
            stream.once(StreamEvents.CLIENT_DISCONNECTED, (): void => {
                userStore.connected = false;
                userStore.username = "";

                eventBus.emit(GlobalEvents.NOTIFICATION, {body: "Disconnected"});
            });
        }
    }

    return {
        attemptingConnection,
        enteredName,
        connect,
        disconnect
    };
}