import EventBus from "@/lib/EventBus";

import {onUnmounted, reactive, ref} from "vue";
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
     * @param symbol The sender of the notification
     * @param color The color of the notification symbol
     */
    function handlePushNotification(body: string, symbol: string = "!", color: string = "var(--main-theme-color)"): void {
        const notification = reactive({
            id: counter++,
            body: body,
            symbol: symbol,
            color: color,
            clear: (): void => {
                notifications.delete(notification);
            }
        } as NotificationObject);

        window.setTimeout((): void => {
            notification.clear();
        }, notification.body.length * 200);

        notifications.add(notification)
    }

    const off = eventBus.on(GlobalEvents.NOTIFICATION, (notification: NotificationObject): void => {
        handlePushNotification(notification.body, notification.symbol, notification.color);
    });

    onUnmounted((): void => {
        off();
    });

    return {
        notifications
    };
}

/**
 * Function for pushing notifications through the event bus
 * @param notification An object that contains notification data
 */
export function pushNotification(notification: {body: string, color?: string, symbol?: string}): void {
    eventBus.emit(GlobalEvents.NOTIFICATION, notification);
}