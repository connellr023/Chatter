/**
 * Abstract representation of a class that can emit messages to select observers
 * @author Connell Reffo
 */
export default interface IObservable<EventType, ObserverType> {

    /**
     * Attaches a sequence of observers to a specified event
     * @param event The event to listen for
     * @param observers The sequence of observers to attach
     */
    attach(event: EventType, ...observers: ObserverType[]): void;

    /**
     * Gets a map of observers indexed by the event they listen for
     */
    getObserverMap(): Map<EventType, ObserverType[]>;

    /**
     * Gets <i>exactly one</i> of each observer attached to this as a set
     */
    getEachObserver(): Set<ObserverType>;
}