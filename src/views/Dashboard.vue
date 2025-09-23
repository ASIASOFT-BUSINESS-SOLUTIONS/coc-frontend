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
                <v-sheet class="pa-6 mt-6" rounded="lg" style="border: 2px solid #e0e0e0" flat>
                    <v-select
                        v-model="selectedVoucherType"
                        :items="vouchersList"
                        item-title="title"
                        item-value="batchKey"
                        label="Select Voucher"
                        :loading="loadingTypes"
                        density="compact"
                        variant="outlined"
                        hide-details
                        clearable
                    />
                    <BarChart :chart-data="barData" :options="barOptions" />
                </v-sheet>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { guestInquiry } from "../api/guest";
import { getAttendance } from "../api/attendance";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PieController,
    BarElement,
    CategoryScale,
    LinearScale,
    BarController,
} from "chart.js";
import { DoughnutChart, BarChart } from "vue-chart-3";
import { formatDate, formatEmpty } from "../utils/formatter";
import { getVoucher, getVoucherLog, getVouchers, voucherInquiry } from "../api/voucher";
import { getVoucherTypes } from "../api/voucher-type";

ChartJS.register(Title, Tooltip, Legend, ArcElement, PieController);
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, BarController);

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
            padding: { top: 10, bottom: 30 },
            color: "#333",
            align: "center",
        },
        legend: { position: "bottom" },
    },
});

/* Bar Graph Configuration */
const vouchersList = ref([]);
const selectedVoucherType = ref(null);
const loadingTypes = ref(false);

const barData = ref({
    labels: [],
    datasets: [
        {
            label: "Guest",
            data: [],
            backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(75, 192, 192, 0.2)"],
            borderColor: ["rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(75, 192, 192)"],
            borderWidth: 1,
        },
    ],
});

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Assigned Guest Food Selection for Lunch Voucher",
            font: { size: 20, weight: "bold" },
            padding: { top: 30, bottom: 30 },
            color: "#333",
            align: "center",
        },
        legend: { position: "bottom" },
    },
};

const data = ref({
    guestsNumber: 0,
    totalVouchers: 0,
    attendanceRate: 0,
    redeemedVoucher: 0,
});

onMounted(async () => {
    const voucherTypesApi = await getVoucherTypes();
    if (voucherTypesApi) data.value.totalVouchers = voucherTypesApi.data.length;

    const voucherLogApi = await getVoucherLog();
    if (voucherLogApi) data.value.redeemedVoucher = voucherLogApi.data.length;

    const vouchersApi = await getVouchers();
    if (vouchersApi)
        vouchersList.value = vouchersApi.data
            .filter((v) => v.forFoodSelection === true)
            .map((v) => ({
                ...v,
                // Create a new property for the displayed title
                title: `${v.voucherTypeCode} (${formatDate(v.startDate)} to ${formatDate(v.endDate)})`,
            }));

    const gInquiry = await guestInquiry();
    let totalCount = 0;
    if (gInquiry) {
        chartData.value.labels = gInquiry.data.foodSelections.map((s) => s.title);
        chartData.value.datasets[0].data = gInquiry.data.foodSelections.map((s) => s.count);

        totalCount = gInquiry.data.foodSelections.reduce((sum, s) => sum + s.count, 0);
    }

    data.value.guestsNumber = totalCount;
    const attendanceApi = await getAttendance();
    if (attendanceApi) {
        const rate = (attendanceApi.data.length / totalCount) * 100;
        data.value.attendanceRate = rate;
    }
});

watch(
    () => selectedVoucherType.value,
    async (newKey) => {
        if (!newKey) return;

        try {
            const res = await getVoucher(selectedVoucherType.value);
            if (res.data.details) {
                const grouped = res.data.details.reduce((acc, item) => {
                    const key = item.foodSelection || "Unknown";
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, {});

                const result = Object.entries(grouped).map(([foodSelection, count]) => ({
                    foodSelection,
                    count,
                }));

                barData.value.labels = result.map((item) => item.foodSelection);

                barData.value.datasets[0].data = result.map((i) => i.count);
            }
        } catch (err) {
            console.error("Failed to load voucher detail", err);
        }
    }
);
</script>

<style scoped></style>
