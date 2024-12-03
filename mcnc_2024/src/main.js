import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import vuetify from "./plugins/vuetify";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { createPinia } from 'pinia';

import "./assets/css/main.css";

import DefaultDialog from './components/common/DefaultDialog.vue';
import ConfirmDialog from "./components/common/ConfirmDialog.vue";

function setScreenSize() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener('load', setScreenSize);
window.addEventListener('resize', setScreenSize);

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(vuetify);
app.use(pinia);
app.component("VueDatePicker", VueDatePicker);
app.component("DefaultDialog", DefaultDialog);
app.component("ConfirmDialog", ConfirmDialog);
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
app.mount("#app");