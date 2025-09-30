<template>
    <div class="pa-8">
        <v-row class="align-center mb-4">
            <v-col cols="12" sm="8">
                <h4 class="text-h4 font-weight-bold text-left pt-1">Attendance Log</h4>
                <div class="text-grey-darken-1 text-left pt-1">View attendance log of guest</div>
            </v-col>
            <v-col cols="12" sm="4" class="text-sm-right text-left mt-2 mt-md-0">
                <!-- <ExportList type="attendance" /> -->
                <v-btn flat rounded="lg" style="border: 2px solid #ffd700" @click="exportCsv">Export List</v-btn>
            </v-col>
        </v-row>

        <v-text-field
            v-model="search"
            placeholder="Type and press Enter to search"
            rounded="lg"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            bg-color="#ffffff"
            clearable
            @keyup.enter="reload"
        />
        <v-data-table-server
            class="rounded-lg border-thin text-left"
            :headers="headers"
            :items="items"
            :items-length="totalItems"
            :loading="loading"
            v-model:items-per-page="options.itemsPerPage"
            hover
            striped="odd"
            show-current-page
            @update:options="loadItems"
        >
            <template #item.status="{ item }">
                <v-chip color="green" size="small" label class="text-white font-weight-bold"> Present </v-chip>
            </template>
            <template #item.createdAt="{ item }"> {{ convertDatetime(item.createdAt) }} </template>
            <template #item.action="{ item }">
                <v-tooltip text="View" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            key="view"
                            color="blue"
                            @click="viewItem(item)"
                            size="x-small"
                            variant="text"
                            icon
                        >
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
            </template>
        </v-data-table-server>
        <v-dialog v-model="modal" width="500">
            <v-card rounded="xl">
                <v-card-title class="d-flex justify-space-between align-center" style="background-color: #ffd700">
                    <span class="text-h6 font-weight-bold pl-2">View Detail</span>
                    <v-btn icon variant="text" @click="modal = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <div class="text-center mb-8">
                        <v-icon class="mb-3" color="success" icon="mdi-check-circle" size="80"></v-icon>
                        <h3 class="text-h4 font-weight-bold mb-3">Check In</h3>
                    </div>
                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">Guest Name:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right">{{
                            formatEmpty(selectedItem.guestName)
                        }}</v-col>
                    </v-row>

                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">Type:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right">Check In</v-col>
                    </v-row>

                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">Check In Datetime:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right">{{
                            convertDatetime(selectedItem.createdAt) ?? "-"
                        }}</v-col>
                    </v-row>

                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">Issued By:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right">
                            {{ formatEmpty(selectedItem.createdBy) }}
                        </v-col>
                    </v-row>

                    <v-btn
                        block
                        flat
                        rounded="lg"
                        style="border: 2px solid #ffd700"
                        class="mt-8 text-h6"
                        size="large"
                        @click="modal = false"
                        >Done</v-btn
                    >
                </v-card-text>
            </v-card>
        </v-dialog>

        <Snackbar
            v-model="snackbar"
            :title="isSuccess ? successTitle : errorTitle"
            :color="isSuccess ? '#C7FFC9' : '#FFCFC4'"
            :icon="isSuccess ? 'mdi-check-circle' : 'mdi-close-circle'"
            :iconColor="isSuccess ? '#388E3C' : '#F44336'"
            :timeout="2500"
        ></Snackbar>
    </div>
</template>

<script setup lang="ts">
import { getAttendance } from "../../api/attendance";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Snackbar from "../../components/Snackbar.vue";
import { convertDatetime, formatEmpty } from "../../utils/formatter";
import { loadDatatable } from "../../utils/loader";

// The Datatable
const headers = ref([
    { title: "Guest Name", key: "guestName", minWidth: 250 },
    { title: "Guest Code", key: "guestCode", minWidth: 200 },
    { title: "Company Name", key: "companyName", minWidth: 180 },
    { title: "Email Address", key: "emailAddress", minWidth: 200 },
    { title: "Mobile No.", key: "mobileNo", minWidth: 150 },
    { title: "Checked In Datetime", key: "createdAt", minWidth: 200 },
    { title: "Status", key: "status" },
    { title: "Action", key: "action", sortable: false, fixed: "end" },
]);

const modal = ref(false);
const selectedItem = ref(null);
function viewItem(item) {
    selectedItem.value = item;
    modal.value = true;
}

const loading = ref(false);
const search = ref("");
const items = ref([]);
const totalItems = ref(0);

const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
});

function reload() {
    options.value.page = 1;
    loadItems(options.value);
}

/* Load data from server */
async function loadItems({ page, itemsPerPage, sortBy }) {
    loading.value = true;

    try {
        const { items: result, total } = await loadDatatable({
            fetchFn: getAttendance,
            searchTerm: search.value,
            page: page,
            itemsPerPage: itemsPerPage,
            sortBy: sortBy,
        });

        totalItems.value = total;
        items.value = result;
    } catch (error) {
        console.error("Failed to fetch attendance.", error);
    } finally {
        loading.value = false;
    }
}

const route = useRoute();
const router = useRouter();
onMounted(() => {
    if (route.query.created === "true") {
        successTitle.value = "New guest attendance added successfully!";
        isSuccess.value = true;
        snackbar.value = true;
        router.replace({ query: {} });
    }
});

function exportCsv() {
    if (!items.value.length) {
        alert("No data to export");
        return;
    }

    // 1. Pick the keys/columns you want
    const activeHeaders = headers.value.filter((h) => h.key && h.key !== "action");
    const headerRow = activeHeaders.map((h) => `"${h.title}"`).join(",");

    // 2. Build CSV rows
    const rows = items.value.map((item) =>
        activeHeaders
            .map((h) => {
                const cell = item[h.key] ?? "";
                const escaped = String(cell).replace(/"/g, '""');
                return `"${escaped}"`;
            })
            .join(",")
    );

    const csv = [headerRow, ...rows].join("\r\n");

    // 3. Create a Blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Attendance(${new Date().toISOString().split("T")[0]}).csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
</script>
