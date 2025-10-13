<template>
    <NotFound v-if="notFound" />

    <div v-else class="pa-8">
        <v-row class="align-center mb-4">
            <v-col cols="12" sm="8">
                <v-breadcrumbs
                    :items="breadcrumbs"
                    class="text-left pa-0 font-weight-medium breadcrumbs-block no-padding breadcrumbs-hover"
                >
                    <template v-slot:divider>
                        <v-icon icon="mdi-chevron-right" />
                    </template>
                </v-breadcrumbs>
                <h4 class="text-h4 font-weight-bold text-left pt-1">View Detail</h4>
                <div class="text-grey-darken-1 text-left pt-1">View detail of guest</div>
            </v-col>
            <v-col cols="12" sm="4" class="text-sm-right text-left mt-2 mt-md-0">
                <v-dialog v-model="modal" width="400">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn
                            flat
                            class="mr-2 hover-lift"
                            rounded="lg"
                            style="border: 2px solid #f44336; color: red"
                            v-bind="activatorProps"
                            >Delete</v-btn
                        >
                    </template>
                    <v-card rounded="xl">
                        <v-card-title
                            class="d-flex justify-space-between align-center"
                            style="background-color: #f44336"
                        >
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
                                        @click="confirmDeleteGuest(route.params.id)"
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
                <v-btn
                    flat
                    rounded="lg"
                    color="#ffd700"
                    :to="{ path: `/guest/${route.params.id}/edit` }"
                    class="ml-1 hover-lift"
                    >Edit</v-btn
                >
            </v-col>
        </v-row>

        <v-card flat rounded="xl" class="pb-2 mb-8" v-if="detail" style="border: 2px solid #e0e0e0">
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="font-weight-bold">Guest Detail</span>
            </v-card-title>
            <v-divider thickness="2"></v-divider>
            <v-card-text class="text-left">
                <v-row>
                    <v-col cols="12" sm="6">
                        <div class="text-subtitle-1 text-medium-emphasis">Guest Code</div>
                        <div class="text-subtitle-2 font-weight-bold">{{ formatEmpty(detail?.guestCode) }}</div>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <div class="text-subtitle-1 text-medium-emphasis">Mobile No.</div>
                        <div class="text-subtitle-2 font-weight-bold">{{ formatEmpty(detail?.mobileNo) }}</div>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <div class="text-subtitle-1 text-medium-emphasis">Full Name</div>
                        <div class="text-subtitle-2 font-weight-bold">{{ formatEmpty(detail?.guestName) }}</div>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <div class="text-subtitle-1 text-medium-emphasis">Food Selection</div>
                        <div class="text-subtitle-2 font-weight-bold">
                            <v-chip
                                :color="foodSelectionColor(detail?.foodSelection)"
                                :prepend-icon="foodSelectionIcon(detail?.foodSelection)"
                                size="small"
                                variant="flat"
                                label
                                rounded="xl"
                                class="text-white font-weight-bold pl-3"
                            >
                                {{ detail?.foodSelection }}
                            </v-chip>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <div class="text-subtitle-1 text-medium-emphasis">Company Name</div>
                        <div class="text-subtitle-2 font-weight-bold">{{ formatEmpty(detail?.companyName) }}</div>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <div class="text-subtitle-1 text-medium-emphasis">Registration Date</div>
                        <div class="text-subtitle-2 font-weight-bold">{{ formatDatetime(detail?.createdAt) }}</div>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <div class="text-subtitle-1 text-medium-emphasis">Email</div>
                        <div class="text-subtitle-2 font-weight-bold">{{ formatEmpty(detail?.emailAddress) }}</div>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <div class="text-subtitle-1 text-medium-emphasis">Status</div>
                        <div class="text-subtitle-2 font-weight-bold">
                            <v-chip
                                :color="detail?.isActive ? 'green' : 'red'"
                                size="small"
                                label
                                class="text-white font-weight-bold"
                            >
                                {{ detail?.isActive ? "Active" : "Inactive" }}
                            </v-chip>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <h4 class="text-h6 font-weight-bold text-left mb-4">Voucher Detail</h4>
        <v-text-field
            v-model="search"
            placeholder="Search Voucher"
            rounded="lg"
            prepend-inner-icon="mdi-magnify"
            flat
            variant="solo"
            density="compact"
            bg-color="#ffffff"
            hide-details
            class="mb-4"
            style="border: 1px solid #e0e0e0; border-radius: 10px"
            clearable
        />
        <v-table fixed-header density="compact" class="rounded-lg border-thin text-left" striped="odd">
            <thead>
                <tr class="text-left">
                    <th>Voucher No.</th>
                    <th>Voucher Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Issued Datetime</th>
                    <th>Redeemed Datetime</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in filteredDetails" :key="item.voucherKey">
                    <td style="width: 120px">{{ item.voucherNo }}</td>
                    <td style="width: 120px">{{ item.voucherTypeCode }}</td>
                    <td style="width: 120px">{{ formatDate(item.startDate) }}</td>
                    <td style="width: 120px">{{ formatDate(item.endDate) }}</td>
                    <td style="width: 250px">{{ formatDatetime(item.issueAt) }}</td>
                    <td style="width: 250px">{{ formatDatetime(item.redeemAt) }}</td>
                    <td style="width: 80px">
                        <v-chip
                            variant="flat"
                            :color="statusColor(item.status)"
                            size="small"
                            label
                            class="text-white font-weight-bold"
                        >
                            {{ item.status }}
                        </v-chip>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-btn class="ma-auto mt-6" rounded="lg" prepend-icon="mdi-arrow-left" @click="router.back()" flat>Back</v-btn>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { deleteGuest, getGuest } from "../../api/guest";
import {
    formatDate,
    formatDatetime,
    formatEmpty,
    statusColor,
    foodSelectionColor,
    foodSelectionIcon,
} from "../../utils/formatter";
import NotFound from "../../views/NotFound.vue";
import { useLoader } from "../../stores/loaderStore";
import { withMinLoading } from "../../utils/loader";
import { useSnackbarStore } from "../../stores/snackbarStore";

// Breadcrumbs
const breadcrumbs = [
    { title: "Guest Management", disabled: false, to: "/guest" },
    { title: "View Detail", disabled: false },
];

const detail = ref(null);
const route = useRoute();
const router = useRouter();
const id = route.params.id;

const { loading } = useLoader();
const notFound = ref(false);

onMounted(async () => {
    try {
        const result = await getGuest(id);
        if (result) detail.value = result.data;
        else notFound.value = true;
    } catch (err) {
        console.error(err);
        notFound.value = true;
    }
});

const modal = ref(false);
const snackbar = useSnackbarStore();

async function confirmDeleteGuest(id) {
    loading.value = true;
    try {
        modal.value = false;
        const response = await withMinLoading(deleteGuest(id));
        if (response.success) {
            router.push({ path: "/guest", query: { deleted: "true" } });
        } else snackbar.openSnackbar({ text: `Status ${response.status}: Failed to delete guest`, success: false });
    } catch (error) {
        console.error("Failed to delete guest", error);
    } finally {
        loading.value = false;
    }
}

const search = ref("");
const filteredDetails = computed(() => {
    const term = search.value.trim().toLowerCase();
    if (!term) return detail.value?.details; // nothing typed → show all

    return detail.value?.details.filter(
        (item) =>
            item.voucherNo?.toLowerCase().includes(term) ||
            item.voucherTypeCode?.toLowerCase().includes(term) ||
            item.status?.toLowerCase().includes(term)
    );
});
</script>
