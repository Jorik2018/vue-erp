<template>
  <v-page action="/api/desarrollo-social/emed/action" store="emed_action" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    " v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Acción'">
    <div class="v-form" style="flex:1">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>EMED:</label>
      <div>{{ pad(o.emedId || 0, 4) }}</div>
      <label>Fecha:</label>
      <v-calendar v-model="o.fecha" required />
      <label>Hora:</label>
      <v-calendar type="time" v-model="o.hora" required />
      <label>Descripción:</label>
      <v-textarea v-model="o.descripcion" />
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" v-on:click.prevent="save"></v-button>
    </center>
  </v-page>
</template>
<script>
import { ui } from 'isobit-ui'
import { ref } from 'vue'
import axios from 'axios'
export default ui({
  props: ["id", "action"],
  setup({ $on, router, getStoredList }) {
    const o = ref({ emedId: null, type: null });
    $on("sync", (data, o) => {
      getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (
            (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
            e.id == o.emedId
          ) {
            e.action.forEach((e2, i) => {
              if (e2.tmpId == o.tmpId) e.action[i] = o;
            });
            _.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
    $on("stored", (o, data) => {
      getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (
            (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
            e.id == o.emedId
          ) {
            e.action = data;
            delete e.synchronized;
            _.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
    const close = ({ success, data }) => {
      if (success === true) {
        o.value = { ...o.value, id: data.id, tmpId: data.tmpId };
      }
      router.back();
    }
    return { close, o };
  },
  methods: {
    changeRoute() {
      let me = this,
        id = me.id,
        action = me.action;
      if (Number(id)) {
        if (action == "add") {
          me.o = { emedId: id };
        } else {
          if (id < 0) {
            me.getStoredList("emed").then((emeds) => {
              emeds.forEach((p) => {
                p.action.forEach((v) => {
                  if (v.tmpId == Math.abs(me.id)) {
                    me.setStoredList("emed_action", p.actions);
                    me.o = v;
                  }
                });
              });
            });
          } else
            axios
              .get("/api/desarrollo-social/emed/action/" + id)
              .then(function (response) {
                me.filters.emedId = response.data.emedId;
                me.o = response.data;
              });
        }
      } else if (action == "add") {
        me.o = { emedId: id };
      }
    }
  },
  mounted() {
    let me = this;
    //if (me.$children[0]) me.app.title = me.$children[0].header;
    me.changeRoute();
  },
});
</script>