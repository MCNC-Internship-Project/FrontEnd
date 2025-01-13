/**
 * @fileoverview Vue.js 설정 파일
 * @author 김원재 (kimwonjae@mcnc.co.kr)
 * @author 반명우 (banmyungwoo@mcnc.co.kr)
 * @date 2024-11-04
 * @lastModified 2024-12-05
 * @description 전역 설정 및 라이브러리 등록
 */


import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axiosInstance from "./utils/axiosInstance";

import vuetify from "./plugins/vuetify";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { createPinia } from 'pinia';

import "./assets/css/main.css";

import DefaultDialog from './components/common/DefaultDialog.vue';
import ConfirmDialog from "./components/common/ConfirmDialog.vue";
import ProgressDialog from "./components/common/ProgressDialog.vue";

// 모바일에서 URL 입력부분 제외한 화면 높이 계산
function setScreenSize() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener('load', setScreenSize);
window.addEventListener('resize', setScreenSize);

const app = createApp(App);
const pinia = createPinia();
app.config.globalProperties.$axios = axiosInstance;

app.use(router);
app.use(vuetify);
app.use(pinia);
app.component("VueDatePicker", VueDatePicker);
app.component("DefaultDialog", DefaultDialog);
app.component("ConfirmDialog", ConfirmDialog);
app.component("ProgressDialog", ProgressDialog);
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
app.mount("#app");