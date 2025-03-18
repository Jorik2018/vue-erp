<template>
  <v-page action="/api/desarrollo-social/emed/damage-salud" store="emed_damage_salud" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    " v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Daño Salud'" @mm="mm">
    <div class="v-form" style="flex:1">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>EMED:</label>
      <div>{{ pad(o.emedId || 0, 4) }}</div>
      <label>DNI:</label>
      <v-number class="center" v-model="o.code" />
      <label>Apellidos y Nombres:</label>
      <input maxlength="100" v-model="o.nombre_completo" />
      <label>Edad:</label>
      <input v-model="o.edad" />
      <label>Diagnóstico:</label>
      <v-textarea v-model="o.diagnostico" />
      <label>Gravedad:</label>
      <v-select v-model="o.gravedad" required="required">
        <option value="">Select One...</option>
        <option v-for="type in ['LEVE', 'MODERADO', 'GRAVE', 'FALLECIDO']" :key="type" :value="type">
          {{ type }}
        </option>
      </v-select>
      <label>Situación:</label>
      <v-select v-model="o.situacion" required="required">
        <option value="">Select One...</option>
        <option
          v-for="type in ['ALTA', 'HOSPITALIZADO', 'REFERIDO', 'FALLECIDO', 'DESAPARECIDO', 'EN OBSERVACION', 'PARA EVALUAR']"
          :key="type" :value="type">
          {{ type }}
        </option>
      </v-select>
      <label>Observación:</label>
      <v-textarea v-model="o.observacion" @sync="mm" />
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" v-on:click.prevent="save"></v-button>
    </center>
  </v-page>
</template>
<script>
import { ui, db } from 'isobit-ui'
import { ref } from 'vue'
import axios from 'axios'
export default ui({
  props: ["id", "action"],
  setup({ $on, router, getStoredList }) {
    const o = ref({});
    $on('sync', (_data, o) => {
      getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if ((o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) || e.id == o.emedId) {
            e.agreements.forEach((e2, i) => {
              if (e2.tmpId == o.tmpId)
                e.damage_salud[i] = o;
            });
            db()
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
    $on('stored', (o, data) => {
      getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (
            (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
            e.id == o.emedId
          ) {
            e.damage_salud = data;
            delete e.synchronized;
            db()
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
    render() {
      let me = this,
        id = me.id,
        action = me.action;
      if (Number(id)) {
        if (action == "add") {
          me.o = { emedId: id };
          me.filters.emed = id;
        } else {
          if (id < 0) {
            me.getStoredList("emed").then((emeds) => {
              emeds.forEach((p) => {
                p.damage_salud.forEach((v) => {
                  if (v.tmpId == Math.abs(me.id)) {
                    me.setStoredList("emed_damage_salud", p.damage_salud);
                    if (!v.lat) v.lat = null;
                    if (!v.lon) v.lon = null;
                    me.o = v;
                  }
                });
              });
            });
          } else
            axios
              .get("/api/desarrollo-social/emed/damage-salud/" + id)
              .then(function (response) {
                me.filters.emed = response.data.emedId;
                me.o = response.data;
              });
        }
      } else if (action == "add") {
        me.o = { emedId: id };
        me.filters.emed = id;
      }
    },
  },
  mounted() {
    let me = this;
    //if (me.$children[0]) me.app.title = me.$children[0].header;
    me.render();
  },
});
</script>