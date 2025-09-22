<template>
    <v-snackbar v-model="internalValue" :color="color" rounded="lg" :timeout="timeout" location="bottom" class="mt-4">
        <div class="d-flex align-center ga-2">
            <v-icon :color="iconColor" :icon="icon" />
            <span class="font-weight-medium">{{ title }}</span>
        </div>

        <template #actions>
            <v-btn variant="text" @click="internalValue = false" icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    modelValue: { type: Boolean, required: true }, // v-model
    title: { type: String, required: true }, // message string
    color: { type: String, default: "#FFCFC4" },
    icon: { type: String, default: "mdi-close-circle" },
    iconColor: { type: String, default: "#F44336" },
    timeout: { type: Number, default: 3000 },
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

// sync prop → local
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
