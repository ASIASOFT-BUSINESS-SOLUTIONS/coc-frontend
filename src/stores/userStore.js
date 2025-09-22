import { defineStore } from "pinia";

export const useUserStore = defineStore("currentUser", {
    state: () => ({
        token: null,
        userID: null,
        userName: null,
        userTypeCode: null,
        userTypeDesc: null,
        expiryDate: null,
    }),
    actions: {
        setUser(data) {
            this.token = data.token;
            this.userID = data.userID;
            this.userName = data.userName;
            this.userTypeCode = data.userTypeCode;
            this.userTypeDesc = data.userTypeDesc;
            this.expiryDate = data.expiryDate;
        },
        cleanUser() {
            this.$reset();
        },
    },
    persist: true,
});
