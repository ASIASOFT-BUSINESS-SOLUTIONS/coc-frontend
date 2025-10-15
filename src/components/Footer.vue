<template>
    <v-footer app class="text-center d-flex flex-column ga-2 py-4" color="#FFFBEF">
        <v-divider thickness="2" color="grey-darken-1" class="position-absolute top-0 start-0 w-100"></v-divider>
        <div class="d-flex align-center justify-center">
            <v-img :src="logo" alt="Asiasoft Business Solution" width="20" class="mr-2" draggable="false"></v-img>
            <div class="text-caption font-weight-regular opacity-60">
                Copyright © {{ new Date().getFullYear() }} Asiasoft Business Solutions 200801030089 (831418-H). All
                rights reserved.
            </div>
        </div>
    </v-footer>
</template>

<script setup>
import logo from "../assets/logo.svg";
</script>
