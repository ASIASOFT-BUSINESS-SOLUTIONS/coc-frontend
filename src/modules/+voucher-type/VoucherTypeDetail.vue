<template>
    <NotFound v-if="notFound" />
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
                <v-btn
                    flat
                    rounded="lg"
                    class="mr-2 hover-lift"
                    style="border: 2px solid #f44336; color: red"
                    @click="modal = true"
                    >Delete</v-btn
                >
                <ConfirmDialog
                    v-model="modal"
                    title="Delete"
                    message="Are you sure you want to delete?"
                    :onYes="() => confirmDelete(route.params.id)"
                    color="#f44336"
                ></ConfirmDialog>
                <v-btn
                    flat
                    rounded="lg"
                    color="#ffd700"
                    :to="{ path: `/voucher-type/${id}/edit` }"
                    class="ml-1 hover-lift"
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
                                    {{ formatDatetime(detail?.createdAt) }}
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
                        <v-row>
                            <v-col cols="12">
                                <div class="text-subtitle-1 text-medium-emphasis">Remark</div>
                                <div class="text-body-2 text-justify" style="white-space: pre-line">
                                    {{ formatEmpty(detail?.remark) }}
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
                                            <v-icon :size="iconSize" color="white">mdi-file-image-remove</v-icon>
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
                                <div class="pl-3 pr-3 pt-1 pb-1 font-weight-bold status-badge active">Active</div>
                            </div>
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

        <v-btn class="ma-auto mt-6 hover-lift" rounded="lg" prepend-icon="mdi-arrow-left" @click="goBack()" flat
            >Back</v-btn
        >
    </div>
</template>
<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { deleteVoucherType, getVoucherType } from "../../api/voucher-type";
import { convertDate, convertDatetime, formatDatetime, formatEmpty } from "../../utils/formatter";
import NotFound from "../../views/NotFound.vue";
import { useDisplay } from "vuetify";
import { useSnackbarStore } from "../../stores/snackbarStore";
import { useLoader } from "../../stores/loaderStore";
import ConfirmDialog from "../../components/ConfirmDialog.vue";

const detail = ref(null);
const snackbar = useSnackbarStore();
const route = useRoute();
const router = useRouter();
const { smAndDown } = useDisplay();
const id = route.params.id;

const { loading } = useLoader();
const notFound = ref(false);

function goBack() {
    router.back();
}

// Breadcrumbs
const breadcrumbs = [
    { title: "Voucher Type Management", disabled: false, to: "/voucher-type" },
    { title: "View Detail", disabled: false },
];

const voucherCardRef = ref(null);
const fontSize = ref("1.5rem");
const iconSize = ref(60);

onMounted(async () => {
    try {
        const response = await getVoucherType(id);
        if (response) detail.value = response.data;
        else notFound.value = true;
    } catch (err) {
        console.error(err);
        notFound.value = true;
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

const modal = ref(false);

async function confirmDelete(id) {
    loading.value = true;
    try {
        const response = await deleteVoucherType(id);
        if (response.success) {
            router.push({ path: "/voucher-type", query: { deleted: "true" } });
        } else {
            snackbar.openSnackbar({ text: `Status ${response.status}: Failed to delete voucher type`, success: false });
        }
    } catch (error) {
        console.error("Failed to delete voucher type", error);
    } finally {
        loading.value = false;
    }
}
</script>
