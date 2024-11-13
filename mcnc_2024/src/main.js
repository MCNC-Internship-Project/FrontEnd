import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import vuetify from "./plugins/vuetify";

import "./assets/css/main.css";

function setScreenSize() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener('load', setScreenSize);
window.addEventListener('resize', setScreenSize);

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.component("VueDatePicker", VueDatePicker);
app.mount("#app");