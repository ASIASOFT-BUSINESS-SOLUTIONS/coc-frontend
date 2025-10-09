<template>
    <v-dialog v-model="isOpen" width="500">
        <v-card rounded="xl">
            <v-card-title class="d-flex justify-space-between align-center" style="background-color: #ffd700">
                <span class="text-h6 font-weight-bold pl-2">Manual Key In</span>
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

            <v-card-text class="text-left">
                <v-form v-model="form" @submit.prevent="onSubmit">
                    <div class="text-subtitle-1 text-medium-emphasis">
                        {{ typeLabel === "Voucher" ? "Voucher No." : "Guest Code" }}
                    </div>
                    <v-row dense class="pa-1">
                        <v-text-field
                            v-model="code"
                            rounded="lg"
                            density="compact"
                            :rules="[required]"
                            :placeholder="typeLabel === 'Voucher' ? 'Enter Voucher No.' : 'Enter Guest Code'"
                            variant="outlined"
                            class="mt-1 pr-4"
                        ></v-text-field>
                        <v-btn
                            rounded="lg"
                            icon="mdi-qrcode-scan"
                            variant="text"
                            style="border: 3px solid #ffd700"
                            @click="showScanner = true"
                        ></v-btn>
                    </v-row>

                    <v-btn
                        flat
                        block
                        rounded="lg"
                        color="#FFD700"
                        size="large"
                        type="submit"
                        :disabled="!code"
                        class="mt-4"
                    >
                        Submit
                    </v-btn>
                </v-form>

                <Snackbar
                    v-model="snackbar"
                    :title="isSuccess ? successTitle : errorTitle"
                    :color="isSuccess ? '#C7FFC9' : '#FFCFC4'"
                    :icon="isSuccess ? 'mdi-check-circle' : 'mdi-close-circle'"
                    :iconColor="isSuccess ? '#388E3C' : '#F44336'"
                    :timeout="2500"
                ></Snackbar>
            </v-card-text>
        </v-card>
    </v-dialog>

    <QrScanner v-model="showScanner" @scanned="onScanned" />
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Snackbar from "./Snackbar.vue";
import QrScanner from "./QrScanner.vue";
import { redeemVoucher } from "../api/voucher";
import { submitAttendance } from "../api/attendance";

function required(v) {
    return !!v || "Field is required";
}

const props = defineProps({
    modelValue: { type: Boolean, required: true }, // to control open/close
    type: { type: String, required: true }, // attendance | voucher
});

const emit = defineEmits(["update:modelValue", "submit"]);

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

watch(isOpen, (val) => {
    if (val) {
        if (props.formData) {
            form.value = { ...props.formData };
        } else {
            resetForm();
        }
    } else {
        resetForm();
    }
});

const form = ref(false);
const code = ref("");
const loading = ref(false);
const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);
const snackbar = ref(false);

const typeLabel = computed(() => props.type.charAt(0).toUpperCase() + props.type.slice(1));

function resetForm() {
    code.value = null;
}

const onSubmit = async () => {
    const payload = {
        type: props.type,
        code: code.value,
    };

    emit("submit", payload);
    loading.value = true;
    try {
        let response;

        switch (payload.type) {
            case "attendance":
                response = await submitAttendance(code.value);
                break;
            case "voucher":
                response = await redeemVoucher(code.value);
                break;
        }

        if (response.success) {
            isSuccess.value = true;
            successTitle.value = `${payload.type.charAt(0).toUpperCase() + props.type.slice(1)} submited successfully!`;
            snackbar.value = true;
        } else {
            isSuccess.value = false;
            errorTitle.value = `Status ${response.status}: ${response.message}`;
            snackbar.value = true;
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }

    // isOpen.value = false;
    code.value = null;
};

// Scan QR Code
const showScanner = ref(false);
function onScanned(result) {
    console.debug(result);
    code.value = result;
}
</script>
