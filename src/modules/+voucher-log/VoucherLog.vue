<template>
    <div class="pa-8">
        <v-row class="align-center mb-4">
            <v-col cols="12" sm="8">
                <h4 class="text-h4 font-weight-bold text-left pt-1">Voucher Log</h4>
                <div class="text-grey-darken-1 text-left pt-1">Create and manage existing vouchers</div>
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
            <template #item.guestCode="{ item }"> {{ formatEmpty(item.guestCode) }} </template>
            <template #item.emailAddress="{ item }"> {{ formatEmpty(item.emailAddress) }} </template>
            <template #item.createdAt="{ item }"> {{ convertDatetime(item.createdAt) }} </template>
            <template #item.action="{ item }">
                <v-chip :color="getChipColor(item.action)" class="pl-4 pr-3">
                    <v-icon :icon="getIcon(item.action)" :color="getChipColor(item.action)" size="small" start />
                    {{ item.action }}
                </v-chip>
            </template>
            <template #item.actions="{ item }">
                <v-tooltip text="View" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            key="view"
                            color="blue"
                            @click="viewItem(item)"
                            size="small"
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
                    <div class="text-center mb-12">
                        <v-icon
                            class="mb-5"
                            :color="getChipColor(selectedItem.action)"
                            :icon="getIcon(selectedItem.action)"
                            size="80"
                        ></v-icon>
                        <h3 class="text-h4 font-weight-bold mb-3">{{ formatEmpty(selectedItem.action) }}</h3>
                        <div class="mb-4 justify-center">{{ formatEmpty(selectedItem.voucherTypeCode) }}</div>
                        <!-- <v-chip color="#6A0DAD" size="large" label class="text-white font-weight-bold" variant="flat"
                            >Halal</v-chip
                        > -->
                    </div>
                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">Guest Name:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right">{{
                            formatEmpty(selectedItem.guestName)
                        }}</v-col>
                    </v-row>
                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">Email Address:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right">{{
                            formatEmpty(selectedItem.emailAddress)
                        }}</v-col>
                    </v-row>

                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">Reference No:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right">{{
                            formatEmpty(selectedItem.voucherNo)
                        }}</v-col>
                    </v-row>

                    <v-row dense class="mt-1">
                        <v-col cols="4" class="opacity-60">{{ selectedItem.action }} Datetime:</v-col>
                        <v-col cols="8" class="font-weight-medium text-right">{{
                            convertDatetime(selectedItem.createdAt)
                        }}</v-col>
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

<script setup>
import { ref } from "vue";
import { getVoucherLog } from "../../api/voucher";
import { formatEmpty, convertDatetime } from "../../utils/formatter";
import { loadDatatable } from "../../utils/loader";

const modal = ref(false);
const selectedItem = ref(null);
function viewItem(item) {
    selectedItem.value = item;
    modal.value = true;
}

const headers = ref([
    { title: "Voucher No.", key: "voucherNo", minWidth: 150 },
    { title: "Guest Name", key: "guestName", minWidth: 200 },
    { title: "Email Address", key: "emailAddress", minWidth: 150 },
    { title: "Created Date", key: "createdAt", minWidth: 150 },
    { title: "Type", key: "action", minWidth: 80 },
    { title: "Action", key: "actions", sortable: false, fixed: "end" },
]);

function getChipColor(action) {
    switch (action) {
        case "Redeem":
            return "green";
        case "Issue":
            return "orange";
        case "Expired":
            return "red";
        case "Void":
            return "purple";
        default:
            return "grey";
    }
}

function getIcon(action) {
    switch (action) {
        case "Redeem":
            return "mdi-check-circle";
        case "Issue":
            return "mdi-alert-circle";
        case "Expired":
            return "mdi-close-circle";
        case "Void":
            return "mdi-cancel-circle";
        default:
            return "grey";
    }
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
            fetchFn: getVoucherLog,
            searchTerm: search.value,
            page: page,
            itemsPerPage: itemsPerPage,
            sortBy: sortBy,
        });

        totalItems.value = total;
        items.value = result;
    } catch (error) {
        console.error("Failed to fetch voucher log.", error);
    } finally {
        loading.value = false;
    }
}
</script>
