<template>
  <v-page action="/api/hr/personal/service" store="personal_service" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    " v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Servicio'">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>DNI:</label>
      <div>{{ o.dni || '---' }}</div>
      <label>Apellidos y nombres:</label>
      <div>{{ o.apellidosNombres || '---' }}</div>
      <label>Usuario de Red:</label>
      <input v-model="o.usuarioDeRed" />
      <label>Correo Institucional:</label>
      <input v-model="o.correoInstitucional" />
      <label>Correo de Grupo:</label>
      <input v-model="o.correoDeGrupo" />
      <label>Numero Celular:</label>
      <input v-model="o.numeroCelular" />
      <label>Numero Anexo:</label>
      <input v-model="o.numeroAnexo" />
      <label>Otros Recursos:</label>
      <v-textarea v-model="o.otrosRecursos" />
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" @click.prevent="save"></v-button>
    </center>
  </v-page>
</template>
<script>
import { ui } from 'isobit-ui'
import axios from 'axios'
import { onMounted, ref } from 'vue';

export default ui({
  props: ["id", "action"],
  data() {
    return {
      o: {},
    };
  },
  setup({ id, action, app }) {
    const oRef = ref({});
    const changeRoute = () => {
      let o = oRef.value;
      if (action == "add") {
        if (app.connected)
          axios.get("/api/hr/personal/" + id)
            .then(({ data: { apellidosNombres, dni } }) => {
              o = { apellidosNombres, dni };
              oRef.value = o;
            });
      } else if (id < 0) {
        me.getStoredList("personal").then((personal) => {
          personal.forEach((e) => {
            if (e.tmpId == Math.abs(id)) {
              me.o = e;
            }
          });
        });
      } else if (Number(id)) {
        axios.get( `/api/hr/personal/service/${id}`)
          .then(({ data }) => {
            oRef.value = data;
          });
      }
    }
    onMounted(() => {
      changeRoute();
    })
    const close = ({ data: { id, tmpId }, success }) => {
      let o = oRef.value;
      if (success === true) {
        o = { ...o, id, tmpId }
      }
      oRef.value = o;
    }
    return { o: oRef, close };
  },
  created() {
    let me = this;
    /*
    this.$on("sync", (data, o) => {
      me.getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (
            (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
            e.id == o.emedId
          ) {
            e.agreements.forEach((e2, i) => {
              if (e2.tmpId == o.tmpId) e.damage_ipress[i] = o;
            });
            window._.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
    this.$on("stored", (o, data) => {
      me.getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (
            (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
            e.id == o.emedId
          ) {
            e.damage_ipress = data;
            delete e.synchronized;
            window._.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });*/
  }
});
</script>