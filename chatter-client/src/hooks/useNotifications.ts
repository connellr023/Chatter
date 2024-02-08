import EventBus from "@/lib/EventBus";

import {onUnmounted, reactive} from "vue";
import {type NotificationObject} from "@/lib/utility";
import {GlobalEvents} from "@/lib/utility";

const eventBus: EventBus = EventBus.getInstance();

/**
 * Function for implementing client side notifications
 * @author Connell Reffo
 */
export function useNotifications() {
    const notifications = reactive(new Set<NotificationObject>);
    let counter: number = 0;

    /**
     * Updates the reactive notifications set accordingly
     * @param body The body of the notification
     */
    function handlePushNotification(body: string): void {
        const notification = reactive({
            id: counter++,
            body: body,
            clear: (): void => {
                notifications.delete(notification);
            }
        } as NotificationObject);

        window.setTimeout((): void => {
            notification.clear();
        }, notification.body.length * 200);

        notifications.add(notification)
    }

    const off = eventBus.on(GlobalEvents.NOTIFICATION, handlePushNotification);

    onUnmounted((): void => {
        off();
    });

    return {
        notifications
    };
}

/**
 * Function for pushing notifications through the event bus
 * @param body The notification text
 */
export function pushNotification(body: string): void {
    eventBus.emit(GlobalEvents.NOTIFICATION, body);
}