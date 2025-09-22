<template>
    <div class="pa-8">
        <h4 class="text-h4 font-weight-bold text-left pt-1">Dashboard</h4>
        <div class="text-grey-darken-1 text-left pt-1">Overview of Asiasoft Reward System</div>

        <v-row justify="center" align="center" class="mt-6" dense>
            <v-col cols="12" sm="6" md="3">
                <v-card class="position-relative pa-2" rounded="lg" style="border: 2px solid #e0e0e0" flat>
                    <v-card-item>
                        <v-card-subtitle class="text-left font-weight-bold">Total Registered Guests</v-card-subtitle>
                        <v-card-title class="text-left text-h4 font-weight-bold">
                            {{ formatEmpty(data.guestsNumber) }}
                        </v-card-title>
                        <v-icon class="position-absolute top-0 right-0 ma-4" color="grey-darken-1"
                            >mdi-account-multiple</v-icon
                        >
                    </v-card-item>
                    <v-card-text>
                        <div class="text-medium-emphasis text-left">All Time</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card class="position-relative pa-2" rounded="lg" style="border: 2px solid #e0e0e0" flat>
                    <v-card-item>
                        <v-card-subtitle class="text-left font-weight-bold">Total Voucher Types</v-card-subtitle>
                        <v-card-title class="text-left text-h4 font-weight-bold">{{ data.totalVouchers }}</v-card-title>
                        <v-icon class="position-absolute top-0 right-0 ma-4" color="grey-darken-1"
                            >mdi-tag-check</v-icon
                        >
                    </v-card-item>
                    <v-card-text>
                        <div class="text-medium-emphasis text-left">All Time</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card class="position-relative pa-2" rounded="lg" style="border: 2px solid #e0e0e0" flat>
                    <v-card-item>
                        <v-card-subtitle class="text-left font-weight-bold">Attendance Rate</v-card-subtitle>
                        <v-card-title
                            class="text-left text-h4 font-weight-bold"
                            :style="data.attendanceRate > 50 ? 'color: #388E3C' : 'color: #F24E29'"
                            >{{ formatEmpty(data.attendanceRate.toFixed(2)) }}%</v-card-title
                        >
                        <v-icon class="position-absolute top-0 right-0 ma-4" color="grey-darken-1"
                            >mdi-chart-line-variant</v-icon
                        >
                    </v-card-item>
                    <v-card-text>
                        <div class="text-medium-emphasis text-left">Last 7 Days</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card class="position-relative pa-2" rounded="lg" style="border: 2px solid #e0e0e0" flat>
                    <v-card-item>
                        <v-card-subtitle class="text-left font-weight-bold">Redeemed Voucher</v-card-subtitle>
                        <v-card-title class="text-left text-h4 font-weight-bold">{{
                            data.redeemedVoucher
                        }}</v-card-title>
                        <v-icon class="position-absolute top-0 right-0 ma-4" color="grey-darken-1"
                            >mdi-account-tag-outline</v-icon
                        >
                    </v-card-item>
                    <v-card-text>
                        <div class="text-medium-emphasis text-left">All Time</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <h4 class="text-h4 font-weight-bold text-left pt-13">Data Trends</h4>
        <v-row>
            <v-col cols="12" md="6">
                <v-sheet class="pa-6 mt-6" rounded="lg" style="border: 2px solid #e0e0e0" flat>
                    <DoughnutChart :chart-data="chartData" :options="chartOptions" />
                </v-sheet>
            </v-col>
            <v-col cols="12" md="6">
                <v-sheet class="pa-6 mt-6" rounded="lg" style="border: 2px solid #e0e0e0" flat> </v-sheet>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getGuests } from "../api/guest";
import { getAttendance } from "../api/attendance";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, PieController } from "chart.js";
import { DoughnutChart } from "vue-chart-3";
import { formatEmpty } from "../utils/formatter";
import { getVoucherLog } from "../api/voucher";
import { getVoucherTypes } from "../api/voucher-type";

ChartJS.register(Title, Tooltip, Legend, ArcElement, PieController);

/* Pie Chart Configuration */
const chartData = ref({
    labels: [],
    datasets: [
        {
            data: [],
            backgroundColor: ["#B3D8FF", "#D3B3E5", "#DBEFDC", "#bc5090", "#ffa600"],
            spacing: 0,
        },
    ],
});

const chartOptions = ref({
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: "Guest Food Selection",
            font: { size: 20, weight: "bold" },
            padding: { top: 10, bottom: 10 },
            color: "#333",
            align: "center",
        },
        legend: { position: "bottom" },
    },
});

const data = ref({
    guestsNumber: 0,
    totalVouchers: 0,
    attendanceRate: 0,
    redeemedVoucher: 0,
});

onMounted(async () => {
    const result = await getGuests();
    if (result) {
        data.value.guestsNumber = result.data.length;

        const categories = ["Normal", "Halal", "Vegetarian"];
        chartData.value.labels = categories;
        const counts = { Normal: 0, Halal: 0, Vegetarian: 0 };

        for (const g of result.data) {
            if (categories.includes(g.foodSelection)) {
                counts[g.foodSelection]++;
            }
        }

        chartData.value.datasets[0].data = categories.map((cat) => counts[cat]);
    }

    const attendanceApi = await getAttendance();
    if (attendanceApi) {
        const rate = (attendanceApi.data.length / result.data.length) * 100;
        data.value.attendanceRate = rate;
    }

    const vouchersApi = await getVoucherTypes();
    if (vouchersApi) data.value.totalVouchers = vouchersApi.data.length;

    const voucherLogApi = await getVoucherLog();
    if (voucherLogApi) data.value.redeemedVoucher = voucherLogApi.data.length;
});
</script>

<style scoped></style>
