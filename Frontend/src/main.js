import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.vue'
import router from './router'

const app = createApp(App)

// const toast = createToast({
//   position: 'center',
//   timeout: 3000,
//   closeButton: false,
//   icon: false,
//   className: 'toast-modal',
// })

app.use(createPinia())
app.use(router)
//
app.use(Toast);

// Mount the app to the DOM
app.mount('#app')
