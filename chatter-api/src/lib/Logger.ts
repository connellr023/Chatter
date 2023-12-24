/**
 * Logs server activity by printing to console
 * @author Connell Reffo
 */
export default class Logger {

    /**
     * Helper method for other static logger methods <br />
     * <b>[(symbol)] -> (message)</b>
     */
    private static out(symbol: string, colorCode: string, message: string): void {
        console.log(`\x1b[1m${colorCode}[${symbol}] ⟶ ${message}\x1b[0m`);
    }

    public static ok(message: string): void {
        this.out("✔", "\x1b[42m", message);
    }

    public static error(message: string): void {
        this.out("✘", "\x1b[41m", message);
    }
}