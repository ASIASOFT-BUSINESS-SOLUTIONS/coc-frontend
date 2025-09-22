import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
    plugins: [vue(), vuetify({ autoImport: true })],
    server: { allowedHosts: true },
    build: {
        emptyOutDir: true,
        rollupOptions: {
            treeshake: "recommended",
            strictDeprecations: false,
            shimMissingExports: false,
            maxParallelFileOps: 25,
            perf: true,
            output: {
                compact: true,
                sourcemapExcludeSources: true,
                interop: "compat",
                generatedCode: {
                    constBindings: true,
                    objectShorthand: true,
                },
            },
        },
    },
});
