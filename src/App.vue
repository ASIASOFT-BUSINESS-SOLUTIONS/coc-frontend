<script setup>
import NavigationBarWithDrawer from "./components/NavigationBarWithDrawer.vue";
import Footer from "./components/Footer.vue";
import ScanQrCode from "./components/ScanQrCode.vue";
import { ref, computed } from "vue";
import EnquiryForm from "./modules/+enquiry-log/EnquiryForm.vue";
import { createGuestEnquiry } from "./api/enquiry";
import Snackbar from "./components/Snackbar.vue";

const fabOpen = ref(false);

const enquiryDialog = ref(false);
const showDialog = ref(false);
const dialogType = ref("");

const openDialog = (type) => {
    dialogType.value = type;
    showDialog.value = true;
};

document.title = import.meta.env.VITE_APP_TITLE;

const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);
const snackbar = ref(false);

const handleSubmit = async (data) => {
    try {
        const response = await createGuestEnquiry({ guestCode: data.guestCode, remark: data.remark });

        if (response.success) {
            isSuccess.value = true;
            successTitle.value = `Enquiry from ${response.data.guestName} successfully submitted!`;
        } else {
            isSuccess.value = false;
            errorTitle.value = `Status ${response.status}: ${response.message}`;
        }
        snackbar.value = true;
    } catch (error) {
        console.error(error);
    }
};

const rotation = ref(0);

function rotateIcon() {
    rotation.value += 90;
}

// Apply rotation dynamically
const iconStyle = computed(() => ({
    transform: `rotate(${rotation.value}deg)`,
    transition: "transform 0.4s ease",
}));
</script>

<template>
    <v-app>
        <template v-if="!$route.meta.hideLayout">
            <NavigationBarWithDrawer />
        </template>

        <v-main style="background-color: #fffbef">
            <v-scroll-x-transition mode="in" hide-on-leave="true">
                <router-view></router-view>
            </v-scroll-x-transition>
        </v-main>

        <template v-if="!$route.meta.hideLayout">
            <v-fab
                app
                fixed
                icon
                location="bottom right"
                size="x-large"
                class="mr-8 float-right"
                @mouseenter="rotateIcon"
                style="bottom: 70px"
                :color="fabOpen ? '' : '#FFD700'"
            >
                <v-icon :style="iconStyle">{{ fabOpen ? "mdi-close" : "mdi-qrcode-scan" }}</v-icon>
                <v-speed-dial v-model="fabOpen" location="top center" transition="scale-transition" activator="parent">
                    <v-btn
                        key="attendance"
                        color="success"
                        size="large"
                        rounded="lg"
                        prepend-icon="mdi-land-plots-marker"
                        @click="openDialog('attendance')"
                        >Attendance</v-btn
                    >

                    <v-btn
                        key="voucher"
                        color="info"
                        size="large"
                        rounded="lg"
                        prepend-icon="mdi-ticket-percent"
                        @click="openDialog('voucher')"
                        >Voucher</v-btn
                    >

                    <v-btn
                        key="enquiry"
                        color="red"
                        size="large"
                        rounded="lg"
                        prepend-icon="mdi-chat-question"
                        @click="enquiryDialog = true"
                        >Enquiry</v-btn
                    >
                </v-speed-dial>
            </v-fab>

            <ScanQrCode v-model="showDialog" :type="dialogType" />
            <EnquiryForm v-model="enquiryDialog" :formData="null" @submit="handleSubmit"></EnquiryForm>
            <Snackbar
                v-model="snackbar"
                :title="isSuccess ? successTitle : errorTitle"
                :color="isSuccess ? '#C7FFC9' : '#FFCFC4'"
                :icon="isSuccess ? 'mdi-check-circle' : 'mdi-close-circle'"
                :iconColor="isSuccess ? '#388E3C' : '#F44336'"
                :timeout="3000"
            ></Snackbar>
        </template>
        <Footer />
    </v-app>
</template>

<style scoped>
.fab-hover {
    transition: transform 0.3s ease;
}

.fab-hover:hover {
    transform: rotate(20deg) scale(1.05);
}

.fab-hover:hover .v-icon {
    transition: transform 0.3s ease;
    transform: rotate(90deg);
}
</style>
