import 'isobit-ui/dist/theme.css'
import { createApp, h, useAttrs } from 'vue'
import { createPinia } from 'pinia'
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import { IonicVue } from '@ionic/vue';
import "ol/ol.css";
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import '@ionic/vue/css/palettes/dark.system.css';
import './theme/variables.css';
import { IsobitUI, initDB, VForm } from 'isobit-ui'
import { IonPage } from '@ionic/vue';
import App from './App.vue'
import router from './router';
import i18n from './i18n';
import { setupApp } from 'isobit-ui';
import axios from 'axios';

const app = createApp(App) as any;
const pinia = createPinia();
setupApp({ pinia, axios, router });
app.config.ignoredElements = [/^ion-/, /^v-/, 'center'];
app.config.productionTip = false;
app
  .use(pinia)
  .use(IonicVue)
  .use(router)
  .use(i18n)
  .component('ion-page', IonPage)
  /*.component('center', {
    setup(_props, { slots }) {
      return () =>
          h(VForm, slots.default ? slots.default : [])
    }
  })*/
  .component('v-page', {
    setup(_props, { slots }) {
      const attrs = useAttrs();
      return () =>
        h(IonPage, {}, () => [
          h(VForm, { ...attrs }, slots.default ? slots.default : [])
        ]);
    }
  })
  .use(IsobitUI);

router.isReady().then(() => {
  initDB(20, [
    ["region", { keyPath: "id" }, "/api/directory/region/0/0"],
    ["province", { keyPath: "code" }, "/api/directory/province/0/0"],
    ["district", { keyPath: "code" }, "/api/directory/district/0/0"],
    ["town", { keyPath: "id" }, "/api/directory/town/0/0", "district"],
    ["sample", { keyPath: "id" }],
    ["pool", { keyPath: "tmpId" }],
    ["people", { keyPath: "tmpId" }],
    ["pregnant", { keyPath: "tmpId" }],
    ["vea-materno", { keyPath: "tmpId" }],
    ["pregnant_visit", { keyPath: "tmpId" }],
    ["agreement", { keyPath: "tmpId" }],
    ["red", { keyPath: "code" }, "/api/desarrollo-social/red/0/0"],
    ["microred", { keyPath: "ID" }, "/api/desarrollo-social/microred/0/0"],
    ["establishment", { keyPath: "code" }, "/api/desarrollo-social/establishment/0/0"],
    ["setting", { keyPath: "code" }],
    ["cie", { keyPath: "code" }, "/api/desarrollo-social/cie/0/0"],
    ["emed", { keyPath: "tmpId" }],
    ["emed_action", { keyPath: "tmpId" }],
    ["emed_damage_ipress", { keyPath: "tmpId" }],
    ["emed_damage_salud", { keyPath: "tmpId" }],
    ["emed_file", { keyPath: "tmpId" }],
    ["cancer", { keyPath: "tmpId" }]
  ]).then(() => {
    app.mount('#app');
  }).catch((e) => {
    console.log(e)
  });
});

