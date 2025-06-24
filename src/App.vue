<template>
  <Unauthorized v-if="app.unauthorized" />
  <router-view v-else />
</template>
<script>
import axios from "axios";
import { ui } from "isobit-ui";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Network } from "@capacitor/network";
import { toastController } from '@ionic/vue';
import Unauthorized from './Unauthorized.vue';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export default ui({
  components: { Unauthorized },
  created() {
    const me = this;
    const session = me.session;
    if (session?.token) {
      axios.defaults.headers.common = {
        Authorization:
          `Bearer ` + (session.token ? session.token : session.uid),
      };
      me.profileImg = session.people ? session.people.urlPerfil : null;
      //if (me.$router.currentRoute.value.fullPath == '/') {
      //me.$router.push("/admin");
      //}
      //console.log('me.$router.currentRoute.value.fullPath', me.$router.currentRoute.value.fullPath);
    } else if (me.$router.currentRoute.value.fullPath.startsWith('/admin')) {
      //console.log('me.$router', me.$router.currentRoute.value.fullPath)
      me.$router.push("/login");
    }
    Network.addListener("networkStatusChange", me.app.networkStatusChange);
    Network.getStatus().then(me.app.networkStatusChange);
    me.app.getAge = (birthDate) => {
      const today = new Date();
      birthDate = typeof birthDate == 'string' || typeof birthDate == 'number' ? new Date(birthDate) : birthDate;
      //console.log(birthDate);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    me.app.toast = (msg, callback) => {
      toastController.create({
        message: msg,
        duration: 4000,
      }).then(toast => {
        toast.present().then(() => {
          if (callback) callback();
        });
      });
    }
  },
  methods: {
    /*connect() {
      const me = this, session = me.session;
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
        ws.onerror = function (err) {
          console.error('Socket encountered error: ', err.message, 'Closing socket');
          ws.close();
        };
        me.ws = ws;
      }
    },*/
    async notify(o) {
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

<style>
@font-face {
  font-family: "PTSans";
  src: local("PTSans"),
    url(./cdn/fonts/ptsansnarrow-regular.ttf) format("truetype");
}
</style>
<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-background-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>