import {GlobalEvents} from "@/lib/utility";

/**
 * Class for managing global events
 * @author Connell Reffo
 */
export default class EventBus {

    /**
     * Listeners that are registered to this event bus
     */
    protected listeners: Record<string|GlobalEvents, Set<EventCallback>>;

    /**
     * The only instance of an event bus for this app
     */
    private static instance: EventBus = new EventBus();

    /**
     * Gets the only event bus instance
     */
    public static getInstance(): EventBus {
        return this.instance;
    }

    /**
     * Resets the only event bus instance <br />
     * <b>This is intended for testing only</b>
     */
    public static resetInstance(): EventBus {
        return this.instance = new EventBus();
    }

    /**
     * Base constructor
     */
    private constructor() {
        this.listeners = {};
    }

    /**
     * Emits an event with data over the event bus
     * @param event The event name
     * @param payload The data to emit
     */
    public emit<T = any>(event: string|GlobalEvents, payload: T): void {
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback: EventCallback): void => {
                callback(payload);
            });
        }
    }

    /**
     * Registers a listener as a callback
     * @param event The event to listen for
     * @param callback The callback to be triggered
     */
    public on<T = any>(event: string|GlobalEvents, callback: EventCallback<T>): () => void {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set<EventCallback>();
        }

        this.listeners[event].add(callback);

        return (): void => {this.off(event, callback)};
    }

    /**
     * Removes a listener
     * @param event The event of the listener to remove
     * @param callback The callback to be removed
     */
    private off<T = any>(event: string|GlobalEvents, callback: EventCallback<T>): void {
        this.listeners[event].delete(callback);
    }
}

type EventCallback<T = any> = (payload: T) => void;