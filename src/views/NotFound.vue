<template>
    <v-empty-state
        title="Page not found"
        text="The page you were looking for does not exist"
        :image="empty"
    ></v-empty-state>
</template>

<script setup>
import empty from "../assets/empty.svg";
</script>

<style>
.v-empty-state__title {
    padding-top: 10px;
}
</style>
