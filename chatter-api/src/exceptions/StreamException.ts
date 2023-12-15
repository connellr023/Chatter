/**
 * Error for problems that occur in the stream facade
 * @author Connell Reffo
 */
export default class StreamError extends Error {

    /**
     * Base constructor for StreamError
     * @param message The error message
     */
    constructor(message = "A stream error occurred") {
        super(message);
    }
}