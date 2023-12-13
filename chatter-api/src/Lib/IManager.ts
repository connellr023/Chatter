/**
 * Specifies an abstract representation of a manager class
 * @param O is the observer type to manager
 * @author Connell Reffo
 */
export default interface IManager<O> {

    /**
     * Gets a mapping of observers indexed by their corresponding event
     * @public
     */
    getObservers(): Map<string, O[]>;
}