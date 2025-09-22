<template>
    <v-dialog v-model="internalValue" width="500">
        <v-card rounded="xl">
            <v-card-title class="d-flex justify-space-between align-center" :style="{ backgroundColor: color }">
                <span class="text-h5 font-weight-bold pl-2" :class="titleColor">
                    {{ title }}
                </span>
                <v-btn icon variant="text" :class="titleColor" @click="$emit('update:modelValue', false)">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="text-center mt-4">
                <div class="font-weight-medium">{{ message }}</div>

                <v-row class="mt-6" dense>
                    <v-col>
                        <v-btn flat block rounded="lg" :color="color" size="large" @click="onConfirm"> Yes </v-btn>
                    </v-col>
                    <v-col>
                        <v-btn
                            flat
                            block
                            rounded="lg"
                            :style="{ border: `2px solid ${color}` }"
                            size="large"
                            @click="$emit('update:modelValue', false)"
                        >
                            Cancel
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    modelValue: Boolean, // v-model binding
    title: { type: String, default: "Confirm" },
    message: { type: String, default: "Are you sure?" },
    color: { type: String, default: "#f44336" },
    titleColor: { type: String, default: "text-white" },
    onYes: Function, // callback when user clicks Yes
});

const internalValue = ref(props.modelValue);

function onConfirm() {
    // close dialog first
    emit("update:modelValue", false);
    // run the provided callback if exists
    if (props.onYes) props.onYes();
}

const emit = defineEmits(["update:modelValue"]);

watch(
    () => props.modelValue,
    (val) => {
        internalValue.value = val;
    }
);

watch(internalValue, (val) => {
    emit("update:modelValue", val);
});
</script>
