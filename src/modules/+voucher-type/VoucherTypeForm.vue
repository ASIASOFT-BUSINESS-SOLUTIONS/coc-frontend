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
                <h4 class="text-h4 font-weight-bold text-left pt-1">{{ isEdit ? "Edit" : "Create" }} Voucher Type</h4>
                <div class="text-grey-darken-1 text-left pt-1">
                    {{ isEdit ? "Edit detail of existing voucher" : "Add new voucher" }}
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="8" order="2" order-md="1">
                <v-row>
                    <v-col cols="12">
                        <v-card rounded="xl" flat class="pl-4" style="border: 2px solid #e0e0e0">
                            <v-card-text class="text-left">
                                <v-switch
                                    density="compact"
                                    color="info"
                                    inset
                                    hide-details
                                    label="Auto generate to new user"
                                    v-model="form.forNewUser"
                                    @click="isEdit && submitForm()"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card rounded="xl" flat class="ma-auto" style="border: 2px solid #e0e0e0">
                            <v-card-title class="d-flex justify-space-between align-center">
                                <span class="font-weight-bold">Voucher Type Detail</span>
                            </v-card-title>
                            <v-divider thickness="2"></v-divider>
                            <v-card-text class="text-left">
                                <v-form>
                                    <v-row dense class="align-center">
                                        <v-col cols="12" sm="9">
                                            <div class="text-subtitle-1 text-medium-emphasis">Voucher Type</div>
                                            <!-- <v-select
                                                v-model="form.voucherTypeCode"
                                                density="compact"
                                                class="mb-2"
                                                placeholder="Select Voucher Type"
                                                :rules="[validation.required]"
                                                :items="voucherType"
                                                item-title="name"
                                                item-value="name"
                                            ></v-select> -->
                                            <v-text-field
                                                placeholder="Enter Voucher Type"
                                                v-model="form.voucherTypeCode"
                                                class="mb-2"
                                                density="compact"
                                                :rules="[validation.required, validation.maxLength(100)]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="3" class="float-right">
                                            <v-checkbox
                                                color="info"
                                                inset
                                                hide-details
                                                label="Food Selection"
                                                v-model="form.forFoodSelection"
                                            />
                                        </v-col>
                                    </v-row>
                                    <v-row dense class="align-center">
                                        <v-col cols="12">
                                            <div class="text-subtitle-1 text-medium-emphasis">Voucher Color</div>
                                            <v-select
                                                v-model="form.colourSchema"
                                                density="compact"
                                                class="mb-2"
                                                placeholder="Select Color"
                                                :items="voucherColor"
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
                                            <v-text-field
                                                v-model="form.startDate"
                                                density="compact"
                                                type="date"
                                                :rules="[validation.required]"
                                                :min="tomorrowStr"
                                                :max="form.endDate"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <div class="text-subtitle-1 text-medium-emphasis">End Date</div>
                                            <v-text-field
                                                v-model="form.endDate"
                                                density="compact"
                                                type="date"
                                                :rules="[validation.required]"
                                                :min="form.startDate ?? today"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row dense class="align-center">
                                        <v-col>
                                            <div class="text-subtitle-1 text-medium-emphasis">Image</div>
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
                                                accept=".jpg, .png"
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
                                    <v-row dense class="align-center">
                                        <v-col>
                                            <div class="text-subtitle-1 text-medium-emphasis">Remark</div>
                                            <v-text-field
                                                placeholder="Enter Remark"
                                                v-model="form.remark"
                                                class="mb-2"
                                                :rules="[validation.maxLength(100)]"
                                                density="compact"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col sm="6" cols="12">
                                            <v-dialog v-model="submitModal" width="500">
                                                <template v-slot:activator="{ props: activatorProps }">
                                                    <v-btn
                                                        flat
                                                        block
                                                        rounded="lg"
                                                        color="#FFD700"
                                                        size="large"
                                                        :disabled="!isFormValid"
                                                        v-bind="activatorProps"
                                                    >
                                                        Submit
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
                                                        <div class="font-weight-medium">
                                                            Are you sure you want to submit?
                                                        </div>
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
                </v-row>
            </v-col>

            <v-col cols="12" md="4" order="1" order-md="2">
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
                                    <div class="pl-3 pr-3 pt-1 pb-1 font-weight-bold status-badge active">Active</div>
                                </div>
                            </template>
                            <template v-else>
                                <v-sheet min-height="150" rounded="lg" color="#D9D9D9" class="pt-3 voucher-card">
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
                                <div class="text-body-1 text-justify text-medium-emphasis">
                                    {{ form.voucherTypeDesc ?? "-" }}
                                </div>

                                <div class="text-subtitle-1 font-weight-bold text-left mt-6">Validity</div>
                                <div class="text-body-2 text-justify text-medium-emphasis">
                                    <template v-if="form.startDate && form.endDate">
                                        From <strong>{{ convertDate(form.startDate) }}</strong> Until
                                        <strong>{{ convertDate(form.endDate) }}</strong> Only
                                    </template>
                                    <template v-else> - </template>
                                </div>

                                <div class="text-subtitle-1 font-weight-bold text-left mt-6">Terms & Conditions</div>
                                <div
                                    class="text-body-2 text-justify text-medium-emphasis"
                                    style="white-space: pre-line"
                                >
                                    {{ form.termCondition ?? "-" }}
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import Snackbar from "../../components/Snackbar.vue";
import { createVoucherType, editVoucherType, getVoucherType } from "../../api/voucher-type";
import { rules } from "../../constants/validation.constant";
import { convertDate } from "../../utils/formatter";
import { voucherColorType } from "../../constants/selection.constant";
import ConfirmDialog from "../../components/ConfirmDialog.vue";
import NotFound from "../../views/NotFound.vue";
import logo from "../../assets/logo.svg";
import { Cloudflare_UploadToR2 } from "../../api/upload";

const { smAndDown } = useDisplay();

const route = useRoute();
const router = useRouter();
const isEdit = ref(false);
const loading = ref(true);
const notFound = ref(false);

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(new Date());
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split("T")[0];

const isSuccess = ref(false);
const successTitle = ref(null);
const errorTitle = ref(null);
const snackbar = ref(false);

const validation = rules;

const submitModal = ref(false);
const cancelModal = ref(false);

// Breadcrumbs
const breadcrumbs = [
    { title: "Voucher Type Management", disabled: false, to: "/voucher-type" },
    { title: route.params.id ? "Edit Voucher Type" : "Create Voucher Type", disabled: false },
];

let originalData = null;

const form = ref({
    voucherTypeCode: null,
    colourSchema: null,
    remark: null,
    startDate: null,
    endDate: null,
    image: null,
    voucherTypeDesc: null,
    termCondition: null,
    forNewUser: false,
    forFoodSelection: false,
});

const previewUrl = ref(null);
function previewImage(file) {
    if (!file) {
        previewUrl.value = null;
        return;
    }
    // file can be File or File[]
    const selected = Array.isArray(file) ? file[0] : file;

    const validTypes = ["image/jpeg", "image/png"];

    if (!validTypes.includes(selected.type)) {
        previewUrl.value = null;
        form.value.image = null;
        isSuccess.value = false;
        errorTitle.value = `Invalid file type: ${selected.name}. Only JPG and PNG are allowed.`;
        snackbar.value = true;
        return;
    }

    previewUrl.value = URL.createObjectURL(selected);
}

const isFormValid = computed(() => {
    return (
        form.value.voucherTypeCode && form.value.startDate && form.value.endDate !== null // allow 0 or 1
    );
});

onMounted(async () => {
    if (route.params.id) {
        try {
            const response = await getVoucherType(route.params.id);
            if (response) {
                form.value = response.data;

                form.value.startDate = new Date(response.data.startDate).toISOString().slice(0, 10);
                form.value.endDate = new Date(response.data.endDate).toISOString().slice(0, 10);

                originalData = { ...response.data };
                originalData.startDate = new Date(response.data.startDate).toISOString().slice(0, 10);
                originalData.endDate = new Date(response.data.endDate).toISOString().slice(0, 10);
                originalData.image = null;
                originalData.previewUrl = response.data.image;

                previewUrl.value = response.data.image;
                form.value.image = null;
            } else {
                notFound.value = true;
            }
        } catch (err) {
            console.error(err);
            notFound.value = true;
        } finally {
            loading.value = false;
        }
        isEdit.value = true;
    }
    loading.value = false;
});

const voucherColor = voucherColorType;

const selectedGradient = computed(() => {
    const color = voucherColor.find((c) => c.code === form.value.colourSchema);
    return color ? color.code : "";
});

async function submitForm() {
    loading.value = true;
    try {
        const upload = await Cloudflare_UploadToR2({
            bucket: "asiasoft-reward-bucket",
            filepath: "/backoffice/voucher",
            body: form.value.image,
        });
        // const result = upload.result;

        const payload = {
            voucherTypeCode: form.value.voucherTypeCode,
            voucherTypeDesc: form.value.voucherTypeDesc,
            forNewUser: form.value.forNewUser,
            startDate: new Date(form.value.startDate).toISOString(),
            endDate: new Date(form.value.endDate).toISOString(),
            remark: form.value.remark,
            termCondition: form.value.termCondition,
            image: form.value.image,
            colourSchema: form.value.colourSchema,
            forFoodSelection: form.value.forFoodSelection,
            ...(isEdit.value && { voucherTypeKey: route.params.id }), // add only in edit
        };

        console.log("%c Payload: ", "background: #222; color: #bada55", payload);

        // const response = isEdit.value ? await editVoucherType(payload) : await createVoucherType(payload);
        // if (response.success) {
        //     if (isEdit.value) {
        //         isSuccess.value = true;
        //         successTitle.value = "Voucher type detail updated successfully!";
        //         submitModal.value = false;
        //         snackbar.value = true;
        //     } else {
        //         router.push({ path: "/voucher-type", query: { created: "true" } });
        //     }
        // } else {
        //     isSuccess.value = false;
        //     errorTitle.value = `Status ${response.status}: ${response.message}`;
        //     submitModal.value = false;
        //     snackbar.value = true;
        // }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
        submitModal.value = false;
    }
}

function resetForm() {
    if (route.params.id) {
        form.value = { ...originalData };
        previewUrl.value = originalData.previewUrl;
    } else {
        form.value = {
            voucherTypeCode: null,
            colourSchema: null,
            remark: null,
            startDate: null,
            endDate: null,
            image: null,
            voucherTypeDesc: null,
            termCondition: null,
            forNewUser: false,
            forFoodSelection: false,
        };
    }
    cancelModal.value = false;
}
</script>
