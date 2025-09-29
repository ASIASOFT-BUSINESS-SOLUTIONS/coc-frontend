<template>
    <v-container class="fill-height" width="1500" fluid>
        <v-row align="center" justify="center" class="text-center">
            <v-col cols="12">
                <v-img :src="logo" alt="Asiasoft Reward Admin" max-width="200" class="mx-auto"></v-img>
            </v-col>

            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card class="pa-6 pb-3 pa-sm-4 mb-8" rounded="xl">
                    <v-card-title class="font-weight-bold text-left text-h5 text-sm-h4">Login</v-card-title>
                    <v-card-text class="text-left">
                        <v-form @submit.prevent="onSubmit">
                            <div class="text-subtitle-1 text-medium-emphasis">User ID</div>
                            <v-text-field
                                placeholder="User ID"
                                v-model="userID"
                                class="mb-2"
                                :rules="[rules.required]"
                                density="compact"
                                clearable
                            ></v-text-field>

                            <div
                                class="text-subtitle-1 text-medium-emphasis d-flex flex-column flex-sm-row justify-space-between"
                            >
                                <span>Password</span>
                                <!-- <a
                                    class="text-caption text-decoration-none text-blue mt-1 mt-sm-0"
                                    href="#"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    >Forgot login password?</a
                                > -->
                            </div>

                            <v-text-field
                                placeholder="Password"
                                v-model="password"
                                class="mb-2"
                                :rules="[rules.required]"
                                density="compact"
                                :type="visible ? 'text' : 'password'"
                                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append-inner="visible = !visible"
                                clearable
                            ></v-text-field>

                            <v-checkbox v-model="remember" label="Remember me" density="compact" />
                            <v-btn
                                flat
                                block
                                rounded="lg"
                                color="#FFD700"
                                size="large"
                                class="mt-4"
                                :loading="loading"
                                type="submit"
                            >
                                Login
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <Snackbar
            v-model="snackbar"
            :title="isSuccess ? successTitle : errorTitle"
            :color="isSuccess ? '#C7FFC9' : '#FFCFC4'"
            :icon="isSuccess ? 'mdi-check-circle' : 'mdi-close-circle'"
            :iconColor="isSuccess ? '#388E3C' : '#F44336'"
            :timeout="2500"
        ></Snackbar>
    </v-container>
</template>

<script setup>
import { ref } from "vue";
import logo from "../assets/reward-admin.png";
import Snackbar from "../components/Snackbar.vue";
import { useRouter } from "vue-router";
import { authLogin } from "../api/user";
import { useUserStore } from "../stores/userStore";
import { rules } from "../constants/validation.constant";
import { useHotkey } from "vuetify";

const userID = ref(null);
const password = ref(null);
const remember = ref(false);
const visible = ref(false);

const loading = ref(false);

const router = useRouter();

const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);
const snackbar = ref(false);

async function onSubmit() {
    loading.value = true;

    try {
        const response = await authLogin({ userID: userID.value, password: password.value });

        if (response.status === 200) {
            if (response.data.voucherTypeCode && response.data.userTypeCode == "K") {
                isSuccess.value = false;
                errorTitle.value = `Status ${response.status}: Only admin account is allowed to access.`;
                snackbar.value = true;
                return;
            }
            const userStore = useUserStore();
            userStore.setUser(response.data);
            router.push("/dashboard");
        } else {
            isSuccess.value = false;
            errorTitle.value = `Status ${response.status}: Invalid User ID or Password`;
            snackbar.value = true;
        }
    } catch (error) {
        console.error(error.message);
    } finally {
        loading.value = false;
    }
}

useHotkey("Enter", onSubmit);
</script>

<style scoped>
.v-btn:focus,
.v-btn:active {
    outline: none !important;
}
</style>
