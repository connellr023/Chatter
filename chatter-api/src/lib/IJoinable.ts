import IIdentifiable from "./IIdentifiable";
import IStreamable from "../stream/IStreamable";
import Client from "../connection/Client";

export default interface IJoinable extends IIdentifiable, IStreamable {

    getMembers(): Client[];
}