import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import vuetify from './plugins/vuetify'

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.component('VueDatePicker', VueDatePicker);
app.mount("#app");