
export default interface IObservable<EventType, ObserverType> {

    attach(event: EventType, ...observers: ObserverType[]): void;

    getObserverMap(): Map<EventType, ObserverType[]>;

    getEachObserver(): Set<ObserverType>;
}