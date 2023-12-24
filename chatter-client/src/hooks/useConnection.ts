import {type Router, useRouter} from "vue-router";
import {type Ref, ref} from "vue";
import type {UserDataObject, StatusObject, ConnectedUsersObject} from "@/lib/utility";
import {useUserStore} from "@/hooks/useUserStore";
import {config, StreamEvents} from "@/lib/utility";
import {pushNotification} from "@/hooks/useNotifications";

import stream from "@/lib/stream";
import {useMembers} from "@/hooks/useMembers";

/**
 * Function implementing socket connection with client view
 * @author Connell Reffo
 */
export function useConnection() {
    const router: Router = useRouter();
    const userStore = useUserStore();

    const attemptingConnection: Ref<boolean> = ref(false);
    const enteredName: Ref<string> = ref("");

    useMembers();

    function connect(): void {
        const userData: UserDataObject = {username: enteredName.value};

        if (userData.username.length >= config.MIN_NAME_LENGTH && userData.username.length <= config.MAX_NAME_LENGTH) {
            attemptingConnection.value = true;

            stream.connect();
            stream.once(StreamEvents.CONNECT, (): void => {
                stream.emit(StreamEvents.CLIENT_SEND_USERDATA, userData);

                attemptingConnection.value = false;
                userStore.connected = true;

                pushNotification({body: "Connected", color: "var(--main-green-color)"});

                stream.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
                    if (status.success) {
                        userStore.username = userData.username;
                        router.push("/chat").then();
                    }
                    else {
                        pushNotification({body: "Server rejected request"});
                    }
                });
            });

            stream.once(StreamEvents.ERROR, (): void => {
                stream.disconnect();

                attemptingConnection.value = false;
                pushNotification({body: "Connection failed"});
            });
        }
        else {
            pushNotification({body: `Username must be within ${config.MIN_NAME_LENGTH} and ${config.MAX_NAME_LENGTH} characters`});
        }
    }

    function disconnect(): void {
        if (stream.connected) {
            stream.disconnect();
            stream.once(StreamEvents.DISCONNECT, (): void => {
                userStore.connected = false;
                userStore.username = "";

                pushNotification({body: "Disconnected"});
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