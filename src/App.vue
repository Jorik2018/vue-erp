<template>
  <Unauthorized v-if="app.unauthorized" />
  <router-view v-else />
</template>

<script>
import axios from "axios";
import { ui } from "isobit-ui";
import { useRoute, useRouter } from "vue-router";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Network } from "@capacitor/network";
import { toastController } from "@ionic/vue";
import Unauthorized from "./Unauthorized.vue";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export default ui({
  components: {
    Unauthorized,
  },

  setup({ app }) {
    const router = useRouter();
    const route = useRoute();

    /*
     * ---------------------------------------------------------
     * Utilidades generales
     * ---------------------------------------------------------
     */

    app.BUILT_ON = import.meta.env.VITE_APP_BUILT_ON;
    app.VERSION = import.meta.env.VITE_APP_VERSION;

    app.getAge = (birthDate) => {
      const today = new Date();

      birthDate =
        typeof birthDate === "string" ||
          typeof birthDate === "number"
          ? new Date(birthDate)
          : birthDate;

      let age =
        today.getFullYear() -
        birthDate.getFullYear();

      const m =
        today.getMonth() -
        birthDate.getMonth();

      if (
        m < 0 ||
        (
          m === 0 &&
          today.getDate() < birthDate.getDate()
        )
      ) {
        age--;
      }

      return age;
    };

    app.tt = (a) => {
      if (!a.msg) {
        a.color = "green";
        return;
      }

      const tp = [
        "dia",
        "mes",
        "año",
      ];

      const tps = [
        "dias",
        "meses",
        "años",
      ];

      const aa = a.msg.split("|");
      let dd = [];

      const dp = aa[1].split("/");

      const pe = Math.abs(
        dp[2] * 10000 +
        dp[1] * 100 +
        dp[0] * 1
      );

      a.color =
        a.progress > 100
          ? "red"
          : pe > 300
            ? "green"
            : "yellow";

      dp.forEach((e, i) => {
        e = Math.abs(e);

        if (e > 0) {
          dd.push(
            e +
            " " +
            (e > 1 ? tps[i] : tp[i])
          );
        }
      });

      dd = dd.reverse();

      let ds = dd[0];

      dd.forEach((e, i) => {
        if (i > 0) {
          if (i === dd.length - 1) {
            ds += " y " + e;
          } else {
            ds += ", " + e;
          }
        }
      });

      if (a.progress > 100) {
        return (
          "Se paso " +
          ds +
          " desde " +
          aa[0].split(">")[1]
        );
      }

      if (pe === 0) {
        return "Ultimo dia";
      }

      return (
        "faltan " +
        ds +
        " para " +
        aa[0].split(">")[1]
      );
    };

    app.toast = async (msg, callback) => {
      const toast =
        await toastController.create({
          message: msg,
          duration: 4000,
        });

      await toast.present();

      if (callback) {
        callback();
      }
    };

    /*
     * ---------------------------------------------------------
     * Notificaciones
     * ---------------------------------------------------------
     */

    app.notify = async (o) => {
      const notifs =
        await LocalNotifications.schedule({
          notifications: [
            {
              title: o.title,
              body: o.body,
              id: 1,
              sound: "file://sound.mp3",
              attachments: null,
              actionTypeId: "",
              extra: null,
            },
          ],
        });

      app.notification.push(o);

      console.log(
        "scheduled notifications",
        notifs
      );
    };

    /*
     * ---------------------------------------------------------
     * OAuth callback
     * ---------------------------------------------------------
     */

    const processOAuthCallback = async () => {
      const code = route.query.code;
      const state = route.query.state;

      if (!code) {
        return false;
      }

      try {
        const context = JSON.parse(
          sessionStorage.getItem(
            "oauth-context"
          ) || "{}"
        );

        const provider = context.provider;

        const { data } = await axios.post(
          "/api/oauth/token",
          {
            code,
            state,
            provider,
          }
        );

        const {
          token,
          perms,
          user_nicename,
        } = data;

        sessionStorage.removeItem(
          "oauth-context"
        );

        app.connect({
          token,
          people: {
            display_name: user_nicename,
          },
          perms,
        });

        return true;

      } catch (e) {
        console.error(e);

        app.toast(
          "No fue posible completar la autenticación."
        );

        await router.replace({
          path: route.path,
          query: {},
        });

        return true;
      }
    };

    const initSession = async () => {
      const oauthProcessed =
        await processOAuthCallback();

      if (oauthProcessed) {
        return;
      }
      app.profileImg =
        app.session?.people?.urlPerfil ?? null;
    };

    Network.addListener(
      "networkStatusChange",
      app.networkStatusChange
    );

    Network.getStatus().then(
      app.networkStatusChange
    );

    /*
     * ---------------------------------------------------------
     * Inicialización
     * ---------------------------------------------------------
     */

    initSession();

    return {
      app,
    };
  },
});
</script>

<style>
@font-face {
  font-family: "PTSans";
  src:
    local("PTSans"),
    url(./cdn/fonts/ptsansnarrow-regular.ttf) format("truetype");
}
</style>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background,
      var(--ion-background-color, #fff));
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
  border-bottom: 1px solid var(--ion-background-color-step-150,
      #d7d8da);
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
  --background: rgba(var(--ion-color-primary-rgb),
      0.14);
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