<template>
  <router-view></router-view>
</template>
<script lang="ts">
import axios from "axios";
import { ui, initDB } from "isobit-ui";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Network } from "@capacitor/network";
import { toastController } from '@ionic/vue';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
export default ui({
  data() {
    return {
      counter: 0,
    }
  },
  created() {
    const me = this;
    const session = me.session;
    if (session.token) {
      axios.defaults.headers.common = {
        Authorization:
          `Bearer ` + (session.token ? session.token : session.uid),
      };
      me.profileImg = session.people ? session.people.urlPerfil : null;
      if (me.$router.currentRoute.value.fullPath == '/') {
        me.$router.push("/admin");
      }
      console.log('me.$router.currentRoute.value.fullPath', me.$router.currentRoute.value.fullPath);
    } else if (me.$router.currentRoute.value.fullPath.startsWith('/admin')) {
      //console.log('me.$router', me.$router.currentRoute.value.fullPath)
      me.$router.push("/login");
    }

    const networkStatusChange = (status) => {
      me.app2.networkStatus = status;
    };
    Network.addListener("networkStatusChange", networkStatusChange);
    Network.getStatus().then(networkStatusChange);
    me.app.connect = this.connect;
    me.app.logout = () => {
      me.session = null;
      localStorage.removeItem('session');
      //this.$router.push('/login');
      me.$router.push('/');
    };
    me.app.toast = (msg) => {
      toastController.create({
        message: msg,
        duration: 4000,
      }).then(toast => {
        toast.present();
      });
    }
    initDB(15, [
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
    ]);
  },
  mounted() {
    const me = this;

  },
  methods: {

    connect() {
      const me = this as any, session = me.session;
      if (session != null) {
        const ws = new WebSocket("wss://web.regionancash.gob.pe/ws/S" + session.uid);
        ws.onopen = function () {
          // subscribe to some channels
          //ws.send(JSON.stringify({
          //.... some message the I must send when I connect ....
          //}));
        };
        ws.onmessage = function (e) {
          me.notify({ body: e.data.msg ? e.data.msg : e.data, title: 'SHAMI APP' });
        };
        ws.onclose = function (e) {
          console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
          setTimeout(function () {
            me.connect();
          }, 5000);
        };
        ws.onerror = function (err: any) {
          console.error('Socket encountered error: ', err.message, 'Closing socket');
          ws.close();
        };
        me.ws = ws;
      }
    },
    async notify(o: any) {
      const notifs = await LocalNotifications.schedule({
        notifications: [
          {
            title: o.title,
            body: o.body,
            id: 1,
            /*schedule: { at: new Date(Date.now() + 1000 * 5) },*/
            sound: 'file://sound.mp3',
            attachments: null,
            actionTypeId: '',
            extra: null
          }
        ]
      });
      this.notification.push(o);
      console.log('scheduled notifications', notifs);
    },
  }
})
</script>
