import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
    const show = ref(false);
    const message = ref("");
    const color = ref("");
    const icon = ref("");
    const iconColor = ref("");
    const isSuccess = ref(true);

    function openSnackbar({ text, success = true }) {
        isSuccess.value = success;
        message.value = text;
        color.value = success ? "#C7FFC9" : "#FFCFC4";
        icon.value = success ? "mdi-check-circle" : "mdi-close-circle";
        iconColor.value = success ? "#388E3C" : "#F44336";
        show.value = true;
    }

    return { show, message, color, icon, iconColor, isSuccess, openSnackbar };
});
