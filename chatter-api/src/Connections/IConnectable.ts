import IManager from "../Lib/IManager";
import IConnectionObserver from "./IConnectionObserver";

/**
 * Abstract representation of a class that is responsible for managing client connections to a socket stream
 * @author Connell Reffo
 */
export default interface IConnectable extends IManager<IConnectionObserver> {
    
}