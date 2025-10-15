<script setup>
import NavigationBarWithDrawer from "./components/NavigationBarWithDrawer.vue";
import Footer from "./components/Footer.vue";
import ScanQrCode from "./components/ScanQrCode.vue";
import { ref, computed } from "vue";
import EnquiryForm from "./modules/+enquiry-log/EnquiryForm.vue";
import { createGuestEnquiry } from "./api/enquiry";
import Snackbar from "./components/Snackbar.vue";
import { useRouter } from "vue-router";
import Loader from "./views/Loader.vue";
import loadingAnimation from "./assets/animations/Loading.json";
import { useLoader } from "./stores/loaderStore";
import { useSnackbarStore } from "./stores/snackbarStore";

const snackbar = useSnackbarStore();

const fabOpen = ref(false);

const enquiryDialog = ref(false);
const showDialog = ref(false);
const dialogType = ref("");

const openDialog = (type) => {
    dialogType.value = type;
    showDialog.value = true;
};

document.title = import.meta.env.VITE_APP_TITLE;

const handleSubmit = async (data) => {
    try {
        const response = await createGuestEnquiry({ guestCode: data.guestCode, remark: data.remark });

        if (response.success) {
            snackbar.openSnackbar({
                text: `Enquiry from ${response.data.guestName} successfully submitted!`,
                success: true,
            });
        } else {
            snackbar.openSnackbar({ text: `Status ${response.status}: ${response.message}`, success: false });
        }
        snackbar.value = true;
    } catch (error) {
        snackbar.openSnackbar({ text: "Network error, please try again!", success: false });
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

const { loading } = useLoader();
const router = useRouter();
router.beforeEach((to, from, next) => {
    loading.value = true;
    next();
});

router.afterEach(() => {
    setTimeout(() => (loading.value = false), 1000);
});
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
            <v-overlay v-model="loading" persistent class="d-flex align-center justify-center" style="z-index: 9999">
                <v-card
                    flat
                    class="pa-6 pb-4 d-flex flex-column align-center justify-center glass-card"
                    elevation="1"
                    rounded="xl"
                    width="180"
                >
                    <Loader :src="loadingAnimation" size="100px" />
                    <div class="font-weight-medium pt-3">Loading...</div>
                </v-card>
            </v-overlay>
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
        </template>
        <Snackbar
            v-model="snackbar.show"
            :title="snackbar.message"
            :color="snackbar.color"
            :icon="snackbar.icon"
            :iconColor="snackbar.iconColor"
            :timeout="3000"
        ></Snackbar>
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

.glass-card {
    background: rgba(255, 255, 255, 0.2); /* semi-transparent */
    backdrop-filter: blur(8px); /* frosted effect */
    -webkit-backdrop-filter: blur(12px); /* Safari support */
    border: 1px solid rgba(255, 255, 255, 0.3); /* subtle white border */
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}
</style>
