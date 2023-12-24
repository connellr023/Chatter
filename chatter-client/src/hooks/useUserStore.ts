import {defineStore} from "pinia";

/**
 * Outlines an object that represents the user's state
 * @author Connell Reffo
 */
export interface UserStateObject {
    username: string,
    connected: boolean
}

/**
 * Function that allows for updating and reading the user store
 * @author Connell Reffo
 */
export const useUserStore = defineStore("user", {
    state: (): UserStateObject => ({
       username: "",
       connected: false
    }),
    getters: {
        getUserState: (state: UserStateObject): UserStateObject => state
    }
});