<template>
    <v-navigation-drawer v-model="drawer" app>
        <div class="pa-4 d-flex justify-center">
            <v-img :src="ara" alt="Asiasoft Reward Admin" max-width="150" draggable="false"></v-img>
        </div>
        <v-list density="compact" class="text-left" color="#FFD700" variant="flat" nav>
            <v-divider></v-divider>
            <br />
            <v-list-item :to="{ path: '/dashboard' }" title="Dashboard" rounded="lg" class="drawer-item">
                <template v-slot:prepend="{ isActive }">
                    <v-icon>
                        {{ isActive ? "mdi-home" : "mdi-home-outline" }}
                    </v-icon>
                </template>
            </v-list-item>
            <v-list-item :to="{ path: '/guest' }" title="Guest" rounded="lg" class="drawer-item">
                <template v-slot:prepend="{ isActive }">
                    <v-icon>
                        {{ isActive ? "mdi-account-multiple" : "mdi-account-multiple-outline" }}
                    </v-icon>
                </template>
            </v-list-item>
            <v-list-item :to="{ path: '/user' }" title="User" rounded="lg" class="drawer-item">
                <template v-slot:prepend="{ isActive }">
                    <v-icon>
                        {{ isActive ? "mdi-shield-account" : "mdi-shield-account-outline" }}
                    </v-icon>
                </template>
            </v-list-item>
            <v-list-group value="Voucher" fluid>
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" title="Voucher">
                        <template v-slot:prepend="{ isOpen }">
                            <v-icon>
                                {{ isOpen ? "mdi-tag" : "mdi-tag-outline" }}
                            </v-icon>
                        </template>
                    </v-list-item>
                </template>
                <v-list-item :to="{ path: '/voucher-type' }" title="Type" class="drawer-item">
                    <template v-slot:prepend="{ isActive }">
                        <v-icon class="pl-8 pr-3">
                            {{ isActive ? "mdi-shape-plus" : "mdi-shape-plus-outline" }}
                        </v-icon>
                    </template>
                </v-list-item>
                <v-list-item :to="{ path: '/voucher-batch-list' }" title="Batch List" class="drawer-item">
                    <template v-slot:prepend="{ isActive }">
                        <v-icon class="pl-8 pr-3">
                            {{ isActive ? "mdi-tag-multiple" : "mdi-tag-multiple-outline" }}
                        </v-icon>
                    </template>
                </v-list-item>
                <v-list-item :to="{ path: '/voucher-log' }" title="Log" class="drawer-item">
                    <template v-slot:prepend="{ isActive }">
                        <v-icon class="pl-8 pr-3">
                            {{ isActive ? "mdi-tag-search" : "mdi-tag-search-outline" }}
                        </v-icon>
                    </template>
                </v-list-item>
            </v-list-group>
            <v-list-item :to="{ path: '/attendance-log' }" title="Attendance Log" rounded="lg" class="drawer-item">
                <template v-slot:prepend="{ isActive }">
                    <v-icon>
                        {{ isActive ? "mdi-clock" : "mdi-clock-outline" }}
                    </v-icon>
                </template>
            </v-list-item>
            <v-list-item :to="{ path: '/enquiry-log' }" title="Enquiry Log" rounded="lg" class="drawer-item">
                <template v-slot:prepend="{ isActive }">
                    <v-icon>
                        {{ isActive ? "mdi-chat-question" : "mdi-chat-question-outline" }}
                    </v-icon>
                </template>
            </v-list-item>
        </v-list>

        <template v-slot:append>
            <div class="pa-2">
                <v-btn block flat color="red" prepend-icon="mdi-logout" @click="modal = true">Logout</v-btn>
            </div>
        </template>
    </v-navigation-drawer>
    <v-app-bar flat app style="border-bottom: 1px solid #e0e0e0">
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="ml-3"></v-app-bar-nav-icon>
        </template>

        <v-btn append-icon="mdi-chevron-down" flat>
            <template v-slot:prepend><v-icon size="35" color="grey">mdi-account-circle</v-icon></template>
            <div class="text-subtitle-2 font-weight-regular">{{ userStore.userName }}</div>

            <v-menu activator="parent" location="bottom end" transition="fade-transition">
                <v-list density="compact" min-width="250" rounded="xl" elevation="4" slim>
                    <v-list-item :title="userStore.userName" :subtitle="userStore.userID" disabled="true">
                        <template v-slot:prepend>
                            <v-icon size="40" color="grey">mdi-account-circle</v-icon>
                        </template>
                    </v-list-item>
                    <v-divider class="my-2" thickness="2"></v-divider>
                    <v-list-item
                        prepend-icon="mdi-lock-open-outline"
                        subtitle="Change Password"
                        @click="dialog = true"
                        class="drawer-item"
                    ></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-logout"
                        subtitle="Logout"
                        base-color="red"
                        @click="modal = true"
                        class="drawer-item"
                    ></v-list-item>
                </v-list>
            </v-menu>
        </v-btn>
    </v-app-bar>
    <ConfirmDialog
        v-model="modal"
        title="Logout"
        message="Are you sure you want to logout?"
        :onYes="logout"
        color="#ffd700"
        titleColor="text-black"
    />
    <UserResetPassword v-model="dialog"></UserResetPassword>
</template>

<script setup>
import { ref } from "vue";
import ara from "../assets/reward-admin.png";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import ConfirmDialog from "./ConfirmDialog.vue";
import UserResetPassword from "../modules/+user/UserResetPassword.vue";

const drawer = ref(false);
const modal = ref(false);
const router = useRouter();
const userStore = useUserStore();

function logout() {
    const userStore = useUserStore();
    userStore.cleanUser();
    router.push({ name: "Login", query: { logout: "true" } });
}

const dialog = ref(false);
</script>

<style>
.v-btn:focus,
.v-btn:active {
    outline: none !important;
}

.v-list-item:hover {
    color: #1b75bb !important;
}

.v-list-item__overlay {
    background-color: transparent !important; /* kill the dim effect */
}

/* Only children inside the group */
.v-list-group .v-list-item:not(.v-list-group__header) {
    background-color: #f5f5f5;
    border-radius: 0;
    margin: 0 !important;
}

.v-list-group__items .v-list.item--active {
    border-radius: 50 !important;
}

/* The activator stays clean */
.v-list-group__header .v-list-item {
    background-color: transparent !important;
}

.v-list-item__spacer {
    width: 12px !important;
}

.v-list-item__prepend {
    padding-left: 12px;
}

.drawer-item {
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.drawer-item:hover {
    transform: translateX(6px);
}
</style>
