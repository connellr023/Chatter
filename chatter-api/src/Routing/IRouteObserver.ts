import { Request, Response } from "express";

/**
 * Specifies the basis for a route observer class
 *
 * Alternative to just hooking a route with a callback
 * Allows for more control than a callback if required
 * 
 * @author Connell Reffo
 */
export default interface IRouteObserver {

    /**
     * Triggers when a specific route this observer is registered to is accessed
     * @param request The request object passed from the router
     * @param response The response object passed from the router
     */
    onRouteAccessed(request: Request, response: Response): void;
}