<template>
    <NotFound v-if="notFound" />
    <div v-else class="pa-8">
        <v-row class="align-center">
            <v-col cols="12" md="8">
                <v-breadcrumbs
                    :items="breadcrumbs"
                    class="text-left pa-0 font-weight-medium breadcrumbs-block no-padding breadcrumbs-hover"
                >
                    <template v-slot:divider>
                        <v-icon icon="mdi-chevron-right" />
                    </template>
                </v-breadcrumbs>
                <h4 class="text-h4 font-weight-bold text-left pt-1">{{ isEdit ? "Edit" : "Create" }} User</h4>
                <div class="text-grey-darken-1 text-left pt-1">View and manage registered users</div>
            </v-col>
        </v-row>

        <v-row>
            <!-- <v-col cols="12" md="4" v-if="isEdit">
                <v-row>
                    <v-col cols="12">
                        <v-card rounded="xl" flat style="border: 2px solid #e0e0e0">
                            <v-card-title class="d-flex justify-space-between align-center">
                                <span class="font-weight-bold">Profile Photo</span>
                            </v-card-title>
                            <v-divider thickness="2"></v-divider>
                            <v-card-text class="text-center align-center">
                                <v-row dense>
                                    <v-col cols="12">
                                        <v-icon size="150" color="grey">mdi-account-circle</v-icon>
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="12">
                                        <span class="text-subtitle-1">JPG or PNG no larger than 5 MB</span>
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="12">
                                        <v-btn class="mt-2 mb-4" disabled flat rounded="lg" size="large" color="#FFD700"
                                            >Upload New Photo</v-btn
                                        >
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-card rounded="xl" flat style="border: 2px solid #e0e0e0">
                            <v-card-title class="d-flex justify-space-between align-center">
                                <span class="font-weight-bold">Delete Account</span>
                            </v-card-title>
                            <v-divider thickness="2"></v-divider>
                            <v-card-text class="text-justify align-center">
                                <v-row dense>
                                    <v-col cols="12">
                                        <span class="text-subtitle-2 font-weight-regular opacity-60"
                                            >Deleting your account is a permanent action and cannot be undone. If you
                                            are sure you want to delete your account, select the button below.</span
                                        >
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="12">
                                        <v-btn
                                            class="mt-2 mb-4 text-none text-body-1"
                                            flat
                                            block
                                            disabled
                                            rounded="lg"
                                            size="large"
                                            color="red"
                                            variant="outlined"
                                            >I understand, delete my account</v-btn
                                        >
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col> -->
            <v-col cols="12">
                <v-card rounded="xl" flat style="border: 2px solid #e0e0e0">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span class="font-weight-bold">Account Detail</span>
                    </v-card-title>
                    <v-divider thickness="2"></v-divider>
                    <v-card-text class="text-left align-center">
                        <v-form @submit.prevent="submitForm">
                            <v-row dense>
                                <v-col>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        <strong class="text-red">*</strong> Login ID
                                    </div>
                                    <v-text-field
                                        v-model="form.userID"
                                        class="mb-2"
                                        variant="outlined"
                                        rounded="lg"
                                        bg-color="#F9F9F9"
                                        placeholder="Login ID"
                                        :rules="[validation.required]"
                                        density="compact"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row dense v-if="!isEdit">
                                <v-col>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        <strong class="text-red">*</strong> Password
                                    </div>
                                    <v-text-field
                                        placeholder="Password"
                                        v-model="form.password"
                                        class="mb-2"
                                        variant="outlined"
                                        rounded="lg"
                                        bg-color="#F9F9F9"
                                        :rules="[validation.required]"
                                        density="compact"
                                        :type="visible ? 'text' : 'password'"
                                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="visible = !visible"
                                        clearable
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row dense v-if="!isEdit">
                                <v-col>
                                    <div class="text-subtitle-2 font-weight-bold">
                                        <strong class="text-red">*</strong> Confirm Password
                                    </div>
                                    <v-text-field
                                        placeholder="Password"
                                        v-model="form.confirmPassword"
                                        class="mb-2"
                                        :rules="[validation.required, validation.confirmPassword(form.password)]"
                                        density="compact"
                                        variant="outlined"
                                        rounded="lg"
                                        bg-color="#F9F9F9"
                                        :type="visible ? 'text' : 'password'"
                                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="visible = !visible"
                                        clearable
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col cols="12" md="6">
                                    <div class="text-subtitle-2 font-weight-bold">
                                        <strong class="text-red">*</strong> User Name
                                    </div>
                                    <v-text-field
                                        v-model="form.userName"
                                        placeholder="User Name"
                                        class="mb-2"
                                        variant="outlined"
                                        rounded="lg"
                                        bg-color="#F9F9F9"
                                        density="compact"
                                        :rules="[validation.maxLength(50), validation.required]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="text-subtitle-2 font-weight-bold">
                                        <strong class="text-red">*</strong> Role
                                    </div>
                                    <v-select
                                        v-model="form.userTypeCode"
                                        density="compact"
                                        class="mb-2"
                                        variant="outlined"
                                        rounded="lg"
                                        bg-color="#F9F9F9"
                                        placeholder="Role Selection"
                                        :rules="[validation.required]"
                                        :items="userRoles"
                                        item-title="description"
                                        item-value="code"
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col cols="12">
                                    <div class="text-subtitle-2 font-weight-bold">
                                        <template v-if="form.userTypeCode === 'K' || form.userTypeCode === 'Represent'"
                                            ><strong class="text-red">*</strong></template
                                        >

                                        Voucher Type Code
                                    </div>
                                    <v-select
                                        v-model="form.voucherTypeCode"
                                        density="compact"
                                        class="mb-2"
                                        multiple
                                        chips
                                        variant="outlined"
                                        rounded="lg"
                                        bg-color="#F9F9F9"
                                        placeholder="Voucher Type Code Selection"
                                        :disabled="form.userTypeCode !== 'K' && form.userTypeCode !== 'Represent'"
                                        :items="voucherTypes"
                                        item-title="code"
                                        item-value="code"
                                    >
                                        <template v-slot:prepend-item>
                                            <v-list-item @click="toggle">
                                                <template v-slot:prepend>
                                                    <v-checkbox
                                                        hide-details
                                                        :model-value="isAllSelected"
                                                        :indeterminate="isIndeterminate"
                                                    ></v-checkbox>
                                                </template>
                                                <v-list-item-title>Select All</v-list-item-title>
                                            </v-list-item>
                                            <v-divider></v-divider>
                                        </template>
                                    </v-select>
                                </v-col>
                            </v-row>
                            <v-row class="mt-3" dense>
                                <v-col md="3">
                                    <v-btn
                                        block
                                        flat
                                        rounded="lg"
                                        color="#FFD700"
                                        size="large"
                                        class="hover-lift"
                                        :loading="loading"
                                        :disabled="!isFormValid"
                                        type="submit"
                                    >
                                        {{ isEdit ? "Save Changes" : "Create" }}
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
            </v-col>
        </v-row>
        <v-btn class="ma-auto mt-6 hover-lift" rounded="lg" prepend-icon="mdi-arrow-left" @click="router.back()" flat
            >Back</v-btn
        >
    </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch, computed } from "vue";
import { createUser, editUser, getRolesAndVoucherTypes, getUser } from "../../api/user";
import { rules } from "../../constants/validation.constant";
import ConfirmDialog from "../../components/ConfirmDialog.vue";
import NotFound from "../../views/NotFound.vue";
import { useLoader } from "../../stores/loaderStore";
import { withMinLoading } from "../../utils/loader";
import { useSnackbarStore } from "../../stores/snackbarStore";

const route = useRoute();
const router = useRouter();
const { loading } = useLoader();

// Breadcrumbs
const breadcrumbs = [
    { title: "User Management", disabled: false, to: "/user" },
    { title: route.params.id ? "Edit User" : "Create User", disabled: false },
];

const cancelModal = ref(false);

let originalData = null;

const form = ref({
    userKey: null,
    userID: null,
    userName: null,
    password: null,
    confirmPassword: null,
    userTypeCode: null,
    voucherTypeCode: [],
});

const isEdit = ref(false);
const visible = ref(false);
const notFound = ref(false);

const snackbar = useSnackbarStore();

const userRoles = ref([]);
const voucherTypes = ref([]);

onMounted(async () => {
    const response = await getRolesAndVoucherTypes({ includeUserTypes: true, includeVoucherTypes: true });
    if (response) {
        userRoles.value = response.data.userTypes;
        voucherTypes.value = response.data.voucherTypes;
    }

    if (route.params.id) {
        try {
            const response = await getUser(route.params.id);
            if (response) {
                form.value = response.data;
                form.value.voucherTypeCode = response.data.voucherTypeCode
                    ? response.data.voucherTypeCode.split(",").map((s) => s.trim())
                    : [];
                originalData = { ...response.data };
            } else notFound.value = true;
        } catch (err) {
            console.error(err);
            notFound.value = true;
        }
        isEdit.value = true;
    }
});

const toggle = () => {
    if (isAllSelected.value) {
        form.value.voucherTypeCode = [];
    } else {
        form.value.voucherTypeCode = voucherTypes.value.map((v) => v.code);
    }
};

const isAllSelected = computed(() => form.value.voucherTypeCode.length === voucherTypes.value.length);

const isIndeterminate = computed(
    () => form.value.voucherTypeCode.length > 0 && form.value.voucherTypeCode.length < voucherTypes.value.length
);

const validation = rules;

const isFormValid = computed(() => {
    const f = form.value;

    // always required
    const baseChecks = !!f.userID?.trim() && !!f.userTypeCode?.trim();

    if (isEdit.value) {
        // ✅ In edit mode: no password or confirmPassword check
        return baseChecks;
    } else {
        // ✅ Create mode: include password + confirmPassword match
        return baseChecks && f.password && f.confirmPassword && f.password === f.confirmPassword;
    }
});

async function submitForm() {
    loading.value = true;
    try {
        const payload = {
            userID: form.value.userID,
            userName: form.value.userName,
            userTypeCode: form.value.userTypeCode,
            voucherTypeCode: form.value.voucherTypeCode ? form.value.voucherTypeCode.join(",") : undefined,
            password: form.value.password || undefined, // skip empty password on edit
            ...(isEdit.value && { userKey: route.params.id }), // add only in edit
        };

        const response = isEdit.value
            ? await withMinLoading(editUser(payload), 1500)
            : await withMinLoading(createUser(payload), 1500);
        if (response.success) {
            if (isEdit.value) {
                snackbar.openSnackbar({ text: `User detail updated successfully!`, success: true });
                originalData = payload;
                originalData.voucherTypeCode = form.value.voucherTypeCode;
            } else {
                router.push({ path: "/user", query: { created: "true" } });
            }
        } else snackbar.openSnackbar({ text: `Status ${response.status}: ${response.message}`, success: false });
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}

function resetForm() {
    if (route.params.id) form.value = { ...originalData };
    else {
        form.value = {
            userKey: null,
            userID: null,
            userName: null,
            password: null,
            confirmPassword: null,
            userTypeCode: null,
            voucherTypeCode: null,
        };
    }
    cancelModal.value = false;
}

watch(
    () => form.value.userTypeCode,
    (newVal) => {
        if (newVal !== "K" && newVal !== "Represent") {
            form.value.voucherTypeCode = []; // clear it so stale values don’t stay
        }
    }
);
</script>
