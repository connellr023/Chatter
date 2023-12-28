import {type Router, useRouter} from "vue-router";
import {type Ref, ref} from "vue";
import type {UserDataObject, StatusObject} from "@/lib/utility";
import {useUserStore} from "@/hooks/useUserStore";
import {useMembers} from "@/hooks/useMembers";
import {pushNotification} from "@/hooks/useNotifications";
import {config, StreamEvents} from "@/lib/utility";
import {stream} from "@/lib/stream";

/**
 * Function implementing socket stream with client view
 * @author Connell Reffo
 */
export function useConnection() {
    const router: Router = useRouter();
    const userStore = useUserStore();

    const attemptingConnection: Ref<boolean> = ref(false);

    useMembers();

    /**
     * Attempts to establish a stream with the server <br />
     * Notifications and reactive properties are updated accordingly
     * @param enteredName Is the username to be verified when connecting to the server
     */
    function connect(enteredName: string): void {
        const userData: UserDataObject = {username: enteredName || ""};

        if (userData.username.length >= config.MIN_NAME_LENGTH && userData.username.length <= config.MAX_NAME_LENGTH) {
            attemptingConnection.value = true;

            stream.connect();
            stream.once(StreamEvents.CONNECT, (): void => {
                stream.emit(StreamEvents.CLIENT_SEND_USERDATA, userData);

                attemptingConnection.value = false;
                userStore.connected = true;

                pushNotification("Connected");

                stream.once(StreamEvents.SERVER_SEND_STATUS, (status: StatusObject): void => {
                    if (status.success) {
                        userStore.username = userData.username;
                        router.push("/chat").then();
                    }
                    else {
                        pushNotification("Server rejected request");
                    }
                });
            });

            stream.once(StreamEvents.ERROR, (): void => {
                stream.disconnect();
                stream.removeAllListeners();

                attemptingConnection.value = false;
                pushNotification("Connection failed");

                router.push({name: "error", params: {code: "10060", "message": "Connection Closed"}}).then();
            });
        }
        else {
            pushNotification(`Username must be within ${config.MIN_NAME_LENGTH} and ${config.MAX_NAME_LENGTH} characters`);
        }
    }

    /**
     * Disconnects from the server <br />
     * Notifications and reactive properties are updated accordingly
     */
    function disconnect(): void {
        if (stream.connected) {
            stream.disconnect();
            stream.once(StreamEvents.DISCONNECT, (): void => {
                userStore.connected = false;
                userStore.username = "";

                pushNotification("Disconnected");
            });
        }
    }

    return {
        attemptingConnection,
        connect,
        disconnect
    };
}