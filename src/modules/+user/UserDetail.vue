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
                <div class="text-grey-darken-1 text-left pt-1">View detail of user</div>
            </v-col>
            <v-col cols="12" sm="4" class="text-sm-right text-left mt-2 mt-md-0">
                <v-dialog v-model="modal" width="400">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn
                            flat
                            rounded="lg"
                            style="border: 2px solid #f44336; color: red"
                            v-bind="activatorProps"
                            class="mr-2 hover-lift"
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
                <v-btn
                    flat
                    rounded="lg"
                    color="#ffd700"
                    :to="{ path: `/user/${route.params.id}/edit` }"
                    class="ml-1 hover-lift"
                    >Edit
                </v-btn>
            </v-col>
        </v-row>

        <v-card rounded="sm" flat class="mb-4">
            <v-tabs v-model="tab" slider-color="#FFD700" show-arrows="true">
                <v-tab value="1">General Info</v-tab>
                <v-tab value="2">Access Right</v-tab>
            </v-tabs>
        </v-card>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="1">
                <v-card rounded="lg" flat v-if="detail" class="pa-5">
                    <v-row class="text-left">
                        <v-col cols="12" sm="6">
                            <div class="text-subtitle-1 text-medium-emphasis">Login ID</div>
                            <div class="text-subtitle-2 font-weight-bold">{{ formatEmpty(detail?.userID) }}</div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="text-subtitle-1 text-medium-emphasis">User Role Type</div>
                            <div class="text-subtitle-2 font-weight-bold">{{ formatEmpty(detail?.userTypeDesc) }}</div>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <div class="text-subtitle-1 text-medium-emphasis">Display Name</div>
                            <div class="text-subtitle-2 font-weight-bold">{{ formatEmpty(detail?.userName) }}</div>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <div class="text-subtitle-1 text-medium-emphasis">Registration Date</div>
                            <div class="text-subtitle-2 font-weight-bold">{{ formatDate(detail?.createdAt) }}</div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="text-subtitle-1 text-medium-emphasis">Status</div>
                            <div class="text-subtitle-2 font-weight-bold">
                                <v-chip color="green" size="small" label class="text-white font-weight-bold">
                                    Active
                                </v-chip>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>

                <v-card rounded="lg" flat v-if="detail?.voucherTypeCode" class="pa-5 mt-5">
                    <v-row class="text-left">
                        <v-col cols="12">
                            <div class="text-subtitle-1 text-medium-emphasis">User Voucher Type</div>
                            <div class="text-subtitle-2 font-weight-bold">
                                <template v-if="detail?.voucherTypeCode">
                                    <v-chip
                                        v-for="(type, index) in detail.voucherTypeCode.split(',')"
                                        :key="index"
                                        class="ma-1"
                                        rounded="xl"
                                        size="small"
                                        label
                                    >
                                        {{ type.trim() }}
                                    </v-chip>
                                </template>
                                <template v-else>
                                    {{ formatEmpty(detail?.voucherTypeCode) }}
                                </template>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-tabs-window-item>
        </v-tabs-window>
        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="2">
                <v-table fixed-header density="compact" class="rounded-lg border-thin text-left" striped="odd">
                    <thead>
                        <tr class="text-left">
                            <th>Module</th>
                            <th>Accessibility</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="module in modules" :key="module">
                            <td>{{ module }}</td>
                            <td>
                                <v-switch
                                    v-model="alwaysOn"
                                    inset
                                    readonly
                                    hide-details
                                    :true-value="1"
                                    :false-value="0"
                                    color="success"
                                    value="true"
                                />
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-tabs-window-item>
        </v-tabs-window>

        <v-btn class="ma-auto mt-6 hover-lift" rounded="lg" prepend-icon="mdi-arrow-left" @click="goBack()" flat
            >Back</v-btn
        >
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getRolesAndVoucherTypes, getUser, deleteUser } from "../../api/user";
import { formatDate, formatEmpty } from "../../utils/formatter";
import NotFound from "../../views/NotFound.vue";
import { useSnackbarStore } from "../../stores/snackbarStore";
import { withMinLoading } from "../../utils/loader";

// Breadcrumbs
const breadcrumbs = [
    { title: "User Management", disabled: false, to: "/user" },
    { title: "View Detail", disabled: false },
];

const tab = ref(null);
const alwaysOn = ref(1);
const modules = [
    "Dashboard",
    "Guest",
    "Voucher Type",
    "Voucher Batch List",
    "Voucher Log",
    "Attendance Log",
    "Enquiry Log",
];

const detail = ref(null);
const route = useRoute();
const router = useRouter();

function goBack() {
    router.back(); // goes to previous page in history
}

const loading = ref(true);
const notFound = ref(false);

const accessRight = ref([]);

onMounted(async () => {
    const response = await getRolesAndVoucherTypes({ includeUserTypes: true, includeVoucherTypes: true });
    if (response) {
        accessRight.value = response.data.voucherTypes;
    }

    try {
        const result = await getUser(route.params.id);
        if (result) detail.value = result.data;
        else notFound.value = true;
    } catch (err) {
        console.error(err);
        notFound.value = true;
    }
});

const modal = ref(false);

const snackbar = useSnackbarStore();

async function confirmDelete(id) {
    loading.value = true;
    try {
        const response = await withMinLoading(deleteUser(id));
        if (response.success) {
            router.push({ path: "/user", query: { deleted: "true" } });
        } else {
            snackbar.openSnackbar({ text: `Status ${response.status}: Failed to delete user`, success: false });
        }
    } catch (error) {
        console.error("Failed to delete user", error);
    } finally {
        loading.value = false;
    }
}
</script>
