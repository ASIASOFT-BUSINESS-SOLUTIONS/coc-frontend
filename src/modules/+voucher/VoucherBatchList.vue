<template>
    <div class="pa-8">
        <v-row class="align-center mb-4">
            <v-col cols="12" sm="8">
                <h4 class="text-h4 font-weight-bold text-left pt-1">Voucher Batch List</h4>
                <div class="text-grey-darken-1 text-left pt-1">Batch generate existing voucher to guest</div>
            </v-col>

            <v-col cols="12" sm="4" class="text-sm-right text-left mt-2 mt-sm-0">
                <v-btn flat rounded="lg" color="#ffd700" :to="{ path: `/voucher-batch-list/batch-generate` }">
                    Batch Generate
                </v-btn>
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
            <template #item.startDate="{ item }"> {{ convertDatetime(item.startDate) }} </template>
            <template #item.endDate="{ item }"> {{ convertDatetime(item.endDate) }} </template>
            <template #item.voucherTypeDesc="{ item }"> {{ formatEmpty(item.voucherTypeDesc) }} </template>
            <template #item.action="{ item }">
                <v-tooltip text="View" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            key="view"
                            color="blue"
                            :to="{ path: `voucher-batch-list/${item.batchKey}/detail` }"
                            size="x-small"
                            variant="text"
                            icon
                        >
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Edit" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            key="edit"
                            color="warning"
                            :to="{ path: `voucher-batch-list/${item.batchKey}/edit` }"
                            size="x-small"
                            variant="text"
                            icon
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Delete" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            key="delete"
                            color="red"
                            @click="deleteItem(item)"
                            size="x-small"
                            variant="text"
                            icon
                        >
                            <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
            </template>
        </v-data-table-server>

        <v-dialog v-model="modal" width="400">
            <v-card rounded="xl">
                <v-card-title class="d-flex justify-space-between align-center" style="background-color: #f44336">
                    <span class="text-h5 font-weight-bold pl-2" style="color: #ffffff">Delete</span>
                    <v-btn icon variant="text" @click="modal = false" style="color: #ffffff">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="text-center mt-4">
                    <div class="font-weight-medium">Are you sure you want to delete?</div>
                    <v-row class="mt-6" dense>
                        <v-col>
                            <v-btn
                                flat
                                block
                                rounded="lg"
                                color="#f44336"
                                size="large"
                                @click="confirmDelete(selectedItem.batchKey)"
                                >Yes</v-btn
                            >
                        </v-col>
                        <v-col>
                            <v-btn
                                flat
                                block
                                rounded="lg"
                                style="border: 2px solid #f44336"
                                size="large"
                                @click="modal = false"
                                >Cancel</v-btn
                            >
                        </v-col>
                    </v-row>
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

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Snackbar from "../../components/Snackbar.vue";
import { deleteVoucher, getVouchers } from "../../api/voucher";
import { convertDatetime, formatDate, formatEmpty } from "../../utils/formatter";
import { loadDatatable } from "../../utils/loader";

const route = useRoute();
const router = useRouter();

const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);
const snackbar = ref(false);

onMounted(() => {
    if (route.query.created === "true") {
        successTitle.value = "Voucher batch generated successfully!";
        isSuccess.value = true;
        snackbar.value = true;
        router.replace({ query: {} });
    }

    if (route.query.deleted === "true") {
        successTitle.value = "The voucher batch deleted successfully!";
        isSuccess.value = true;
        snackbar.value = true;
        router.replace({ query: {} });
    }
});

// The Datatable
const headers = ref([
    { title: "Voucher Type", key: "voucherTypeCode", align: "start", minWidth: 150 },
    { title: "Voucher Description", key: "voucherTypeDesc", sortable: false, minWidth: 250 },
    { title: "Start Date", key: "startDate", minWidth: 150 },
    { title: "End Date", key: "endDate", minWidth: 150 },
    { title: "Action", key: "action", sortable: false, minWidth: 130, fixed: "end" },
]);

const loading = ref(true);
const search = ref("");
const items = ref([]); // Vouchers Data
const totalItems = ref(0); // Total Vouchers Count (For Pagination)

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
            fetchFn: getVouchers,
            searchTerm: search.value,
            page: page,
            itemsPerPage: itemsPerPage,
            sortBy: sortBy,
        });

        totalItems.value = total;
        items.value = result;
    } catch (error) {
        console.error("Failed to fetch vouchers.", error);
    } finally {
        loading.value = false;
    }
}

const modal = ref(false);
const selectedItem = ref(null);

function deleteItem(item) {
    selectedItem.value = item;
    modal.value = true;
}

async function confirmDelete(id) {
    loading.value = true;
    try {
        const response = await deleteVoucher(id);
        if (response.success) {
            isSuccess.value = true;
            successTitle.value = "All the assigned guests are successfully removed!";
        } else {
            isSuccess.value = false;
            errorTitle.value = `Status ${response.status}: Failed to remove the assigned guests`;
        }
        modal.value = false;
        snackbar.value = true;
    } catch (error) {
        console.error("Failed to delete voucher", error);
    } finally {
        loading.value = false;
        reload();
    }
}
</script>
