<template>
  <v-form
    action="/api/desarrollo-social/emed/resource"
    store="emed_resource"
    :class="
      o.id < 0 || (o.tmpId && !o.synchronized)
        ? 'yellow'
        : o.tmpId
        ? 'green'
        : ''
    "
    v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Recurso'"
  >
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>EMED:</label>
      <div>{{ pad(o.emed || 0, 4) }}</div>
      <label>Red:</label>
        <v-select
          v-model="o.emergencyRed"
          autoload="false"
          ref="emergencyRed"
          v-on:input="
            $refs.emer_microred.load({ code: o.emergencyRed })
          "
        >
          <option>Select One...</option>
          <v-options store="red" display-field="name" value-field="code" />
        </v-select>
        <label>Microred:</label>
      <v-select
        autoload="false"
        :disabled="!o.emergencyRed"
        store="microred"
        ref="emer_microred"
        v-model="o.microred"
        :required="true"
        @input="$refs.emer_establishment.load({ microredCode:'02'+ o.microred,type:1  })"
      >
        <option>Select One...</option>
        <v-options store="microred" display-field="name" value-field="code" />
      </v-select>
        <label>IPRESS:</label>
        <v-select
          ref="emer_establishment"
          v-model="o.ipress"
          :autoload="true"
          :disabled="!o.microred"
        >
          <option>Select One...</option>
          <v-options
            store="establishment"
            display-field="name"
            value-field="code"
          />
        </v-select>
      <label>N° Ambulancias:</label>
      <v-number v-model="o.ambulancias"/>
      <label>N° Personal de salud:</label>
      <v-number v-model="o.personal"/>
      <label>N° Brigadistas de salud:</label>
      <v-number v-model="o.brigadistas"/>
      <label>N° Equipo tecnico EMED:</label>
      <v-number v-model="o.equipoTecnicoEMED"/>
    </div>
    <center>
      <v-button
        value="Grabar"
        icon="fa-save"
        v-on:click.prevent="save"
      ></v-button>
    </center>
  </v-form>
</template>
<script>
import { Geolocation } from "@capacitor/geolocation";
let {_,axios} = window;
export default _.ui({
  props: ["id", "action"],
  data() {
    return {
      type: [
        {
          id: "P",
          name: "SALUD INDIVIDUAL",
          decription:
            "Comprende los paquetes de atención integral por etapas de vida",
        },
        {
          id: "F",
          name: "FUNCIONES DE LA FAMILIA",
          decription:
            "Comprende las funciones básicas: cuidado, afecto, expresi�n de sexualidad, socializaci�n estatus social y las funciones seg�n seg�n sus relaciones internas: comunicaci�n, cohesi�n, permeabilidad, rol, adaptabilidad y armon�a)",
        },
        {
          id: "V",
          name: "CODICIONES MATERIALES DE VIDA Y ENTORNO",
          decription:
            "Comprende las caracteristicas de la vivienda, eliminaci�n de excretas, tenencia de animales, aguas estancadas, vectores, pandillaje y otros alrededor de la vivienda",
        },
      ],
      trayLocation: null,
      o: { emedId: null,number:null, lat: null, lon: null, type: null, ext: {} },
    };
  },
  methods: {
    render() {
      let me = this,
        id = me.id,
        action = me.action;
      me.trayLocation = 0;
      if (Number(id)) {
        if (action == "add") {
          me.o = { emedId: id, ext: {}, lat: null, lon: null ,number:null};
          if(me.app.connected)
          axios
            .get(
              "/api/desarrollo-social/emed/" + id + "/resource/number"
            )
            .then((result) => {
              me.o.number = result.data;
            });
          me.filters.emedId = id;
        } else {
          if (id < 0) {
            me.getStoredList("emed").then((emeds) => {
              emeds.forEach((p) => {
                p.resources.forEach((v) => {
                  if (v.tmpId == Math.abs(me.id)) {
                    me.setStoredList("emed_resource", p.resources);
                    if (!v.lat) v.lat = null;
                    if (!v.lon) v.lon = null;
                    me.o = v;
                  }
                });
              });
            });
          } else
            axios
              .get("/api/desarrollo-social/emed/resource/" + id)
              .then(function (response) {
                me.filters.emedId = response.data.emedId;
                me.o = response.data;
              });
        }
      } else if (action == "add") {
        me.o = { emedId: id, log: null, lat: null, ext: {} };
        me.filters.emedId = id;
        axios
          .get("/api/desarrollo-social/emed/" + id + "/resource/number")
          .then((result) => {
            me.o.number = result.data;
          });
      }
    },
    process(o) {
      if (!this.trayLocation && !(o.id && o.lat)) {
        this.MsgBox("Debe tratar de obtener la geolocalización.");
        return false;
      }
      return o;
    },
    async printCurrentPosition() {
      this.trayLocation = 1;
      const coordinates = await Geolocation.getCurrentPosition();
      let c = coordinates.coords;
      this.o.lat = c.latitude;
      this.o.lon = c.longitude;
    },
    close(r) {
      let me = this;
      if (r.success === true) {
        me.o.id = r.data.id;
        me.o.tmpId = r.data.tmpId;
      }
      me.$router.back();
    },
  },
  created() {
    let me = this;
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
    });
  },
  mounted() {
    let me=this;
    if (me.$children[0]) me.app.title = me.$children[0].header;
    me.render();
  },
});
</script>