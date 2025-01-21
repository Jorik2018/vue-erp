import './assets/main.css'
import 'isobit-ui/dist/theme.css'
import '@ionic/core/css/ionic.bundle.css';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { IonicVue } from '@ionic/vue';
import App from './App.vue'
import router from './router'
import { IsobitUI } from 'isobit-ui'

const app = createApp(App) as any;
app.config.ignoredElements = [/^ion-/, /^v-/];
app.config.productionTip = false;
app.use(createPinia())
app.use(router)
app.use(IsobitUI)
app.use(IonicVue)
app.mount('#app')
