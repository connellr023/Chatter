/**
 * Main Vue initialization
 * @author Connell Reffo
 */
import "./assets/main.css";

import App from "./App.vue";
import router from "./router/router";

import {createApp} from "vue";
import {createPinia} from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.mount("#app");