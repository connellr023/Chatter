import {Express, Request, Response} from "express";
import IRoutable from "./IRoutable";
import IRouteObserver from "./IRouteObserver";
import {HttpRequestMethods} from "../Lib/Enumerations";

export default class RouterManager implements IRoutable {

    /**
     * @inheritDoc
     */
    protected observers: Map<string, IRouteObserver[]>;

    /**
     * Base constructor
     */
    public constructor() {
        this.observers = new Map<string, IRouteObserver[]>();
    }

    /**
     * Attaches an observer to a given express router
     * @param instance The express instance
     * @param method The HTTP Request method to listen for
     * @param route The route to watch for
     * @param observers The observer(s) to register to this route
     */
    public attach(instance: Express, method: HttpRequestMethods, route: string, ...observers: IRouteObserver[]): void {
        let callbacks: Array<(request: Request, response: Response) => any> = [];

        observers.forEach((observer: IRouteObserver): void => {
            callbacks.push(observer.onRouteAccessed);
        });

        switch (method) {
            case HttpRequestMethods.GET:
                instance.get(route, callbacks);
                break;
            case HttpRequestMethods.POST:
                instance.post(route, callbacks);
                break;
        }

        if (!this.observers.has(route)) {
            this.observers.set(route, []);
        }

        this.observers.get(route).push(...observers);
    }

    /**
     * @inheritDoc
     */
    public attachGet(instance: Express, route: string, ...observers: IRouteObserver[]): void {
        this.attach(instance, HttpRequestMethods.GET, route, ...observers);
    }

    /**
     * @inheritDoc
     */
    public attachPost(instance: Express, route: string, ...observers: IRouteObserver[]): void {
        this.attach(instance, HttpRequestMethods.POST, route, ...observers);
    }

    /**
     * @inheritDoc
     */
    public getObservers(): Map<string, IRouteObserver[]> {
        return this.observers;
    }
}