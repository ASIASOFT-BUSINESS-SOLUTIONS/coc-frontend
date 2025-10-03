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
                <div class="text-grey-darken-1 text-left pt-1">View detail of voucher</div>
            </v-col>
            <v-col cols="12" sm="4" class="text-sm-right text-left mt-2 mt-md-0">
                <v-dialog v-model="modal" width="400">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn flat rounded="lg" style="border: 2px solid #f44336; color: red" v-bind="activatorProps"
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
                                        @click="confirmDelete(route.params.id)"
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
                <v-btn flat rounded="lg" color="#ffd700" :to="{ path: `/voucher-type/${id}/edit` }" class="ml-1"
                    >Edit</v-btn
                >
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="8">
                <v-card flat rounded="xl" class="ma-auto" style="border: 2px solid #e0e0e0">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span class="font-weight-bold">Voucher Detail</span>
                    </v-card-title>
                    <v-divider thickness="2"></v-divider>
                    <v-card-text class="text-left mb-3">
                        <v-row>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-1 text-medium-emphasis">Voucher ID</div>
                                <div class="text-subtitle-2 font-weight-bold">{{ id }}</div>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-1 text-medium-emphasis">Start Date</div>
                                <div class="text-subtitle-2 font-weight-bold">
                                    {{ formatDatetime(detail?.startDate) }}
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
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
                        <v-row>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-1 text-medium-emphasis">Voucher Color</div>
                                <template v-if="detail?.colourSchema !== null">
                                    <v-img
                                        rounded="lg"
                                        height="30"
                                        :gradient="`to right, ${detail?.colourSchema}`"
                                    ></v-img>
                                </template>
                                <template v-else>-</template>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-1 text-medium-emphasis">Food Selection</div>
                                <div class="text-body-2">{{ detail?.forFoodSelection == true ? "Yes" : "No" }}</div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-1 text-medium-emphasis">Created Datetime</div>
                                <div class="text-subtitle-2 font-weight-bold">
                                    {{ convertDatetime(detail?.createdAt) }}
                                </div>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="text-subtitle-1 text-medium-emphasis">Voucher Assignment</div>
                                <div class="text-subtitle-2 font-weight-bold">
                                    {{
                                        detail?.forNewUser
                                            ? "Auto generate to new user"
                                            : "Manual voucher assignment only"
                                    }}
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div class="text-subtitle-1 text-medium-emphasis">Description</div>
                                <div class="text-body-2">{{ formatEmpty(detail?.voucherTypeDesc) }}</div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div class="text-subtitle-1 text-medium-emphasis">Terms & Conditions</div>
                                <div class="text-body-2 text-justify" style="white-space: pre-line">
                                    {{ formatEmpty(detail?.termCondition) }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" order="1" order-md="2">
                <v-card rounded="xl" flat class="pb-1 ma-auto">
                    <v-card-title class="text-left">Preview</v-card-title>
                    <v-card-text>
                        <v-card flat rounded="lg" class="pa-2 ma-auto" style="border: 2px solid #e0e0e0">
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
                                                <template v-if="detail?.image">
                                                    <v-img :src="detail?.image"></v-img>
                                                </template>
                                                <template v-else>
                                                    <v-icon size="100" color="white">mdi-file-image-remove</v-icon>
                                                </template>
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
                                    <div class="pl-3 pr-3 pt-1 pb-1 font-weight-bold status-badge active">Active</div>
                                </div>
                            </template>
                            <template v-else>
                                <v-sheet min-height="150" rounded="lg" color="#D9D9D9" class="pt-3 voucher-card">
                                    <v-container style="height: 100%">
                                        <v-row dense align="center" style="height: 100%">
                                            <v-col cols="5">
                                                <template v-if="detail?.image">
                                                    <v-img :src="detail?.image"></v-img>
                                                </template>
                                                <template v-else>
                                                    <v-icon size="100" color="white">mdi-file-image-remove</v-icon>
                                                </template>
                                            </v-col>
                                            <v-col cols="7" class="text-left">
                                                <v-row dense justify="stretch">
                                                    <v-col cols="12">
                                                        <div
                                                            class="text-white font-weight-bold text-sm-h2 text-md-h4"
                                                            :class="smAndDown ? 'text-h4' : 'text-h5'"
                                                        >
                                                            {{ detail?.voucherTypeCode }}
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-sheet>
                            </template>
                            <v-card-text class="pa-0 mt-5">
                                <template v-if="detail?.voucherTypeDesc">
                                    <div class="text-body-1 text-justify text-medium-emphasis">
                                        {{ formatEmpty(detail?.voucherTypeDesc) }}
                                    </div>
                                </template>

                                <div class="text-subtitle-1 font-weight-bold text-left mt-6">Validity</div>
                                <div class="text-body-2 text-justify text-medium-emphasis">
                                    <template v-if="detail?.startDate && detail?.endDate">
                                        From <strong>{{ convertDate(detail?.startDate) }}</strong> Until
                                        <strong>{{ convertDate(detail?.endDate) }}</strong> Only
                                    </template>
                                    <template v-else> - </template>
                                </div>

                                <div class="text-subtitle-1 font-weight-bold text-left mt-6">Terms & Conditions</div>
                                <div class="text-body-2 text-justify" style="white-space: pre-line">
                                    {{ formatEmpty(detail?.termCondition) }}
                                </div>
                                <v-btn flat block rounded="lg" color="#FFD700" size="large" class="mt-8" readonly>
                                    Redeem Now
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-btn class="ma-auto mt-6" rounded="lg" prepend-icon="mdi-arrow-left" @click="goBack()" flat>Back</v-btn>

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
import { deleteVoucherType, getVoucherType } from "../../api/voucher-type";
import { voucherColorType } from "../../constants/selection.constant";
import { convertDate, convertDatetime, formatDatetime, formatEmpty } from "../../utils/formatter";
import Snackbar from "../../components/Snackbar.vue";
import NotFound from "../../views/NotFound.vue";
import logo from "../../assets/logo.svg";
import { useDisplay } from "vuetify";

const detail = ref(null);
const route = useRoute();
const router = useRouter();
const { smAndDown } = useDisplay();
const id = route.params.id;

const loading = ref(true);
const notFound = ref(false);

function goBack() {
    router.back();
}

// Breadcrumbs
const breadcrumbs = [
    { title: "Voucher Type Management", disabled: false, to: "/voucher-type" },
    { title: "View Detail", disabled: false },
];

onMounted(async () => {
    try {
        const response = await getVoucherType(id);
        if (response) detail.value = response.data;
        else notFound.value = true;
    } catch (err) {
        console.error(err);
        notFound.value = true;
    } finally {
        loading.value = false;
    }
});

const voucherColor = voucherColorType;

const selectedGradient = computed(() => {
    if (!detail.value) return "";
    const color = voucherColor.find((c) => c.id === detail.value.colourSchema);
    return color ? color.code : "";
});

const modal = ref(false);

const snackbar = ref(false);
const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);

async function confirmDelete(id) {
    try {
        const response = await deleteVoucherType(id);
        if (response.success) {
            router.push({ path: "/voucher-type", query: { deleted: "true" } });
        } else {
            isSuccess.value = false;
            errorTitle.value = `Status ${response.status}: Failed to delete voucher type`;
            modal.value = false;
            snackbar.value = true;
        }
    } catch (error) {
        console.error("Failed to delete voucher type", error);
    }
}
</script>
