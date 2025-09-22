<script setup>
import NavigationBarWithDrawer from "./components/NavigationBarWithDrawer.vue";
import Footer from "./components/Footer.vue";
import ScanQrCode from "./components/ScanQrCode.vue";
import { ref } from "vue";

const fabOpen = ref(false);

const showDialog = ref(false);
const dialogType = ref("");

const openDialog = (type) => {
    dialogType.value = type;
    showDialog.value = true;
};

const handleSubmit = async (data) => {};
</script>

<template>
    <v-app>
        <template v-if="!$route.meta.hideLayout">
            <NavigationBarWithDrawer />
        </template>

        <v-main style="background-color: #fff8e1">
            <router-view />
        </v-main>

        <template v-if="!$route.meta.hideLayout">
            <v-fab
                app
                fixed
                icon
                location="bottom right"
                size="x-large"
                class="mr-8 float-right"
                style="bottom: 70px"
                :color="fabOpen ? '' : '#FFD700'"
            >
                <v-icon>{{ fabOpen ? "mdi-close" : "mdi-qrcode-scan" }}</v-icon>
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
                </v-speed-dial>
            </v-fab>

            <ScanQrCode v-model="showDialog" :type="dialogType" @submit="handleSubmit" />
        </template>

        <Footer />
    </v-app>
</template>

<style scoped>
.v-btn:focus,
.v-btn:active {
    outline: none !important;
}
</style>
