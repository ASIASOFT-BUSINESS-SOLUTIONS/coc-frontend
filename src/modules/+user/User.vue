<template>
    <div class="pa-8">
        <v-row class="align-center mb-4">
            <v-col cols="12" sm="8">
                <h4 class="text-h4 font-weight-bold text-left pt-1">User Management</h4>
                <div class="text-grey-darken-1 text-left pt-1">View and manage registered users</div>
            </v-col>

            <v-col cols="12" sm="4" class="text-sm-right text-left mt-2 mt-md-0">
                <v-btn flat :to="{ path: 'user/create' }" rounded="lg" color="#FFD700" class="hover-lift">New</v-btn>
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
            <template #item.createdAt="{ item }"> {{ convertDatetime(item.createdAt) }} </template>
            <template #item.status="{ item }">
                <v-switch
                    density="compact"
                    color="success"
                    inset
                    readonly
                    hide-details
                    v-model="item.status"
                    :true-value="1"
                    :false-value="0"
                />
            </template>
            <template #item.action="{ item }">
                <v-tooltip text="View" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            key="view"
                            color="blue"
                            :to="{ path: `user/${item.userKey}/detail` }"
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
                            :to="{ path: `user/${item.userKey}/edit` }"
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
                                @click="confirmDelete(selectedItem.userKey)"
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
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { deleteUser, getUsers } from "../../api/user";
import { useRoute, useRouter } from "vue-router";
import { convertDatetime } from "../../utils/formatter";
import { loadDatatable, withMinLoading } from "../../utils/loader";
import { useLoader } from "../../stores/loaderStore";
import { useSnackbarStore } from "../../stores/snackbarStore";

// The Datatable
const headers = ref([
    { title: "User Name", key: "userName", minWidth: 200 },
    { title: "User Type", key: "userTypeDesc", sortable: false, minWidth: 200 },
    { title: "Created Date", key: "createdAt", minWidth: 150 },
    { title: "Action", key: "action", sortable: false, minWidth: 130, fixed: "end" },
]);

const snackbar = useSnackbarStore();
const { loading } = useLoader();
const search = ref("");
const items = ref([]); // Users Data
const totalItems = ref(0); // Total Users Count (For Pagination)

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
                fetchFn: getUsers,
                searchTerm: search.value,
                page: page,
                itemsPerPage: itemsPerPage,
                sortBy: sortBy,
            })
        );

        totalItems.value = total;
        items.value = result;
    } catch (error) {
        console.error("Failed to fetch users.", error);
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
        modal.value = false;
        const response = await withMinLoading(deleteUser(id));
        if (response.success) snackbar.openSnackbar({ text: `The user is successfully deleted!`, success: true });
        else snackbar.openSnackbar({ text: `Status ${response.status}: Failed to delete user`, success: false });
    } catch (error) {
        console.error("Failed to delete user", error);
    } finally {
        reload();
    }
}

const route = useRoute();
const router = useRouter();
onMounted(() => {
    if (route.query.created === "true") {
        snackbar.openSnackbar({ text: `New user created successfully!`, success: true });
        router.replace({ query: {} });
    }

    if (route.query.deleted === "true") {
        snackbar.openSnackbar({ text: `The user is deleted successfully!`, success: true });
        router.replace({ query: {} });
    }
});
</script>
