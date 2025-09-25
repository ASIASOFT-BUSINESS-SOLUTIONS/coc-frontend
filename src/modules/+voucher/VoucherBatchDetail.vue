<template>
    <v-container v-if="loading" class="d-flex flex-column justify-center align-center pa-4 fill-height">
        <div class="d-flex justify-center" style="width: 100px">
            <v-img :src="logo" alt="Logo"></v-img>
        </div>
        <span class="text-body-1 text-uppercase font-weight-medium text-center pb-5 pt-3">Loading</span>
        <v-progress-linear color="amber" height="6" indeterminate rounded></v-progress-linear>
    </v-container>

    <NotFound v-else-if="notFound" />

    <div v-else class="pa-8">
        <v-row class="align-center">
            <v-col cols="12" sm="5">
                <v-breadcrumbs
                    :items="breadcrumbs"
                    class="text-left pa-0 font-weight-medium breadcrumbs-block no-padding breadcrumbs-hover"
                >
                    <template v-slot:divider>
                        <v-icon icon="mdi-chevron-right" />
                    </template>
                </v-breadcrumbs>
                <h4 class="text-h4 font-weight-bold text-left pt-1">{{ isEdit ? "Edit Voucher" : "View Detail" }}</h4>
                <div class="text-grey-darken-1 text-left pt-1">
                    {{ isEdit ? "Batch generate existing voucher to guest" : "View detail of batch generate voucher" }}
                </div>
            </v-col>

            <v-col cols="12" sm="7" class="text-sm-right text-left mt-2 mt-md-0">
                <template v-if="!isEdit">
                    <v-btn
                        flat
                        rounded="lg"
                        color="#ffd700"
                        :to="{ path: `/voucher-batch-list/${id}/edit` }"
                        class="ml-1"
                    >
                        Edit
                    </v-btn>
                </template>
                <template v-else>
                    <v-btn flat rounded="lg" @click="cancelModal = true" :style="{ border: `2px solid red` }">
                        Discard Changes
                    </v-btn>
                    <ConfirmDialog
                        v-model="cancelModal"
                        title="Discard Changes"
                        message="Are you sure you want to reset the form?"
                        :onYes="resetForm"
                        color="#f44336"
                    />

                    <v-dialog v-model="submitModal" width="500">
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-btn flat color="#ffd700" rounded="lg" class="ml-2" v-bind="activatorProps">
                                Save Changes
                            </v-btn>
                        </template>

                        <v-card rounded="xl">
                            <v-card-title
                                class="d-flex justify-space-between align-center"
                                style="background-color: #ffd700"
                            >
                                <span class="text-h6 font-weight-bold pl-2">Confirm</span>
                                <v-btn icon variant="text" @click="submitModal = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-card-title>
                            <v-card-text class="text-center mt-4">
                                <div class="font-weight-medium">Are you sure you want to submit?</div>
                                <v-row class="mt-6" dense>
                                    <v-col>
                                        <v-btn
                                            flat
                                            block
                                            rounded="lg"
                                            color="#FFD700"
                                            size="large"
                                            :loading="loading"
                                            @click="submitForm"
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
                                            @click="submitModal = false"
                                            >No</v-btn
                                        >
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </template>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="7">
                <v-card flat rounded="xl" class="pb-2" style="border: 2px solid #e0e0e0">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span class="font-weight-bold">Voucher Detail</span>
                    </v-card-title>
                    <v-divider thickness="2"></v-divider>
                    <v-card-text class="text-left">
                        <v-row>
                            <v-col>
                                <v-card flat rounded="lg" class="pa-2 ma-auto">
                                    <template v-if="detail?.colourSchema !== null">
                                        <v-img
                                            rounded="lg"
                                            class="voucher-card"
                                            min-height="150"
                                            :gradient="`to right, ${detail?.colourSchema}`"
                                        >
                                            <v-container min-height="150" style="height: 100%">
                                                <v-row dense align="center" style="height: 100%">
                                                    <v-col cols="5">
                                                        <v-img :src="detail?.image"></v-img>
                                                    </v-col>
                                                    <v-col cols="7" class="text-left">
                                                        <v-row dense justify="stretch">
                                                            <v-col cols="12">
                                                                <div
                                                                    class="text-white font-weight-bold text-sm-h2 text-md-h4"
                                                                    :class="smAndDown ? 'text-h4' : 'text-h5'"
                                                                >
                                                                    {{ formatEmpty(detail?.voucherTypeCode) }}
                                                                </div>
                                                            </v-col>
                                                        </v-row>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-img>
                                        <div class="status-badge__wrapper active">
                                            <div class="pl-3 pr-3 pt-1 pb-1 font-weight-bold status-badge active">
                                                Active
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <v-sheet
                                            min-height="150"
                                            rounded="lg"
                                            color="#D9D9D9"
                                            class="pt-3 voucher-card text-center"
                                        >
                                            <v-container>
                                                <v-row dense>
                                                    <v-col>
                                                        <v-icon color="#9E9E9E" size="60"> mdi-note-remove </v-icon>
                                                    </v-col>
                                                </v-row>
                                                <v-row dense>
                                                    <v-col>
                                                        <span class="text-subtitle-2 text-disabled font-weight-medium"
                                                            >No Voucher Color Selected
                                                        </span>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-sheet>
                                    </template>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row class="pl-2 pr-2">
                            <v-col cols="12" sm="6" order="1" order-sm="1">
                                <div class="text-subtitle-1 text-medium-emphasis">Batch Key</div>
                                <div class="text-subtitle-2 font-weight-bold">{{ formatEmpty(detail?.batchKey) }}</div>
                            </v-col>
                            <v-col cols="12" sm="6" order="2" order-sm="2">
                                <div class="text-subtitle-1 text-medium-emphasis">Start Date</div>
                                <div class="text-subtitle-2 font-weight-bold">{{ formatDate(detail?.startDate) }}</div>
                            </v-col>
                        </v-row>
                        <v-row class="pl-2 pr-2">
                            <v-col cols="12" sm="6" order="2" order-sm="1">
                                <div class="text-subtitle-1 text-medium-emphasis">Voucher Type</div>
                                <div class="text-subtitle-2 font-weight-bold">
                                    {{ formatEmpty(detail?.voucherTypeCode) }}
                                </div>
                            </v-col>
                            <v-col cols="12" sm="6" order="1" order-sm="2">
                                <div class="text-subtitle-1 text-medium-emphasis">End Date</div>
                                <div class="text-subtitle-2 font-weight-bold">{{ formatDate(detail?.endDate) }}</div>
                            </v-col>
                        </v-row>
                        <v-row class="pl-2 pr-2">
                            <v-col cols="12">
                                <div class="text-subtitle-1 text-medium-emphasis">Description</div>
                                <div class="text-body-2">{{ formatEmpty(detail?.voucherTypeDesc) }}</div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="5">
                <v-card flat rounded="xl" class="ma-auto" style="border: 2px solid #e0e0e0">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span class="font-weight-bold">Guest Assigned</span>
                    </v-card-title>
                    <v-divider thickness="2"></v-divider>
                    <v-card-text class="text-left">
                        <template v-if="isEdit">
                            <v-text-field
                                v-model="search"
                                placeholder="Search guest"
                                rounded="lg"
                                hide-details
                                prepend-inner-icon="mdi-magnify"
                                variant="outlined"
                                density="compact"
                                bg-color="#F9F9F9"
                                clearable
                                @keyup.enter=""
                            />
                            <v-checkbox
                                v-if="filteredGuests.length"
                                color="info"
                                :label="`Select All (${filteredGuests.length} Guests)`"
                                hide-details
                                v-model="selectAll"
                                class="font-weight-medium"
                            ></v-checkbox>
                            <v-virtual-scroll
                                v-if="filteredGuests.length"
                                :items="filteredGuests"
                                min-height="50"
                                class="ps-3"
                            >
                                <template v-slot:default="{ item }">
                                    <v-checkbox
                                        v-model="form.guestList"
                                        :value="item.emailAddress"
                                        color="info"
                                        :label="`${item.guestName} (${item.emailAddress})`"
                                        hide-details
                                    ></v-checkbox>
                                </template>
                            </v-virtual-scroll>
                        </template>
                        <template v-else>
                            <v-table
                                fixed-header
                                density="compact"
                                class="rounded-lg border-thin text-left"
                                striped="odd"
                            >
                                <thead>
                                    <tr class="text-left">
                                        <th>Guest Name</th>
                                        <th>Voucher No.</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in detail?.details" :key="item.voucherKey">
                                        <td>{{ item.guestName }}</td>
                                        <td>{{ item.voucherNo }}</td>
                                        <td>
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
                        </template>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-btn class="ma-auto mt-6" rounded="lg" prepend-icon="mdi-arrow-left" @click="router.back()" flat>Back</v-btn>

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
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { editVoucher, getVoucher } from "../../api/voucher";
import { formatDate, formatEmpty, statusColor } from "../../utils/formatter";
import NotFound from "../../views/NotFound.vue";
import logo from "../../assets/logo.svg";
import { getGuests } from "../../api/guest";
import ConfirmDialog from "../../components/ConfirmDialog.vue";
import Snackbar from "../../components/Snackbar.vue";
import { useDisplay } from "vuetify";

const detail = ref(null);
const route = useRoute();
const router = useRouter();
const { smAndDown } = useDisplay();
const id = route.params.id;
const isEdit = computed(() => route.path.endsWith("/edit"));

const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);
const snackbar = ref(false);

// Breadcrumbs
const breadcrumbs = [
    { title: "Voucher Batch List", disabled: false, to: "/voucher-batch-list" },
    { title: "View Detail", disabled: false },
];

const loading = ref(true);
const notFound = ref(false);

const allGuests = ref([]);
const form = ref({
    guestList: [],
});

const submitModal = ref(false);
const cancelModal = ref(false);
let originalData = null;

function resetForm() {
    form.value.guestList = originalData;
    cancelModal.value = false;
}

onMounted(async () => {
    try {
        const response = await getVoucher(id);
        if (response) {
            detail.value = response.data;
            console.log(detail.value);
        } else notFound.value = true;

        if (isEdit) {
            const guests = await getGuests();
            if (guests) allGuests.value = guests.data;

            const merged = [
                ...allGuests.value,
                ...detail.value.details.filter((d) => !allGuests.value.some((g) => g.guestCode === d.guestCode)),
            ];

            allGuests.value = merged;
            form.value.guestList = detail.value.details.map((g) => g.emailAddress);
            originalData = detail.value.details.map((g) => g.emailAddress);
        }
    } catch (err) {
        console.error(err);
        notFound.value = true;
    } finally {
        loading.value = false;
    }
});

const search = ref("");
const filteredGuests = computed(() => {
    if (!search.value) return allGuests.value;
    return allGuests.value.filter((g) => g.guestName.toLowerCase().includes(search.value.toLowerCase()));
});

const selectAll = computed({
    get: () =>
        filteredGuests.value.length > 0 &&
        filteredGuests.value.every((g) => form.value.guestList.includes(g.emailAddress)),

    set: (val) => {
        if (val) {
            // Add only the filtered guests to the selection,
            // but keep previously-selected guests as well
            const filteredEmails = filteredGuests.value.map((g) => g.emailAddress);
            form.value.guestList = [...new Set([...form.value.guestList, ...filteredEmails])];
        } else {
            // Remove only the filtered guests from the selection
            const filteredEmails = filteredGuests.value.map((g) => g.emailAddress);
            form.value.guestList = form.value.guestList.filter((email) => !filteredEmails.includes(email));
        }
    },
});

function buildPayload() {
    // Map voucherKey by email for quick lookup
    const voucherMap = Object.fromEntries((detail.value?.details || []).map((d) => [d.emailAddress, d.voucherKey]));

    return allGuests.value.map((g) => ({
        emailAddress: g.emailAddress,
        voucherKey: voucherMap[g.emailAddress] || null,
        isDeleted: !form.value.guestList.includes(g.emailAddress) || false,
    }));
}

async function submitForm() {
    loading.value = true;
    try {
        const payload = {
            batchKey: id,
            details: buildPayload(),
        };

        const response = await editVoucher(payload);
        if (response.success) {
            isSuccess.value = true;
            successTitle.value = "Voucher updated successfully!";
            snackbar.value = true;
        } else {
            isSuccess.value = false;
            errorTitle.value = `Status ${response.status}: ${response.message}`;
            snackbar.value = true;
        }
        submitModal.value = false;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}
</script>
