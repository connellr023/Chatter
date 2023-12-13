import IManager from "../Lib/IManager";
import IStreamObserver from "./IStreamObserver";

/**
 * Abstract representation of a class that manages a set of socket stream observers
 * @author Connell Reffo
 */
export default interface IStreamable extends IManager<IStreamObserver> {

}