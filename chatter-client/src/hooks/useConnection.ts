import {useRouter} from "vue-router";
import {useUserStore} from "@/hooks/useUserStore";
import EventBus from "@/lib/EventBus";
import {ref} from "vue";
import type {SendUserDataObject, StatusObject} from "@/lib/utility";
import {config, GlobalEvents, StreamEvents} from "@/lib/utility";
import stream from "@/lib/stream";

const eventBus: EventBus = EventBus.getInstance();

/**
 * Function implementing socket connection with client view
 * @author Connell Reffo
 */
export function useConnection() {
    const router = useRouter();
    const userStore = useUserStore();

    const attemptingConnection = ref(false)
    const enteredName = ref("");

    function connect() {
        const userData: SendUserDataObject = {username: enteredName.value};

        if (userData.username.length >= config.MIN_NAME_LENGTH && userData.username.length <= config.MAX_NAME_LENGTH) {
            attemptingConnection.value = true;

            stream.connect();
            stream.once(StreamEvents.CLIENT_CONNECTED, (): void => {
                attemptingConnection.value = false;
                console.log("connected");
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

    return {
        attemptingConnection,
        enteredName,
        connect,
    };
}