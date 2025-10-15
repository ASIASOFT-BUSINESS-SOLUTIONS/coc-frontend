<template>
    <div ref="lottieContainer" class="lottie-loader"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import lottie from "lottie-web";

const props = defineProps({
    src: { type: String, required: true },
    loop: { type: Boolean, default: true },
    autoplay: { type: Boolean, default: true },
    speed: { type: Number, default: 1 },
    size: { type: String, default: "120px" },
});

const lottieContainer = ref(null);
let animation = null;

onMounted(() => {
    animation = lottie.loadAnimation({
        container: lottieContainer.value,
        renderer: "svg",
        loop: props.loop,
        autoplay: props.autoplay,
        animationData: props.src,
    });
    animation.setSpeed(props.speed);
});

onBeforeUnmount(() => {
    if (animation) {
        animation.destroy();
        animation = null;
    }
});
</script>

<style scoped>
.lottie-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    width: v-bind(size);
    height: v-bind(size);
    margin: auto;
}
</style>
