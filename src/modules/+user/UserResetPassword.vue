<script setup>
import { computed, ref } from "vue";
import { rules } from "../../constants/validation.constant";
import { changeUserPassword } from "../../api/user";
import Snackbar from "../../components/Snackbar.vue";
import { useUserStore } from "../../stores/userStore";

const props = defineProps({
    modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const form = ref({
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
});

const userStore = useUserStore();
const visible = ref(false);
const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);
const snackbar = ref(false);

const isFormValid = computed(() => {
    return (
        form.value.currentPassword &&
        form.value.newPassword &&
        form.value.confirmPassword !== null &&
        form.value.newPassword === form.value.confirmPassword
    );
});

function resetForm() {
    form.value = {
        currentPassword: null,
        newPassword: null,
        confirmPassword: null,
    };
}

const onSubmit = async () => {
    try {
        const payload = {
            userName: userStore.userName,
            currentPassword: form.value.currentPassword,
            newPassword: form.value.newPassword,
        };
        const response = await changeUserPassword(payload);
        isSuccess.value = response.success;
        if (response.success) {
            successTitle.value = "Password changed successfully!";
            dialog.value = false;
        } else {
            errorTitle.value = `Status ${response.status}: ${response.message}`;
        }

        snackbar.value = true;
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <v-dialog v-model="isOpen" width="500">
        <v-card rounded="xl">
            <v-card-title class="d-flex justify-space-between align-center" style="background-color: #ffd700">
                <span class="text-h5 font-weight-bold pl-2">Change Password</span>
                <v-btn
                    icon
                    variant="text"
                    @click="
                        isOpen = false;
                        resetForm();
                    "
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="text-left mt-4">
                <v-form @submit.prevent="onSubmit">
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
                                class="hover-lift"
                                :disabled="!isFormValid"
                                type="submit"
                                >Submit</v-btn
                            >
                        </v-col>
                        <v-col>
                            <v-btn
                                style="border: 2px solid #f44336; color: red"
                                class="hover-lift"
                                flat
                                block
                                rounded="lg"
                                size="large"
                                @click="resetForm"
                            >
                                Discard Changes
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
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
