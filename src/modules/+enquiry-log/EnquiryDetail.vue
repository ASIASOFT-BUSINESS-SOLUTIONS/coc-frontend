<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { convertDatetime, formatEmpty } from "../../utils/formatter";

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    detailData: { type: Object, default: () => ({}) },
});

const selectedItem = ref(null);

watch(
    () => props.detailData,
    (newData) => {
        if (newData) selectedItem.value = newData;
    },
    { immediate: true }
);

const emit = defineEmits(["update:modelValue", "submit"]);

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});
</script>

<template>
    <v-dialog v-model="isOpen" width="500">
        <v-card rounded="xl">
            <v-card-title class="d-flex justify-space-between align-center" style="background-color: #ffd700">
                <span class="text-h6 font-weight-bold pl-2">View Detail</span>
                <v-btn icon="mdi-close" flat @click="isOpen = false"> </v-btn>
            </v-card-title>
            <v-card-text>
                <div class="text-center mb-8">
                    <v-icon class="mb-3" color="success" icon="mdi-check-circle" size="80"></v-icon>
                    <h3 class="text-h4 font-weight-bold mb-3">New Enquiry</h3>
                </div>
                <v-row dense class="mt-1">
                    <v-col cols="4" class="opacity-60">Guest Name:</v-col>
                    <v-col cols="8" class="font-weight-medium text-right">{{
                        formatEmpty(selectedItem.guestName)
                    }}</v-col>
                </v-row>

                <v-row dense class="mt-1">
                    <v-col cols="4" class="opacity-60">Company Name:</v-col>
                    <v-col cols="8" class="font-weight-medium text-right">{{
                        formatEmpty(selectedItem.companyName)
                    }}</v-col>
                </v-row>

                <v-row dense class="mt-1">
                    <v-col cols="4" class="opacity-60">Mobile No.:</v-col>
                    <v-col cols="8" class="font-weight-medium text-right">{{
                        formatEmpty(selectedItem.mobileNo)
                    }}</v-col>
                </v-row>

                <v-row dense class="mt-1">
                    <v-col cols="4" class="opacity-60">Created At:</v-col>
                    <v-col cols="8" class="font-weight-medium text-right">{{
                        convertDatetime(selectedItem.createdAt) ?? "-"
                    }}</v-col>
                </v-row>

                <v-row dense class="mt-1">
                    <v-col cols="4" class="opacity-60">Created By:</v-col>
                    <v-col cols="8" class="font-weight-medium text-right">
                        {{ formatEmpty(selectedItem.createdBy) }}
                    </v-col>
                </v-row>

                <v-row dense class="mt-1">
                    <v-col cols="4" class="opacity-60">Remark:</v-col>
                    <v-col cols="8" class="font-weight-medium text-right">
                        {{ formatEmpty(selectedItem.remark) }}
                    </v-col>
                </v-row>

                <v-btn
                    block
                    flat
                    rounded="lg"
                    style="border: 2px solid #ffd700"
                    class="mt-8 text-h6"
                    size="large"
                    @click="isOpen = false"
                    >Done</v-btn
                >
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
