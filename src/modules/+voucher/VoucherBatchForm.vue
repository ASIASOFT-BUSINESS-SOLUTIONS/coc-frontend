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
            <v-col>
                <v-breadcrumbs
                    :items="breadcrumbs"
                    class="text-left pa-0 font-weight-medium breadcrumbs-block no-padding breadcrumbs-hover"
                >
                    <template v-slot:divider>
                        <v-icon icon="mdi-chevron-right" />
                    </template>
                </v-breadcrumbs>
                <h4 class="text-h4 font-weight-bold text-left pt-1">Batch Generate</h4>
                <div class="text-grey-darken-1 text-left pt-1">Batch generate existing voucher to guest</div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="8" order="2" order-md="1">
                <v-card flat rounded="xl" class="ma-auto" style="border: 2px solid #e0e0e0">
                    <v-card-text class="text-left mb-3">
                        <v-form @submit.prevent="onSubmit">
                            <v-row dense class="align-center">
                                <v-col cols="12" sm="6">
                                    <div class="text-subtitle-1 text-medium-emphasis">Voucher Type</div>
                                    <v-select
                                        v-model="form.voucherTypeKey"
                                        density="compact"
                                        class="mb-2"
                                        placeholder="Select Voucher Type"
                                        :rules="[validation.required]"
                                        :items="voucherType"
                                        item-title="code"
                                        item-value="key"
                                    >
                                    </v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div class="text-subtitle-1 text-medium-emphasis">Voucher Color</div>
                                    <v-select
                                        v-model="form.colourSchema"
                                        density="compact"
                                        class="mb-2"
                                        placeholder="Select Color"
                                        :items="voucherColorType"
                                        item-title="id"
                                        item-value="code"
                                    >
                                        <template v-slot:item="{ props, item }">
                                            <v-list-item v-bind="props">
                                                <template v-slot:append>
                                                    <v-img
                                                        height="30"
                                                        width="30"
                                                        :gradient="`to right, ${item.raw.code}`"
                                                    />
                                                </template>
                                            </v-list-item>
                                        </template>
                                    </v-select>
                                </v-col>
                            </v-row>
                            <v-row dense class="align-center">
                                <v-col cols="12" sm="6">
                                    <div class="text-subtitle-1 text-medium-emphasis">Start Date</div>
                                    <v-date-input
                                        placeholder="Start Date"
                                        v-model="form.startDate"
                                        density="compact"
                                        :rules="[validation.required]"
                                        :max="form.endDate"
                                        display-format="fullDateWithWeekday"
                                    >
                                    </v-date-input>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div class="text-subtitle-1 text-medium-emphasis">End Date</div>
                                    <v-date-input
                                        placeholder="End Date"
                                        v-model="form.endDate"
                                        density="compact"
                                        :rules="[validation.required]"
                                        :min="form.startDate ?? today"
                                        display-format="fullDateWithWeekday"
                                    ></v-date-input>
                                </v-col>
                            </v-row>
                            <v-row dense class="align-center">
                                <v-col>
                                    <div class="text-subtitle-1 text-medium-emphasis">Image Url</div>
                                    <!-- <v-text-field
                                        placeholder="Enter Image Url"
                                        v-model="form.image"
                                        hint="Suggestion: Image with transparent background."
                                        persistent-hint="true"
                                        class="mb-2"
                                        density="compact"
                                    ></v-text-field> -->
                                    <v-file-upload
                                        class="mb-6"
                                        color="#F4F4F4"
                                        hide-browse
                                        title="Choose File or drag and drop"
                                        divider-text="JPG or PNG formats, up to 10MB"
                                        show-size
                                        clearable
                                        accept="image/*"
                                        icon="mdi-upload"
                                        v-model="form.image"
                                        @update:model-value="previewImage"
                                    >
                                    </v-file-upload>
                                </v-col>
                            </v-row>
                            <v-row dense class="align-center">
                                <v-col cols="12">
                                    <div class="text-subtitle-1 text-medium-emphasis">Description</div>
                                    <v-textarea
                                        density="compact"
                                        placeholder="Enter Description"
                                        v-model="form.voucherTypeDesc"
                                        class="mb-2"
                                    ></v-textarea>
                                </v-col>
                            </v-row>
                            <v-row dense class="align-center">
                                <v-col cols="12">
                                    <div class="text-subtitle-1 text-medium-emphasis">Terms and Conditions</div>
                                    <v-textarea
                                        density="compact"
                                        placeholder="Enter Terms and Conditions"
                                        v-model="form.termCondition"
                                        class="mb-2"
                                    ></v-textarea>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="6" cols="12">
                                    <v-btn
                                        flat
                                        block
                                        rounded="lg"
                                        :disabled="!isFormValid"
                                        color="#FFD700"
                                        size="large"
                                        type="submit"
                                    >
                                        Submit</v-btn
                                    >
                                </v-col>
                                <v-col sm="6" cols="12">
                                    <v-btn
                                        class="text-none text-body-1"
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
            </v-col>
            <v-col cols="12" md="4" order="1" order-md="2">
                <v-row>
                    <v-col cols="12">
                        <v-card rounded="xl" flat class="pb-1 ma-auto">
                            <v-card-title class="text-left">Preview</v-card-title>
                            <v-card-text>
                                <v-card flat rounded="lg" class="pa-2 ma-auto" style="border: 2px solid #e0e0e0">
                                    <template v-if="form.colourSchema">
                                        <v-img
                                            rounded="lg"
                                            aspect-ratio="16/9"
                                            min-height="150"
                                            class="voucher-card"
                                            :gradient="`to right, ${form.colourSchema}`"
                                        >
                                            <v-container style="height: 100%">
                                                <v-row dense align="center" style="height: 100%">
                                                    <v-col cols="5">
                                                        <v-img :src="previewUrl"></v-img>
                                                    </v-col>
                                                    <v-col cols="7" class="text-left">
                                                        <v-row dense justify="stretch">
                                                            <v-col cols="12">
                                                                <div
                                                                    class="text-white font-weight-bold text-sm-h2 text-md-h4"
                                                                    :class="smAndDown ? 'text-h4' : 'text-h5'"
                                                                >
                                                                    {{ form.voucherTypeCode }}
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
                                            class="pt-3 voucher-card"
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
                                    <v-card-text class="pa-0 mt-5">
                                        <template v-if="form?.voucherTypeDesc">
                                            <div class="text-body-1 text-justify text-medium-emphasis">
                                                {{ formatEmpty(form.voucherTypeDesc) }}
                                            </div>
                                        </template>

                                        <div class="text-subtitle-1 font-weight-bold text-left mt-6">Validity</div>
                                        <div class="text-body-2 text-justify text-medium-emphasis">
                                            <template v-if="form.startDate && form.endDate">
                                                From <strong>{{ convertDate(form.startDate) }}</strong> Until
                                                <strong>{{ convertDate(form.endDate) }}</strong> Only
                                            </template>
                                            <template v-else> - </template>
                                        </div>

                                        <div class="text-subtitle-1 font-weight-bold text-left mt-6">
                                            Terms & Conditions
                                        </div>
                                        <div
                                            class="text-body-2 text-justify text-medium-emphasis"
                                            style="white-space: pre-line"
                                        >
                                            {{ formatEmpty(form.termCondition) }}
                                        </div>
                                        <v-btn
                                            flat
                                            block
                                            rounded="lg"
                                            color="#FFD700"
                                            size="large"
                                            class="mt-8"
                                            readonly
                                        >
                                            Redeem Now
                                        </v-btn>
                                    </v-card-text>
                                </v-card>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card flat rounded="xl" class="ma-auto" style="border: 2px solid #e0e0e0">
                            <v-card-title class="d-flex justify-space-between align-center">
                                <span class="font-weight-bold">Guest Assign</span>
                            </v-card-title>
                            <v-divider thickness="2"></v-divider>
                            <v-card-text class="text-left">
                                <v-row dense class="align-center">
                                    <v-col>
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
                                                    :value="item.description"
                                                    color="info"
                                                    :label="`${item.name} (${item.description})`"
                                                    hide-details
                                                ></v-checkbox>
                                            </template>
                                        </v-virtual-scroll>
                                        <div v-else class="text-center text-medium-emphasis pa-6">
                                            No guests to display
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
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
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { rules } from "../../constants/validation.constant";
import { createVoucher, getVoucherTypesAndGuests } from "../../api/voucher";
import { getVoucherType } from "../../api/voucher-type";
import Snackbar from "../../components/Snackbar.vue";
import NotFound from "../../views/NotFound.vue";
import logo from "../../assets/logo.svg";
import { voucherColorType } from "../../constants/selection.constant";
import { formatEmpty, convertDate, compressImageToWebP, toMidnightUTC } from "../../utils/formatter";
import ConfirmDialog from "../../components/ConfirmDialog.vue";
import { deleteFile, uploadFile } from "../../api/upload";
import { useDisplay } from "vuetify";

// Breadcrumbs
const breadcrumbs = [
    { title: "Voucher Batch List", disabled: false, to: "/voucher-batch-list" },
    { title: "Batch Generate", disabled: false },
];

const today = new Date().toISOString().split("T")[0];

const validation = rules;
const { smAndDown } = useDisplay();

const previewUrl = ref(null);
function previewImage(file) {
    if (!file) {
        previewUrl.value = null;
        return;
    }
    // file can be File or File[]
    const selected = Array.isArray(file) ? file[0] : file;

    // ✅ Validate the MIME type
    if (!selected.type.startsWith("image/")) {
        previewUrl.value = null; // clear preview
        form.value.image = null; // clear the v-model if you use it
        isSuccess.value = false;
        errorTitle.value = `Invalid file type: ${selected.name}. Only image are allowed.`;
        snackbar.value = true;
        return;
    }
    previewUrl.value = URL.createObjectURL(selected);
}

const form = ref({
    voucherTypeKey: null,
    voucherTypeCode: null,
    colourSchema: null,
    startDate: null,
    endDate: null,
    image: null,
    voucherTypeDesc: null,
    termCondition: null,
    guestList: [],
});

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const notFound = ref(false);

const isFormValid = computed(() => {
    return (
        form.value.guestList.length &&
        form.value.voucherTypeKey &&
        form.value.voucherTypeCode &&
        form.value.startDate &&
        form.value.endDate !== null
    );
});

const guests = ref([]);
const voucherType = ref([]);

const cancelModal = ref(false);
let originalData = null;

watch(
    () => form.value.voucherTypeKey,
    async (newKey) => {
        if (!newKey) {
            return;
        }

        try {
            const response = await getVoucherType(newKey);
            form.value.voucherTypeCode = response.data.voucherTypeCode;
            form.value.voucherTypeDesc = response.data.voucherTypeDesc;
            form.value.colourSchema = response.data.colourSchema;
            form.value.termCondition = response.data.termCondition;
            form.value.startDate = new Date(response.data.startDate).toISOString().slice(0, 10);
            form.value.endDate = new Date(response.data.endDate).toISOString().slice(0, 10);

            originalData = { ...response.data };
            originalData.startDate = new Date(response.data.startDate).toISOString().slice(0, 10);
            originalData.endDate = new Date(response.data.endDate).toISOString().slice(0, 10);
            originalData.image = null;
            originalData.previewUrl = response.data.image;

            previewUrl.value = response.data.image;
            form.value.image = null;
        } catch (err) {
            console.error("Failed to load voucher type detail", err);
        }
    }
);

onMounted(async () => {
    const voucherTypeAndGuest = await getVoucherTypesAndGuests({ includeVoucherTypes: true, includeGuests: true });
    if (voucherTypeAndGuest) {
        guests.value = voucherTypeAndGuest.data.guests;
        voucherType.value = voucherTypeAndGuest.data.voucherTypes;
        loading.value = false;
    }
});

function resetForm() {
    form.value = {
        voucherTypeKey: null,
        voucherTypeCode: null,
        colourSchema: null,
        startDate: null,
        endDate: null,
        image: null,
        voucherTypeDesc: null,
        termCondition: null,
        guestList: [],
    };

    cancelModal.value = false;
}

const search = ref("");
const filteredGuests = computed(() => {
    if (!search.value) return guests.value;
    return guests.value.filter((g) => g.name.toLowerCase().includes(search.value.toLowerCase()));
});

const selectAll = computed({
    get: () => form.value.guestList.length === filteredGuests.value.length,
    set: (val) => {
        if (val) {
            form.value.guestList = filteredGuests.value.map((g) => g.description);
        } else {
            form.value.guestList = [];
        }
    },
});

const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);
const snackbar = ref(false);

// Form Submission
async function onSubmit() {
    loading.value = true;
    try {
        let fileUrl = previewUrl.value;
        let compressedImage;
        if (form.value.image) {
            compressedImage = await compressImageToWebP(form.value.image, 35);
            const upload = await uploadFile({ filename: compressedImage.lastModified }, compressedImage);
            if (upload && upload.success) fileUrl = upload.data;
            else {
                // TODO: Block from add voucher
                throw new Error();
            }
        }

        const payload = {
            voucherTypeKey: form.value.voucherTypeKey,
            voucherTypeCode: form.value.voucherTypeCode,
            startDate: toMidnightUTC(new Date(form.value.startDate)),
            endDate: toMidnightUTC(new Date(form.value.endDate)),
            voucherTypeDesc: form.value.voucherTypeDesc,
            termCondition: form.value.termCondition,
            image: fileUrl,
            colourSchema: form.value.colourSchema,
            details: form.value.guestList.map((email) => ({ emailAddress: email })),
        };
        // console.log("%c Payload: ", "background: #222; color: #bada55", payload);

        const response = await createVoucher(payload);
        if (response.success) router.push({ path: "/voucher-batch-list", query: { created: "true" } });
        else {
            if (payload.image !== originalData.previewUrl) {
                const params = new URL(payload.image).searchParams;
                const deleteImage = await deleteFile({ filename: params.get("filename") });
            }
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
</script>
