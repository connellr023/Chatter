/**
 * Interface for a manager class
 * @param O is the observer type to manager
 * @author Connell Reffo
 */
export default interface IManager<O> {

    /**
     * Gets a mapping of observers indexed by their corresponding event
     */
    getObservers(): Map<string, O[]>;

    /**
     * Gets a list of one of each observer attached to this manager
     */
    getJustObservers(): O[];
}