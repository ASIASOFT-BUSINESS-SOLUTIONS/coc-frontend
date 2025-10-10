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
                        class="ml-1 hover-lift"
                    >
                        Edit
                    </v-btn>
                </template>
                <template v-else>
                    <v-btn
                        flat
                        rounded="lg"
                        class="mr-1 hover-lift"
                        @click="cancelModal = true"
                        style="border: 2px solid #f44336; color: red"
                    >
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
                            <v-btn
                                flat
                                color="#ffd700"
                                rounded="lg"
                                class="ml-2 hover-lift"
                                :disabled="!form.guestList.length"
                                v-bind="activatorProps"
                            >
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
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-card flat rounded="lg" class="pa-2 ma-auto">
                                    <v-img
                                        ref="voucherCardRef"
                                        class="voucher-card"
                                        rounded="lg"
                                        :aspect-ratio="30 / 9"
                                        v-bind="
                                            detail?.colourSchema
                                                ? { gradient: `to right, ${detail.colourSchema}` }
                                                : { color: '#D9D9D9' }
                                        "
                                    >
                                        <v-row dense align="center" class="pl-5 pr-5" style="height: 100%">
                                            <v-col cols="5">
                                                <template v-if="detail?.image">
                                                    <v-img :src="detail?.image"></v-img>
                                                </template>
                                                <template v-else>
                                                    <v-icon :size="iconSize" color="white"
                                                        >mdi-file-image-remove</v-icon
                                                    >
                                                </template>
                                            </v-col>
                                            <v-col cols="7" class="text-left">
                                                <v-row dense justify="stretch">
                                                    <v-col cols="12">
                                                        <div
                                                            class="text-white font-weight-bold text-truncate"
                                                            :style="{ fontSize }"
                                                        >
                                                            {{ formatEmpty(detail?.voucherTypeCode) }}
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-img>

                                    <div class="status-badge__wrapper active" v-if="detail">
                                        <div class="pl-3 pr-3 pt-1 pb-1 font-weight-bold status-badge active">
                                            Active
                                        </div>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row class="pl-2 pr-2 text-left">
                            <v-col cols="12" sm="6" order="1" order-sm="1">
                                <div class="text-subtitle-1 text-medium-emphasis">Batch Key</div>
                                <div class="text-subtitle-2 font-weight-bold">{{ formatEmpty(detail?.batchKey) }}</div>
                            </v-col>
                            <v-col cols="12" sm="6" order="2" order-sm="2">
                                <div class="text-subtitle-1 text-medium-emphasis">Start Date</div>
                                <div class="text-subtitle-2 font-weight-bold">
                                    {{ formatDatetime(detail?.startDate) }}
                                </div>
                            </v-col>
                        </v-row>
                        <v-row class="pl-2 pr-2 text-left">
                            <v-col cols="12" sm="6" order="2" order-sm="1">
                                <div class="text-subtitle-1 text-medium-emphasis">Voucher Type</div>
                                <div class="text-subtitle-2 font-weight-bold">
                                    {{ formatEmpty(detail?.voucherTypeCode) }}
                                </div>
                            </v-col>
                            <v-col cols="12" sm="6" order="1" order-sm="2">
                                <div class="text-subtitle-1 text-medium-emphasis">End Date</div>
                                <div class="text-subtitle-2 font-weight-bold">
                                    {{ formatDatetime(detail?.endDate) }}
                                </div>
                            </v-col>
                        </v-row>
                        <v-row class="pl-2 pr-2 text-left">
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
                                color="info"
                                prepend-inner-icon="mdi-magnify"
                                variant="outlined"
                                density="compact"
                                bg-color="#F9F9F9"
                                clearable
                                @keyup.enter=""
                            />
                            <div class="text-body-1 mt-4">Filter by food selection</div>
                            <v-chip-group v-model="filterByFoodSelection" multiple>
                                <v-chip text="Normal" value="Normal" color="info" filter></v-chip>
                                <v-chip text="Vegetarian" value="Vegetarian" color="success" filter></v-chip>
                                <v-chip text="Halal" value="Halal" color="purple" filter></v-chip>
                            </v-chip-group>
                            <v-divider class="mb-4 mt-2"></v-divider>
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
        <v-btn class="ma-auto mt-6 hover-lift" rounded="lg" prepend-icon="mdi-arrow-left" @click="router.back()" flat
            >Back</v-btn
        >

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
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { editVoucher, getVoucher } from "../../api/voucher";
import { formatDatetime, formatEmpty, statusColor } from "../../utils/formatter";
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
const breadcrumbs = computed(() => {
    const base = [{ title: "Voucher Batch List", to: "/voucher-batch-list", disabled: false }];

    if (isEdit.value) {
        base.push({ title: "Edit Voucher", disabled: false });
    } else {
        base.push({ title: "View Detail", disabled: false });
    }

    return base;
});

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

const voucherCardRef = ref(null);
const fontSize = ref("1.5rem");
const iconSize = ref(60);

onMounted(async () => {
    try {
        const response = await getVoucher(id);
        if (response) {
            detail.value = response.data;
        } else notFound.value = true;

        if (isEdit) {
            const guests = await getGuests();
            if (guests) allGuests.value = guests.data;

            const merged = [
                ...allGuests.value,
                ...detail.value.details
                    .filter((item) => item.guestCode)
                    .filter((d) => !allGuests.value.some((g) => g.guestCode === d.guestCode)),
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

    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            const ratio = width / height;

            // Adjust font size
            if (ratio < 1.2) fontSize.value = "1rem";
            else if (ratio < 2) fontSize.value = "1.5rem";
            else fontSize.value = "2rem";

            // Adjust icon size (you can tweak scaling)
            iconSize.value = Math.min(100, Math.max(50, height * 0.6));
            // means: 60% of card height, capped between 50–100px
        }
    });

    if (voucherCardRef.value?.$el) observer.observe(voucherCardRef.value.$el);

    onBeforeUnmount(() => observer.disconnect());
});

const search = ref("");

const filterByFoodSelection = ref([]);
const filteredGuests = computed(() => {
    return allGuests.value.filter((g) => {
        const matchesSearch = !search.value || g.name.toLowerCase().includes(search.value.toLowerCase());

        const matchesFoodSelection =
            !filterByFoodSelection.value.length ||
            filterByFoodSelection.value.some((selection) => g.foodSelection === selection);

        return matchesSearch && matchesFoodSelection;
    });
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
            const resetData = await getVoucher(id);
            originalData = resetData.data.details.map((g) => g.emailAddress);
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
