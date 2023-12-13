/**
 * Pair of name and ID
 * @author Connell Reffo
 */
export default class NamedIdentity {

    protected name: string;

    protected id: string

    public constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }

    public getName(): string {
        return this.name;
    }

    public getID(): string {
        return this.id;
    }
}