<template>
    <div class="pa-8">
        <v-row class="align-center mb-4">
            <v-col cols="12" sm="8">
                <h4 class="text-h4 font-weight-bold text-left pt-1">Enquiry Log</h4>
                <div class="text-grey-darken-1 text-left pt-1">
                    View and manage enquiry log recorded by product representatives
                </div>
            </v-col>
            <v-col cols="12" sm="4" class="text-sm-right text-left mt-md-0">
                <v-btn flat class="mr-2 hover-lift" rounded="lg" style="border: 2px solid #ffd700" @click="exportFile()"
                    >Export List</v-btn
                >
                <v-btn
                    flat
                    rounded="lg"
                    class="ml-1 hover-lift"
                    color="#ffd700"
                    @click="
                        selectedItem = null;
                        createDialog = true;
                        isEdit = false;
                    "
                    >New</v-btn
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
            <template #item.remark="{ item }">
                <v-chip
                    variant="flat"
                    color="info"
                    size="small"
                    v-for="(remark, index) in parsedRemarks(item.remark)"
                    :key="index"
                    class="remark mr-1 font-weight-bold"
                >
                    {{ remark }}
                </v-chip>
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
                <v-tooltip text="Edit" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            key="edit"
                            color="warning"
                            @click="editItem(item)"
                            size="x-small"
                            variant="text"
                            icon
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
            </template>
        </v-data-table-server>

        <EnquiryForm
            v-model="createDialog"
            :formData="selectedItem"
            :isEdit="isEdit"
            @submit="handleSubmit"
        ></EnquiryForm>
        <EnquiryDetail v-model="modal" :detailData="selectedItem"></EnquiryDetail>
    </div>
</template>
<script setup>
import { ref } from "vue";
import EnquiryForm from "./EnquiryForm.vue";
import { exportCsv, loadDatatable, withMinLoading } from "../../utils/loader";
import { convertDatetime } from "../../utils/formatter";
import EnquiryDetail from "./EnquiryDetail.vue";
import { createGuestEnquiry, editGuestEnquiry, getGuestEnquiries } from "../../api/enquiry";
import { useSnackbarStore } from "../../stores/snackbarStore";
import { useLoader } from "../../stores/loaderStore";

const createDialog = ref(false);

// The Datatable
const headers = ref([
    { title: "Guest Name", key: "guestName", minWidth: 200 },
    { title: "Company Name", key: "companyName", minWidth: 200 },
    { title: "Email Address", key: "emailAddress", minWidth: 180 },
    { title: "Mobile No.", key: "mobileNo", minWidth: 130 },
    { title: "Remark", key: "remark", minWidth: 200, nowrap: true },
    { title: "Created Date", key: "createdAt", minWidth: 150 },
    { title: "Creator", key: "createdBy", minWidth: 100 },
    { title: "Action", key: "action", minWidth: 100, sortable: false, fixed: "end" },
]);

let isEdit = true;
const modal = ref(false);
const selectedItem = ref(null);

function viewItem(item) {
    selectedItem.value = item;
    modal.value = true;
}

function editItem(item) {
    selectedItem.value = item;
    createDialog.value = true;
    isEdit = true;
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
                fetchFn: getGuestEnquiries,
                searchTerm: search.value,
                page: page,
                itemsPerPage: itemsPerPage,
                sortBy: sortBy,
            })
        );

        totalItems.value = total;
        items.value = result;
    } catch (error) {
        console.error("Failed to fetch enquiry log.", error);
    } finally {
        loading.value = false;
    }
}

const snackbar = useSnackbarStore();

const handleSubmit = async (formData) => {
    loading.value = true;
    try {
        let response;

        if (!isEdit)
            response = await withMinLoading(
                createGuestEnquiry({ guestCode: formData.guestCode, remark: formData.remark })
            );
        else
            response = await withMinLoading(
                editGuestEnquiry({ followUpKey: selectedItem.value.followUpKey, remark: formData.remark })
            );

        if (response.success) {
            snackbar.openSnackbar({
                text: `Enquiry from ${!isEdit ? response.data.guestName : selectedItem.value.guestName} successfully ${
                    !isEdit ? "submitted" : "updated"
                }!`,
                success: true,
            });
            reload();
        } else snackbar.openSnackbar({ text: `Status ${response.status}: ${response.message}`, success: false });
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

function exportFile() {
    loading.value = true;

    const file = exportCsv({
        fileTitle: "EnquiryLog",
        items: items.value,
        headers: headers.value,
    });

    setTimeout(() => (loading.value = false), 1000);
    return file;
}

const parsedRemarks = (remarkString) => {
    if (!remarkString) return [];

    return remarkString.split(",").map((r) => {
        r = r.trim();
        // If "Others:" exists, only keep the label before colon
        if (r.startsWith("Others:")) return "Others";
        return r;
    });
};
</script>
