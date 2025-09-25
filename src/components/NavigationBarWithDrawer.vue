<template>
    <v-navigation-drawer v-model="drawer" app>
        <div class="pa-4 d-flex justify-center">
            <v-img :src="ara" alt="Asiasoft Reward Admin" max-width="150" draggable="false"></v-img>
        </div>
        <v-list density="compact" class="text-left" color="#FFD700" variant="flat" nav>
            <v-divider></v-divider>
            <br />
            <v-list-item :to="{ path: '/dashboard' }" title="Dashboard" rounded="lg">
                <template v-slot:prepend="{ isActive }">
                    <v-icon>
                        {{ isActive ? "mdi-home" : "mdi-home-outline" }}
                    </v-icon>
                </template>
            </v-list-item>
            <v-list-item :to="{ path: '/guest' }" title="Guest" rounded="lg">
                <template v-slot:prepend="{ isActive }">
                    <v-icon>
                        {{ isActive ? "mdi-account-multiple" : "mdi-account-multiple-outline" }}
                    </v-icon>
                </template>
            </v-list-item>
            <v-list-item :to="{ path: '/user' }" title="User" rounded="lg">
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
                <v-list-item :to="{ path: '/voucher-type' }" title="Type">
                    <template v-slot:prepend="{ isActive }">
                        <v-icon class="pl-8 pr-3">
                            {{ isActive ? "mdi-shape-plus" : "mdi-shape-plus-outline" }}
                        </v-icon>
                    </template>
                </v-list-item>
                <v-list-item :to="{ path: '/voucher-batch-list' }" title="Batch List">
                    <template v-slot:prepend="{ isActive }">
                        <v-icon class="pl-8 pr-3">
                            {{ isActive ? "mdi-tag-multiple" : "mdi-tag-multiple-outline" }}
                        </v-icon>
                    </template>
                </v-list-item>
                <v-list-item :to="{ path: '/voucher-redemption-log' }" title="Redemption Log">
                    <template v-slot:prepend="{ isActive }">
                        <v-icon class="pl-8 pr-3">
                            {{ isActive ? "mdi-tag-search" : "mdi-tag-search-outline" }}
                        </v-icon>
                    </template>
                </v-list-item>
            </v-list-group>
            <v-list-item :to="{ path: '/attendance-log' }" title="Attendance Log" rounded="lg">
                <template v-slot:prepend="{ isActive }">
                    <v-icon>
                        {{ isActive ? "mdi-clock" : "mdi-clock-outline" }}
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
                    <v-list-item :title="userStore.userName" :subtitle="userStore.userID">
                        <template v-slot:prepend>
                            <v-icon size="40" color="grey">mdi-account-circle</v-icon>
                        </template>
                    </v-list-item>
                    <v-divider class="my-2" thickness="2"></v-divider>
                    <v-list-item
                        prepend-icon="mdi-lock-open-outline"
                        subtitle="Change Password"
                        @click="dialog = true"
                    ></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-logout"
                        subtitle="Logout"
                        base-color="red"
                        @click="modal = true"
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
    <v-dialog v-model="dialog" width="500">
        <v-card rounded="xl">
            <v-card-title class="d-flex justify-space-between align-center" style="background-color: #ffd700">
                <span class="text-h5 font-weight-bold pl-2">Change Password</span>
                <v-btn
                    icon
                    variant="text"
                    @click="
                        dialog = false;
                        resetForm();
                    "
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="text-left mt-4">
                <v-row dense>
                    <v-col cols="12">
                        <div class="text-subtitle-1 text-medium-emphasis">Current Password</div>
                        <v-text-field
                            v-model="form.currentPassword"
                            rounded="lg"
                            :rules="[rules.required]"
                            placeholder="Current Password"
                            density="compact"
                            variant="outlined"
                            :type="visible ? 'text' : 'password'"
                            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="visible = !visible"
                            clearable
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <div class="text-subtitle-1 text-medium-emphasis">New Password</div>
                        <v-text-field
                            v-model="form.newPassword"
                            rounded="lg"
                            :rules="[rules.required]"
                            :type="visible ? 'text' : 'password'"
                            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="visible = !visible"
                            placeholder="New Password"
                            density="compact"
                            variant="outlined"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <div class="text-subtitle-1 text-medium-emphasis">Confirm Password</div>
                        <v-text-field
                            v-model="form.confirmPassword"
                            rounded="lg"
                            :rules="[rules.required, rules.confirmPassword(form.newPassword)]"
                            :type="visible ? 'text' : 'password'"
                            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="visible = !visible"
                            placeholder="Confirm Password"
                            density="compact"
                            variant="outlined"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row class="mt-6" dense>
                    <v-col>
                        <v-btn
                            flat
                            block
                            rounded="lg"
                            color="#FFD700"
                            size="large"
                            @click="onSubmit()"
                            :disabled="!isFormValid"
                            >Submit</v-btn
                        >
                    </v-col>
                    <v-col>
                        <v-btn
                            class="text-none text-body-1"
                            flat
                            block
                            rounded="lg"
                            size="large"
                            color="red"
                            variant="outlined"
                            @click="resetForm"
                        >
                            Discard Changes
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
    <Snackbar
        v-model="snackbar"
        :title="isSuccess ? successTitle : errorTitle"
        :color="isSuccess ? '#C7FFC9' : '#FFCFC4'"
        :icon="isSuccess ? 'mdi-check-circle' : 'mdi-close-circle'"
        :iconColor="isSuccess ? '#388E3C' : '#F44336'"
        :timeout="2500"
    ></Snackbar>
</template>

<script setup>
import { computed, ref } from "vue";
import ara from "../assets/reward-admin.png";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import ConfirmDialog from "./ConfirmDialog.vue";
import Snackbar from "./Snackbar.vue";
import { rules } from "../constants/validation.constant";
import { changeUserPassword } from "../api/user";

const drawer = ref(false);
const modal = ref(false);
const router = useRouter();
const userStore = useUserStore();

function logout() {
    const userStore = useUserStore();
    userStore.cleanUser();
    router.push({ name: "Login" });
}

const dialog = ref(false);
const visible = ref(false);
const form = ref({
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
});

const isFormValid = computed(() => {
    return (
        form.value.currentPassword &&
        form.value.newPassword &&
        form.value.confirmPassword !== null &&
        form.value.newPassword === form.value.confirmPassword
    );
});

const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);
const snackbar = ref(false);

function resetForm() {
    form.value = {
        currentPassword: null,
        newPassword: null,
        confirmPassword: null,
    };
}

async function onSubmit() {
    const payload = {
        userName: userStore.userName,
        currentPassword: form.value.currentPassword,
        newPassword: form.value.newPassword,
    };

    try {
        const response = await changeUserPassword(payload);
        isSuccess.value = response.success;
        if (response.success) {
            successTitle.value = "Password changed successfully!";
            dialog.value = false;
        } else {
            errorTitle.value = `Status ${response.status}: ${response.message}`;
        }
    } catch (error) {
        console.error(error);
    } finally {
        snackbar.value = true;
    }
}
</script>

<style>
.v-btn:focus,
.v-btn:active {
    outline: none !important;
}

.v-list-item:hover {
    color: #000 !important;
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
</style>
