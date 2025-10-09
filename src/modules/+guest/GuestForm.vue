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
        <v-row class="align-center mb-4">
            <v-col>
                <v-breadcrumbs
                    :items="breadcrumbs"
                    class="text-left pa-0 font-weight-medium breadcrumbs-block no-padding breadcrumbs-hover"
                >
                    <template v-slot:divider>
                        <v-icon icon="mdi-chevron-right" />
                    </template>
                </v-breadcrumbs>
                <h4 class="text-h4 font-weight-bold text-left pt-1">Edit Guest</h4>
                <div class="text-grey-darken-1 text-left pt-1">Edit detail of guest</div>
            </v-col>
        </v-row>

        <v-card flat rounded="xl" class="pb-2 mb-8" style="border: 2px solid #e0e0e0">
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="font-weight-bold">Guest Detail</span>
            </v-card-title>
            <v-divider thickness="2"></v-divider>
            <v-card-text class="text-left">
                <v-form @submit.prevent="submitForm">
                    <v-row dense class="align-center">
                        <v-col cols="12" sm="6">
                            <div class="text-subtitle-1 text-medium-emphasis">Full Name</div>
                            <v-text-field
                                placeholder="Full Name"
                                v-model="form.guestName"
                                class="mb-2"
                                variant="outlined"
                                rounded="lg"
                                bg-color="#F9F9F9"
                                :rules="[rules.required]"
                                density="compact"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="text-subtitle-1 text-medium-emphasis">Company Name</div>
                            <v-text-field
                                placeholder="Company Name"
                                v-model="form.companyName"
                                class="mb-2"
                                variant="outlined"
                                rounded="lg"
                                bg-color="#F9F9F9"
                                density="compact"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="align-center">
                        <v-col cols="12" sm="6">
                            <div class="text-subtitle-1 text-medium-emphasis">Email Address</div>
                            <v-text-field
                                placeholder="Email Address"
                                v-model="form.emailAddress"
                                class="mb-2"
                                variant="outlined"
                                rounded="lg"
                                bg-color="#F9F9F9"
                                :rules="[rules.required, rules.email]"
                                density="compact"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="text-subtitle-1 text-medium-emphasis">Mobile No.</div>
                            <v-text-field
                                placeholder="Mobile No."
                                v-model="form.mobileNo"
                                class="mb-2"
                                variant="outlined"
                                rounded="lg"
                                bg-color="#F9F9F9"
                                :rules="[rules.required, rules.maxLength(20)]"
                                density="compact"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="text-subtitle-1 text-medium-emphasis">Food Selection</div>
                            <v-select
                                v-model="form.foodSelection"
                                density="compact"
                                class="mb-2"
                                variant="outlined"
                                rounded="lg"
                                bg-color="#F9F9F9"
                                placeholder="Food Selection"
                                :rules="[rules.required]"
                                :items="foodSelection"
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row class="mt-1" dense>
                        <v-col md="3">
                            <v-btn
                                block
                                flat
                                rounded="lg"
                                color="#FFD700"
                                size="large"
                                :loading="loading"
                                type="submit"
                                class="hover-lift custom-field"
                            >
                                Save Changes
                            </v-btn>
                        </v-col>
                        <v-col md="3">
                            <v-btn
                                class="text-none text-body-1 hover-lift"
                                flat
                                block
                                rounded="lg"
                                size="large"
                                color="red"
                                variant="outlined"
                                @click="cancelModal = true"
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
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>

        <v-row class="align-center mb-4">
            <v-col cols="8">
                <h4 class="text-h6 font-weight-bold text-left">Voucher Detail</h4>
            </v-col>
            <v-col cols="4" class="text-right">
                <v-btn flat class="hover-lift" rounded="lg" color="#ffd700" :to="{ name: `VoucherBatchGenerate` }"
                    >New</v-btn
                >
            </v-col>
        </v-row>
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
import { rules } from "../../constants/validation.constant";
import { editGuest, getGuest } from "../../api/guest";
import Snackbar from "../../components/Snackbar.vue";
import ConfirmDialog from "../../components/ConfirmDialog.vue";
import { foodSelection } from "../../constants/selection.constant";
import NotFound from "../../views/NotFound.vue";
import logo from "../../assets/logo.svg";
import { convertDatetime, formatDate, formatDatetime, statusColor } from "../../utils/formatter";

// Breadcrumbs
const breadcrumbs = [
    { title: "Guest Management", disabled: false, to: "/guest" },
    { title: "Edit Guest", disabled: false },
];

const route = useRoute();
const router = useRouter();

const cancelModal = ref(false);

let originalData = null;
const form = ref({
    guestName: null,
    companyName: null,
    mobileNo: null,
    emailAddress: null,
    foodSelection: null,
});

const isEdit = ref(false);
onMounted(async () => {
    if (route.params.id) {
        try {
            const response = await getGuest(route.params.id);
            if (response) {
                form.value = response.data;
                originalData = { ...response.data };
            } else notFound.value = true;
        } catch (err) {
            console.error(err);
            notFound.value = true;
        } finally {
            loading.value = false;
        }
        isEdit.value = true;
    }
});

const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);
const snackbar = ref(false);

async function submitForm() {
    loading.value = true;
    try {
        const payload = {
            guestKey: route.params.id,
            guestName: form.value.guestName,
            companyName: form.value.companyName,
            emailAddress: form.value.emailAddress,
            mobileNo: form.value.mobileNo,
            foodSelection: form.value.foodSelection,
            isActive: form.value.isActive,
        };

        const response = await editGuest(payload);
        if (response.success) {
            isSuccess.value = true;
            successTitle.value = "Guest detail updated successfully!";
            snackbar.value = true;

            const detail = originalData.details;
            originalData = { ...payload, details: detail };
        } else {
            isSuccess.value = false;
            errorTitle.value = `Status ${response.status}: ${response.message}`;
            snackbar.value = true;
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}

function resetForm() {
    form.value = { ...originalData };
    cancelModal.value = false;
}

/* Todo: Complete the datatable */
const loading = ref(true);
const notFound = ref(false);

const search = ref("");
const filteredDetails = computed(() => {
    const term = search.value.trim().toLowerCase();
    if (!term) return form.value.details; // nothing typed → show all

    return form.value.details.filter(
        (item) =>
            item.voucherNo?.toLowerCase().includes(term) ||
            item.voucherTypeCode?.toLowerCase().includes(term) ||
            item.status?.toLowerCase().includes(term)
    );
});
</script>
