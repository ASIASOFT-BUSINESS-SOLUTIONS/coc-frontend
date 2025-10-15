<template>
    <v-dialog v-model="isOpen" width="500">
        <v-card rounded="xl">
            <v-card-title class="d-flex justify-space-between align-center" style="background-color: #ffd700">
                <span class="text-h6 font-weight-bold pl-2">{{ isEdit ? "Edit" : "New" }} Enquiry</span>
                <v-btn
                    icon="mdi-close"
                    flat
                    @click="
                        isOpen = false;
                        resetForm();
                    "
                >
                </v-btn>
            </v-card-title>
            <v-card-text class="text-left">
                <v-form @submit.prevent="onSubmit">
                    <template v-if="isEdit">
                        <div class="text-center mb-8">
                            <v-icon color="info" icon="mdi-chat-question" size="80"></v-icon>
                            <h3 class="text-h4 font-weight-bold mb-3">{{ formData.guestName }}</h3>
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-subtitle-1 text-medium-emphasis">
                            <strong class="text-red">*</strong> Guest Code
                        </div>
                        <v-row dense class="pa-1">
                            <v-text-field
                                v-model="form.guestCode"
                                rounded="lg"
                                density="compact"
                                :rules="[rules.required]"
                                placeholder="Enter Guest Code"
                                variant="outlined"
                                class="mt-1 pr-4"
                                :disabled="isEdit"
                            ></v-text-field>
                            <v-btn
                                rounded="lg"
                                icon="mdi-qrcode-scan"
                                variant="text"
                                style="border: 3px solid #ffd700"
                                @click="showScanner = true"
                                :disabled="isEdit"
                            ></v-btn>
                        </v-row>
                    </template>

                    <div class="text-subtitle-1 text-medium-emphasis"><strong class="text-red">*</strong> Remark</div>
                    <v-row dense class="mb-2">
                        <v-col>
                            <v-checkbox
                                v-for="item in ['Request Demo Session', 'Ask for Pricing', 'Ask for upgrade', 'Others']"
                                :key="item"
                                :rules="[rules.required]"
                                v-model="form.remark"
                                :value="item"
                                color="info"
                                density="compact"
                                hide-details
                                multiple
                                class="pl-3 pt-1 pb-1 mt-2"
                                :class="getCheckboxClass(item)"
                                style="border: 1px solid #9e9e9e; border-radius: 8px"
                            >
                                <template #label>
                                    <span class="pl-2">{{ item }}</span>
                                </template>
                            </v-checkbox>
                        </v-col>
                    </v-row>

                    <v-textarea
                        v-if="form.remark.includes('Others')"
                        :rules="[rules.required]"
                        rounded="lg"
                        variant="outlined"
                        density="compact"
                        placeholder="Enter others remark"
                        v-model="form.otherRemark"
                    ></v-textarea>

                    <v-row class="mt-5">
                        <v-col cols="12" sm="6">
                            <v-btn
                                flat
                                block
                                rounded="lg"
                                color="red"
                                variant="outlined"
                                size="large"
                                @click="resetForm()"
                            >
                                Discard Changes
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-btn
                                flat
                                block
                                rounded="lg"
                                color="#FFD700"
                                size="large"
                                type="submit"
                                :disabled="!isFormValid"
                                :loading="loading"
                            >
                                Submit
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>

    <QrScanner v-model="showScanner" @scanned="onScanned" />
</template>

<script setup>
import { ref, computed, watch } from "vue";
import QrScanner from "../../components/QrScanner.vue";
import { rules } from "../../constants/validation.constant";

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    formData: { type: Object, default: () => ({}) },
    isEdit: { type: Boolean },
});

const form = ref({
    guestCode: null,
    remark: [],
    otherRemark: null,
});

const loading = ref(false);

watch(
    () => props.formData,
    (newData) => {
        if (newData) {
            const remarkArray = newData.remark
                ? newData.remark.split(",").map((item) => item.trim()) // split into array
                : [];

            // Separate "Others" remark if it contains a colon
            let otherRemark = null;
            const othersIndex = remarkArray.findIndex((r) => r.startsWith("Others:"));
            if (othersIndex !== -1) {
                // Extract the text after "Others:"
                otherRemark = remarkArray[othersIndex].split(":")[1]?.trim() || "";
                // Replace the full "Others: ..." with just "Others"
                remarkArray[othersIndex] = "Others";
            }

            form.value = {
                ...newData,
                remark: remarkArray,
                otherRemark,
            };
        } else resetForm();
    },
    { immediate: true }
);

watch(
    () => form.value.remark,
    (newVal) => {
        if (!newVal.includes("Others")) {
            form.value.otherRemark = null;
        }
    }
);

const emit = defineEmits(["update:modelValue", "submit"]);

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

watch(isOpen, (val) => {
    if (val) {
        if (props.formData) {
            const remarkArray = props.formData.remark
                ? props.formData.remark.split(",").map((item) => item.trim()) // split into array
                : [];

            // Separate "Others" remark if it contains a colon
            let otherRemark = null;
            const othersIndex = remarkArray.findIndex((r) => r.startsWith("Others:"));
            if (othersIndex !== -1) {
                // Extract the text after "Others:"
                otherRemark = remarkArray[othersIndex].split(":")[1]?.trim() || "";
                // Replace the full "Others: ..." with just "Others"
                remarkArray[othersIndex] = "Others";
            }

            form.value = {
                ...props.formData,
                remark: remarkArray,
                otherRemark,
            };
        } else {
            resetForm();
        }
    } else {
        resetForm();
    }
});

// Scan QR Code
const showScanner = ref(false);
function onScanned(result) {
    form.value.guestCode = result;
}

const getCheckboxClass = (value) => (form.value.remark.includes(value) ? "checked-border" : "");

function resetForm() {
    if (props.formData) {
        form.value = { ...props.formData };
    }
    form.value.guestCode = null;
    form.value.remark = [];
    form.value.otherRemark = null;
}

const isFormValid = computed(() => {
    return (
        !!form.value.guestCode?.trim() &&
        form.value.remark.length > 0 &&
        (!form.value.remark.includes("Others") || !!form.value.otherRemark)
    );
});

const onSubmit = async () => {
    loading.value = true;
    try {
        const remarks = [...form.value.remark];

        // Build the final array of remark strings
        const formattedRemarks = remarks.map((r) => {
            if (r === "Others") {
                return `Others: ${form.value.otherRemark || ""}`;
            }
            return r;
        });

        // Join them into one string
        form.value.remark = formattedRemarks.join(", ");
        emit("submit", { ...form.value });
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
        isOpen.value = false;
    }

    resetForm();
};
</script>
<style>
.checked-border {
    border: 1px solid #1976d2 !important; /* highlight color */
}
</style>
