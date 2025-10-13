import { ref } from "vue";

const loading = ref(false);
export function useLoader() {
    return { loading };
}
