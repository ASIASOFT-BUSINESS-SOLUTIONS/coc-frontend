<template>
    <div class="pa-8">
        <v-row class="align-center mb-4">
            <v-col cols="12" sm="8">
                <h4 class="text-h4 font-weight-bold text-left pt-1">Guest Management</h4>
                <div class="text-grey-darken-1 text-left pt-1">
                    View and manage registered users and their voucher redemptions
                </div>
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
            <template #item.companyName="{ item }"> {{ formatEmpty(item.companyName) }} </template>
            <template #item.createdAt="{ item }"> {{ convertDatetime(item.createdAt) }} </template>
            <template #item.isActive="{ item }">
                <v-switch
                    density="compact"
                    color="success"
                    @click.stop.prevent="openConfirm(item)"
                    inset
                    hide-details
                    :model-value="item.isActive"
                />
            </template>
            <template #item.foodSelection="{ item }">
                <v-chip
                    :color="foodSelectionColor(item.foodSelection)"
                    :prepend-icon="foodSelectionIcon(item.foodSelection)"
                    size="small"
                    variant="flat"
                    rounded="xl"
                    label
                    class="text-white font-weight-bold pl-4"
                >
                    {{ item.foodSelection }}
                </v-chip>
            </template>
            <template #item.action="{ item }">
                <v-tooltip text="View" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            key="view"
                            color="blue"
                            :to="{ path: `guest/${item.guestKey}/detail` }"
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
                            :to="{ path: `guest/${item.guestKey}/edit` }"
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
                                @click="confirmDelete(selectedItem.guestKey)"
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
        <v-dialog v-model="activationModal" width="400">
            <v-card rounded="xl">
                <v-card-title class="d-flex justify-space-between align-center" style="background-color: #ffd700">
                    <span class="text-h5 font-weight-bold pl-2">{{
                        selectedItem.isActive ? "Deactivate Guest" : "Activate Guest"
                    }}</span>
                    <v-btn icon variant="text" @click="activationModal = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="text-center mt-4">
                    <div class="font-weight-medium">
                        Are you sure you want to {{ selectedItem.isActive ? "deactivate" : "activate" }} this guest?
                    </div>
                    <v-row class="mt-6" dense>
                        <v-col>
                            <v-btn
                                flat
                                block
                                rounded="lg"
                                color="#FFD700"
                                size="large"
                                @click="activateOrDeactivate(selectedItem.guestKey)"
                                >Yes</v-btn
                            >
                        </v-col>
                        <v-col>
                            <v-btn
                                flat
                                block
                                rounded="lg"
                                style="border: 2px solid #ffd700"
                                size="large"
                                @click="activationModal = false"
                                >No</v-btn
                            >
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { deactivateOrActivateGuest, deleteGuest, getGuests } from "../../api/guest";
import { convertDatetime, formatEmpty, foodSelectionColor, foodSelectionIcon } from "../../utils/formatter";
import { loadDatatable, withMinLoading } from "../../utils/loader";
import { useLoader } from "../../stores/loaderStore";
import { useSnackbarStore } from "../../stores/snackbarStore";

// The Datatable
const headers = ref([
    { title: "Guest Name", key: "guestName", align: "start", minWidth: 200 },
    { title: "Company Name", key: "companyName", minWidth: 200 },
    { title: "Email", key: "emailAddress", sortable: false, minWidth: 200 },
    { title: "Mobile No.", key: "mobileNo", sortable: false, minWidth: 120 },
    { title: "Food Selection", key: "foodSelection", minWidth: 150 },
    { title: "Registration Date", key: "createdAt", minWidth: 180 },
    { title: "Status", key: "isActive", sortable: false },
    { title: "Action", key: "action", sortable: false, minWidth: 130, fixed: "end" },
]);

const { loading } = useLoader();
const search = ref("");
const items = ref([]); // Guests Data
const totalItems = ref(0); // Total Guests Count (For Pagination)

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
                fetchFn: getGuests,
                searchTerm: search.value,
                page: page,
                itemsPerPage: itemsPerPage,
                sortBy: sortBy,
            })
        );

        totalItems.value = total;
        items.value = result;
    } catch (error) {
        console.error("Failed to fetch guests.", error);
    } finally {
        loading.value = false;
    }
}

const modal = ref(false);
const selectedItem = ref(null);

const snackbar = useSnackbarStore();

function deleteItem(item) {
    selectedItem.value = item;
    modal.value = true;
}

async function confirmDelete(id) {
    loading.value = true;
    try {
        modal.value = false;
        const response = await withMinLoading(deleteGuest(id));
        if (response.success) snackbar.openSnackbar({ text: `The guest is successfully deleted!`, success: true });
        else snackbar.openSnackbar({ text: `Status ${response.status}: Failed to delete guest`, success: false });
    } catch (error) {
        console.error("Failed to delete guest.", error);
    } finally {
        reload();
    }
}

const activationModal = ref(false);

function openConfirm(item) {
    selectedItem.value = item;
    activationModal.value = true;
}

async function activateOrDeactivate(id) {
    loading.value = true;
    try {
        activationModal.value = false;
        const response = await withMinLoading(deactivateOrActivateGuest(id));
        if (response.success)
            setTimeout(
                () =>
                    snackbar.openSnackbar({
                        text: `The guest has been ${selectedItem.value.isActive ? "deactivated" : "activated"}!`,
                        success: true,
                    }),
                2200
            );
        else
            setTimeout(
                () =>
                    snackbar.openSnackbar({
                        text: `Status ${response.status}: Failed to ${
                            selectedItem.value.isActive ? "deactivate" : "activate"
                        } guest`,
                        success: false,
                    }),
                2200
            );
    } catch (error) {
        console.error("Failed to delete guest.", error);
    } finally {
        reload();
    }
}

const route = useRoute();
const router = useRouter();
onMounted(() => {
    if (route.query.deleted === "true") {
        successTitle.value = "The guest deleted successfully!";
        isSuccess.value = true;
        snackbar.value = true;
        router.replace({ query: {} });
    }
});
</script>
