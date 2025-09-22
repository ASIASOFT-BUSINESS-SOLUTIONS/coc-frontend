<template>
    <v-dialog v-model="modal" width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn flat rounded="lg" style="border: 2px solid #ffd700" v-bind="activatorProps">Export List</v-btn>
        </template>

        <v-card rounded="xl">
            <v-card-title class="d-flex justify-space-between align-center" style="background-color: #ffd700">
                <span class="text-h6 font-weight-bold pl-2">Export List</span>
                <v-btn icon variant="text" @click="modal = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="text-left">
                <v-form v-model="form" @submit.prevent="onSubmit">
                    <div class="text-subtitle-1 text-medium-emphasis">File Format</div>
                    <v-radio-group inline v-model="format">
                        <v-radio label="CSV" value="csv"></v-radio>
                        <v-radio label="PDF" value="pdf"></v-radio>
                        <v-radio label="Word" value="word"></v-radio>
                    </v-radio-group>

                    <v-row dense>
                        <v-col cols="12" md="5">
                            <div class="text-subtitle-1 text-medium-emphasis">Start Date</div>
                            <v-text-field
                                v-model="startDate"
                                rounded="lg"
                                density="compact"
                                type="date"
                                variant="outlined"
                                clearable
                                :max="endDate"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2" class="text-center d-flex align-center justify-center">
                            <v-icon size="28" color="grey-darken-1">
                                {{ mdAndUp ? "mdi-arrow-right" : "mdi-arrow-down" }}
                            </v-icon>
                        </v-col>
                        <v-col cols="12" md="5">
                            <div class="text-subtitle-1 text-medium-emphasis">End Date</div>
                            <v-text-field
                                v-model="endDate"
                                rounded="lg"
                                density="compact"
                                type="date"
                                :min="startDate ?? today"
                                variant="outlined"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <!-- <div class="text-subtitle-1 text-medium-emphasis">Event</div>
                    <v-select
                        density="compact"
                        rounded="lg"
                        variant="outlined"
                        placeholder="Event"
                        :items="eventSelection"
                    ></v-select> -->
                    <br />
                    <v-btn flat block rounded="lg" color="#FFD700" density="default" size="large" type="submit"
                        >Export</v-btn
                    >
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { getAttendance } from "../api/attendance";

const { mdAndUp } = useDisplay();

const props = defineProps({
    type: {
        type: String,
        required: true,
    },
});

const today = new Date().toISOString().split("T")[0];
const modal = ref(false);
const startDate = ref(null);
const endDate = ref(null);
const format = ref("csv");
const eventSelection = ["Company Opening Event"];

const onSubmit = async () => {
    // Build payload including hidden type
    const payload = {
        type: props.type,
        format: format.value,
        startDate: startDate.value,
        endDate: endDate.value,
    };

    try {
        let response;
        let data;
        switch (payload.type) {
            case "attendance":
                response = await getAttendance();
                break;
        }

        if (response) data = response.data;
    } catch (error) {
        console.error(error);
    }

    modal.value = false;
};

const exportCSV = (rows) => {
    if (!rows?.length) return;
    const header = Object.keys(rows[0]).join(",");
    const body = rows.map((r) => Object.values(r).join(",")).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "export.csv";
    link.click();
};
</script>
