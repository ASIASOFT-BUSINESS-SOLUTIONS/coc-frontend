import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import router from "./router";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import "./assets/styles/styles.css";
import { VueQrcodeReader } from "vue-qrcode-reader";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const vuetify = createVuetify({ components, directives });
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(router).use(vuetify).use(VueQrcodeReader).use(pinia);
app.mount("#app");
