import {Express} from "express";
import IRouteObserver from "./IRouteObserver";
import {IManager} from "../Lib/IManager";

/**
 * Specifies the basis of a route manager
 * Servers to add the use of routing observers for more control after a route is accessed
 *
 * NOTE: There is no way to detach registered observers as it is not necessary for this project
 *
 * @author Connell Reffo
 */
export default interface IRoutable extends IManager<IRouteObserver> {

    /**
     * Attaches an observer to a route via a get request
     * @param instance The express instance of this app
     * @param route The route to watch
     * @param observers The observer(s) to register to this route
     */
    attachGet(instance: Express, route: string, ...observers: IRouteObserver[]): void;

    /**
     * Attaches an observer to a route via a post request
     * @param instance The express instance of this app
     * @param route The route to watch
     * @param observers The observer(s) to register to this route
     */
    attachPost(instance: Express, route: string, ...observers: IRouteObserver[]): void;

    /**
     * Gets a map of the observers registered to this manager indexed by the route they are registered to
     */
    getObservers(): Map<string, IRouteObserver[]>;
}