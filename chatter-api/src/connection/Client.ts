import IIdentifiable from "../lib/IIdentifiable";

export default class Client implements IIdentifiable {

    public getName(): string {
        return "";
    }

    public getID(): number {
        return 0;
    }
}