import {onUnmounted} from "vue";
import {GlobalEvents} from "@/lib/utility";

/**
 * Class for managing global events
 * @author Connell Reffo
 */
class EventBus {
    protected eventBus: Record<string|GlobalEvents, Set<EventCallback>>;

    public constructor() {
        this.eventBus = {};
    }

    public emit<T = any>(event: string|GlobalEvents, payload: T): void {
        if (this.eventBus[event]) {
            this.eventBus[event].forEach((callback: EventCallback): void => {
                callback(payload);
            });
        }
    }

    public on<T = any>(event: string|GlobalEvents, callback: EventCallback<T>): () => void {
        if (!this.eventBus[event]) {
            this.eventBus[event] = new Set<EventCallback>();
        }

        this.eventBus[event].add(callback);

        return (): void => {this.off(event, callback)};
    }

    private off<T = any>(event: string|GlobalEvents, callback: EventCallback<T>): void {
        this.eventBus[event].delete(callback);
    }
}

type EventCallback<T = any> = (payload: T) => void;

const instance: EventBus = new EventBus();
export const useEventBus = (): EventBus => instance;