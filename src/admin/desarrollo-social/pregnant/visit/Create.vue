<template>
  <v-page action="/api/desarrollo-social/pregnant/visit" store="pregnant_visit" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    " v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Visita'">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>Gestante:</label>
      <div>{{ pad(o.pregnantId || 0, 4) }}</div>
      <label>Numbero:</label>
      <div>{{ pad(o.number || 0, 2) }}</div>
      <label>Fecha:</label>
      <v-calendar v-model="o.fechaVisita"></v-calendar>
      <label>Fecha Prox. Visita:</label>
      <v-calendar v-model="o.fechaProxVisita"></v-calendar>
      <label>Detalle:</label>
      <v-textarea v-model="o.detalle"></v-textarea>
      <v-fieldset legend="Coordenadas" style="width: auto">
        <div class="right">
          <v-button icon="fa-compass" value="Obtener Geolocalización" v-on:click="getCurrentPosition" />
        </div>
        <div class="center" v-if="(o.lat && o.lat != 0) || (o.lon && o.lon != 0) || trayLocation" style="
            margin-top: 10px;
            border: 1px solid #ffcf00;
            background-color: #ffff80;
            padding: 10px;
          ">
          ({{ o.lat }},{{ o.lon }})
        </div>
      </v-fieldset>
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" v-on:click.prevent="save"></v-button>
    </center>
  </v-page>
</template>
<script>
import { Geolocation } from "@capacitor/geolocation";
import { ui, date } from 'isobit-ui'
import { onMounted, nextTick, ref } from 'vue';
import axios from 'axios'

export default ui({
  props: ["id", "action"],
  setup({ id, action, router, app }) {
    const oRef = ref({ ext: {} });
    const trayLocation = ref(null);
    const changeRoute = () => {
      trayLocation.value = 0;
      let o = oRef.value;
      if (Number(id)) {
        if (action == "add") {
          o = { ...o, pregnantId: id, ext: {}, lat: null, lon: null, number: null };
          console.log(app)
          if (app.connected)
            axios.get(
              `/api/desarrollo-social/pregnant/${id}/visit/number`
            ).then(({ data }) => {
              o.number = data;
              oRef.value = o;
            });
          //me.filters.pregnantId = id;
        } else {
          if (id < 0) {
            me.getStoredList("pregnant").then((pregnants) => {
              pregnants.forEach((p) => {
                p.visits.forEach((v) => {
                  if (v.tmpId == Math.abs(me.id)) {
                    me.setStoredList("pregnant_visit", p.visits);
                    if (!v.lat) v.lat = null;
                    if (!v.lon) v.lon = null;
                    me.o = v;
                  }
                });
              });
            });
          } else
            axios
              .get("/api/desarrollo-social/pregnant/visit/" + id)
              .then(({ data }) => {
                //me.filters.pregnantId = response.data.pregnantId;
                o = { ...o, ...data };
                oRef.value = o;
              });
        }
      } else if (action == "add") {
        o = { ...o, pregnantId: id, log: null, lat: null, ext: {} };
        //me.filters.pregnantId = id;
        axios
          .get("/api/desarrollo-social/pregnant/" + id + "/visit/number")
          .then((result) => {
            o.number = result.data;
            oRef.value = o;
          });
      }
    }
    onMounted(() => {
      changeRoute();
    })
    const getCurrentPosition = () => {
      tryLocation.value = 1;
      Geolocation.getCurrentPosition().then(({ coords: { latitude, longitude } }) => {
        let o = oRef.value;
        o.lat = latitude;
        o.lon = longitude;
        oRef.value = o;
      });
    }
    const close = ({ data: { id, tmpId, uploaded }, success }) => {
      let o = oRef.value;
      const _id = o.id;
      if (success === true) {
        o = { ...o, id, tmpId }
      }
      router.back();
    }
    return {
      open, o: oRef,
      trayLocation, close, getCurrentPosition
    }
  },
  methods: {
    process(o) {
      if (!this.trayLocation && !(o.id && o.lat)) {
        this.MsgBox("Debe tratar de obtener la geolocalización.");
        return false;
      }
      return o;
    }
  },
  created() {
    /*let me = this;
    this.$on("sync", (data, o) => {
      me.getStoredList("pregnant").then((pregnants) => {
        pregnants.forEach((e) => {
          if (
            (o.pregnantId < 0 && e.tmpId == Math.abs(o.pregnantId)) ||
            e.id == o.pregnantId
          ) {
            e.agreements.forEach((e2, i) => {
              if (e2.tmpId == o.tmpId) e.visit[i] = o;
            });
            window._.db
              .transaction(["pregnant"], "readwrite")
              .objectStore("pregnant")
              .put(e);
          }
        });
      });
    });
    this.$on("stored", (o, data) => {
      me.getStoredList("pregnant").then((pregnants) => {
        pregnants.forEach((e) => {
          if (
            (o.pregnantId < 0 && e.tmpId == Math.abs(o.pregnantId)) ||
            e.id == o.pregnantId
          ) {
            e.visits = data;
            delete e.synchronized;
            window._.db
              .transaction(["pregnant"], "readwrite")
              .objectStore("pregnant")
              .put(e);
          }
        });
      });
    });*/
  }
});
</script>