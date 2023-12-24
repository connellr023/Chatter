import type {ConnectedUsersObject, UserDataObject} from "@/lib/utility";
import {onMounted, onUnmounted, reactive} from "vue";
import stream from "@/lib/stream";
import {StreamEvents} from "@/lib/utility";

const members: Map<number, UserDataObject[]> = reactive(new Map<number, UserDataObject[]>());

/**
 * Allows components to access the map of members in rooms this client is part of <br />
 * Automatically attaches and detaches listener
 * @author Connell Reffo
 */
export function useMembers() {

    /**
     * Listens for updates regarding connected clients from the server
     * @param data The data that was received
     */
    function newMembersListener(data: ConnectedUsersObject): void {
        members.set(data.roomId, data.connections);
    }

    onMounted((): void => {
        stream.on(StreamEvents.SERVER_UPDATE_CONNECTIONS, newMembersListener);
    })

    onUnmounted((): void => {
        stream.removeListener(StreamEvents.SERVER_UPDATE_CONNECTIONS, newMembersListener);
    });

    return {
        members
    }
}