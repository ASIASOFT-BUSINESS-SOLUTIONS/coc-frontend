<template>
    <v-dialog v-model="isOpen" width="600">
        <v-card rounded="xl">
            <v-card-title class="d-flex justify-space-between align-center" style="background-color: #ffd700">
                <span class="text-h6 font-weight-bold pl-2">Scan QR Code</span>
                <v-btn icon variant="text" @click="closeScanner">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text>
                <!-- Where html5-qrcode will render camera -->
                <qrcode-stream
                    @detect="onDetect"
                    :constraints="{ facingMode: 'environment' }"
                    :formats="['qr_code', 'code_128']"
                ></qrcode-stream>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { DetectedBarcode } from "barcode-detector";
import { ref, watch } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";

const props = defineProps({
    modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue", "scanned"]);

const isOpen = ref(props.modelValue);
watch(
    () => props.modelValue,
    (val) => (isOpen.value = val)
);
watch(isOpen, (val) => emit("update:modelValue", val));

function onDetect(scanned?: DetectedBarcode[]) {
    if (scanned && scanned.length > 0) {
        emit("scanned", scanned[0].rawValue);
        isOpen.value = false;
    }
}

function closeScanner() {
    isOpen.value = false;
}
</script>
