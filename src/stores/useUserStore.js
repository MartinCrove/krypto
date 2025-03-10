import { defineStore } from "pinia";

export const useUserStore = defineStore('user' , {
    state: () => ({
        username: sessionStorage.getItem('username') || '',
    }),
    actions: {
        setUsername(name){
            this.username = name
            sessionStorage.setItem('username', name)
        }
    }

})