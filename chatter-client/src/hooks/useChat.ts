import {type Ref, onUnmounted, reactive, ref} from "vue";
import {
    StreamEvents,
    type RoomsListObject,
    type MessageObject,
    type RoomObject,
    type ReceiveChatObject,
    type ChatObject
} from "@/lib/utility";

import stream from "@/lib/stream";

/**
 * Function for implementing room interactions with the client
 * @author Connell Reffo
 */
export function useChat() {
    let rooms: RoomObject[] = reactive([] as RoomObject[]);
    let messages: Map<number, MessageObject[]> = reactive(new Map<number, MessageObject[]>());

    const selectedRoomId: Ref<number> = ref(0);

    function queryRooms(select: boolean = false): void {
        stream.emit(StreamEvents.CLIENT_REQUEST_ROOMS);
        stream.once(StreamEvents.SERVER_SEND_ROOMS, (data: RoomsListObject): void => {
            data.rooms.forEach((room: RoomObject): void => {
                if (!rooms.includes(room)) {
                    rooms.push(room);
                }
            });

            if (select && data.rooms.length > 0) {
                selectedRoomId.value = data.rooms[0].id;
            }
        });
    }

    function sendMessage(body: string): void {
        const data: ChatObject = {
          roomId: selectedRoomId.value,
          text: body
        };

        stream.emit(StreamEvents.CLIENT_SEND_CHAT, data);
    }

    function messageListener(data: ReceiveChatObject): void {
        if (!messages.has(data.roomId)) {
            messages.set(data.roomId, []);
        }

        messages.get(data.roomId)?.push({
            body: data.message,
            sender: data.username
        });
    }

    stream.on(StreamEvents.SERVER_CHAT_RESPONSE, messageListener);

    onUnmounted((): void => {
        stream.removeListener(StreamEvents.SERVER_CHAT_RESPONSE, messageListener);

        rooms = [];
        messages.clear();
    });

    return {
        rooms,
        messages,
        selectedRoomId,
        sendMessage,
        queryRooms
    };
}