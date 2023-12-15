import IManager from "./IManager";

/**
 * Abstract representation of a manager class
 * @param O is the observer type to manager
 * @author Connell Reffo
 */
export default abstract class AbstractManager<O> implements IManager<O> {

    /**
     * Map of observers indexed by the event they listen for
     */
    protected observers: Map<string, O[]>;

    /**
     * Base constructor
     */
    public constructor() {
        this.observers = new Map<string, O[]>();
    }

    /**
     * @inheritDoc
     */
    public getObservers(): Map<string, O[]> {
        return this.observers;
    }

    /**
     * @inheritDoc
     */
    public getJustObservers(): O[] {
        let seen: O[] = [];

        this.observers.forEach((observers: O[]): void => {
            observers.forEach((observer: O): void => {
                if (!seen.includes(observer)) {
                    seen.push(observer);
                }
            });
        });

        return seen;
    }
}