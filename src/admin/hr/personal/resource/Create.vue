<template>
  <v-page action="/api/hr/personal/resource" store="personal_resource" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    " v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Recurso'">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>Personal:</label>
      <div>
        <a href="#" @click.prevent="op">
          {{ o.dni || '---' }}: {{ o.apellidosNombres || '---' }}
        </a>
      </div>
      <label>Codigo Patrimonial:</label>
      <input v-model="o.codpatrimonio" />
      <label>Codigo:</label>
      <input v-model="o.codigo" />
      <label>Modelo:</label>
      <input v-model="o.modelo" />
      <label>Marca:</label>
      <input v-model="o.marca" />
      <label>Observaciones:</label>
      <input v-model="o.observaciones" />
      <label>Fecha Asignación:</label>
      <v-calendar v-model="o.fechaAsignacion" />
      <label>Fecha Devolución:</label>
      <v-calendar v-model="o.fechaDevolucion" />
    </div>

    <center>
      <v-button value="Grabar" icon="fa-save" v-on:click.prevent="save"></v-button>
    </center>
  </v-page>
</template>
<script>
import axios from 'axios'
import { ui } from 'isobit-ui'
import { onMounted, ref } from 'vue';

export default ui({
  props: ["id", "action"],
  setup({ id, action, app, router }) {
    const oRef = ref({});
    let o = oRef.value;
    const changeRoute = () => {
      if (action == "add") {
        if (app.connected)
          axios.get("/api/hr/personal/" + id)
            .then(({ data: { apellidosNombres, dni } }) => {
              o = { apellidosNombres, dni, personal: id };
              oRef.value = o;
            });
      } else if (id < 0) {
        me.getStoredList("emed").then((emeds) => {
          emeds.forEach((p) => {
            p.resources.forEach((v) => {
              if (v.tmpId == Math.abs(me.id)) {
                me.setStoredList("emed_resource", p.resources);
                me.o = v;
              }
            });
          });
        });
      } else if (Number(id)) {
        axios.get(`/api/hr/personal/resource/${id}`)
          .then(({ data }) => {
            oRef.value = data;
          });
      }
    }
    onMounted(() => {
      changeRoute();
    })
    const close = ({ data: { id, tmpId }, success }) => {
      if (success === true) {
        o = { ...o, id, tmpId }
      }
      oRef.value = o;
    }
    const op = (e) => {
      console.log(e);
      router.replace(`/admin/hr/personal/${oRef.value.personal}`);
    };
    return { o: oRef, close, op };
  },
  methods: {
    process(o) {
      if(o.id===0){
        delete o.id;
      }
      return o;
    },
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
              if (e2.tmpId == o.tmpId) e.resource[i] = o;
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
            e.resources = data;
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