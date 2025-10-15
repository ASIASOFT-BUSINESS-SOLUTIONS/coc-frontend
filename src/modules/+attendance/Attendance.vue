<template>
    <div class="pa-8">
        <v-row class="align-center mb-4">
            <v-col cols="12" sm="8">
                <h4 class="text-h4 font-weight-bold text-left pt-1">Attendance Log</h4>
                <div class="text-grey-darken-1 text-left pt-1">View attendance log of guest</div>
            </v-col>
            <v-col cols="12" sm="4" class="text-sm-right text-left mt-2 mt-md-0">
                <!-- <ExportList type="attendance" /> -->
                <v-btn flat rounded="lg" class="hover-lift" style="border: 2px solid #ffd700" @click="exportFile()"
                    >Export List</v-btn
                >
            </v-col>
        </v-row>

        <v-text-field
            v-model="search"
            placeholder="Type and press Enter to search"
            rounded="lg"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            flat
            hide-details
            class="mb-4"
            style="border: 1px solid #e0e0e0; border-radius: 10px"
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
                    <v-btn icon="mdi-close" flat @click="modal = false"> </v-btn>
                </v-card-title>
                <v-card-text>
                    <div class="text-center mb-8">
                        <v-icon class="mb-3" color="success" icon="mdi-check-circle" size="80"></v-icon>
                        <h3 class="text-h4 font-weight-bold mb-3">Check In</h3>
                    </div>
                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">Guest Name:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right"
                            >{{ formatEmpty(selectedItem.guestName) }} ({{
                                formatEmpty(selectedItem.guestCode)
                            }})</v-col
                        >
                    </v-row>

                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">Type:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right">Check In</v-col>
                    </v-row>

                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">Check In Datetime:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right">{{
                            convertDatetime(selectedItem.createdAt)
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
    </div>
</template>

<script setup lang="ts">
import { getAttendance } from "../../api/attendance";
import { onMounted, ref } from "vue";
import { convertDatetime, formatEmpty } from "../../utils/formatter";
import { exportCsv, loadDatatable, withMinLoading } from "../../utils/loader";
import { useLoader } from "../../stores/loaderStore";

// The Datatable
const headers = ref([
    { title: "Guest Name", key: "guestName", minWidth: 250 },
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

const { loading } = useLoader();
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
        const { items: result, total } = await withMinLoading(
            loadDatatable({
                fetchFn: getAttendance,
                searchTerm: search.value,
                page: page,
                itemsPerPage: itemsPerPage,
                sortBy: sortBy,
            })
        );

        totalItems.value = total;
        items.value = result;
    } catch (error) {
        console.error("Failed to fetch attendance.", error);
    } finally {
        loading.value = false;
    }
}

function exportFile() {
    loading.value = true;

    const file = exportCsv({
        fileTitle: "AttendanceLog",
        items: items.value,
        headers: headers.value.filter((h) => h.key !== "status"),
    });

    setTimeout(() => (loading.value = false), 1000);
    return file;
}
</script>
