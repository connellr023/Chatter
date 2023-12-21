/**
 * User data module
 * @author Connell Reffo
 */
import {defineStore} from "pinia";

export interface UserStateObject {
    username: string,
    connected: boolean
}

export const useUserStore = defineStore("user", {
    state: (): UserStateObject => ({
       username: "",
       connected: false
    }),
    actions: {

    },
    getters: {
        getUserState: (state: UserStateObject): UserStateObject => state
    }
});