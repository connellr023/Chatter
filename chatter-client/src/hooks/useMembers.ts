import type {ConnectedUsersObject, UserDataObject} from "@/lib/utility";
import {onMounted, onUnmounted, reactive} from "vue";
import stream from "@/lib/stream";
import {StreamEvents} from "@/lib/utility";

const members: Map<number, UserDataObject[]> = reactive(new Map<number, UserDataObject[]>());

export function useMembers() {
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