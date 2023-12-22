import {GlobalEvents} from "@/lib/utility";

/**
 * Class for managing global events
 * @author Connell Reffo
 */
export default class EventBus {
    protected listeners: Record<string|GlobalEvents, Set<EventCallback>>;

    private static instance: EventBus = new EventBus();

    public static getInstance(): EventBus {
        return this.instance;
    }

    private constructor() {
        this.listeners = {};
    }

    public emit<T = any>(event: string|GlobalEvents, payload: T): void {
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback: EventCallback): void => {
                callback(payload);
            });
        }
    }

    public on<T = any>(event: string|GlobalEvents, callback: EventCallback<T>): () => void {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set<EventCallback>();
        }

        this.listeners[event].add(callback);

        return (): void => {this.off(event, callback)};
    }

    private off<T = any>(event: string|GlobalEvents, callback: EventCallback<T>): void {
        this.listeners[event].delete(callback);
    }
}

type EventCallback<T = any> = (payload: T) => void;