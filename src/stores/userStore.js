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

export function newHeader(extra = {}) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");

    Object.entries(extra).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            myHeaders.set(key, value);
        }
    });

    return myHeaders;
}
