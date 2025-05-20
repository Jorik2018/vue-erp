<template>
  <v-page action="/api/desarrollo-social/attention" :header="(o.id ? 'Editar' : 'Crear') + '  Registro Attention'"
    :class="o.id < 0 || (o.tmpId && !o.synchronized)
      ? 'yellow'
      : o.tmpId
        ? 'green'
        : ''
      " store="adulto-mayor">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <v-fieldset v-if="o.people" legend="I. Datos generales" class="v-form">
        <label>Documento:</label>
        <div>{{ o.people.documento_tipo }} - {{ o.people.documento_nro }}</div>
        <label>Apellidos y Nombres:</label>
        <a :href="'/admin/desarrollo-social/people/' + o.persona_id + '#'"
          @click.prevent="open('/admin/desarrollo-social/people/' + o.persona_id)">

          <div>{{ o.people.ape_paterno }} {{ o.people.ape_materno }} {{ o.people.nombres }}</div>
        </a>
      </v-fieldset>

      <label>Codigo_Unico:</label>
      <v-number v-model="o.codigo_unico" />
      <label>Cita:</label>
      <v-number v-model="o.id_cita" />
      <label>Fecha Atencion:</label>
      <v-calendar v-model="o.fecha_atencion" />
      <label>Codigo Item:</label>
      <v-number v-model="o.codigo_item" />
      <label>Correlativo Item:</label>
      <v-number v-model="o.id_correlativo_item" />
      <label>Valor Lab:</label>
      <v-number v-model="o.valor_lab" />
      <label>Correlativo Lab:</label>
      <v-number v-model="o.id_correlativo_lab" />
      <label>Peso:</label>
      <v-number v-model="o.peso" />
      <label>Talla:</label>
      <v-number v-model="o.talla" />
      <label>Hemoglobina:</label>
      <v-number decimal="3" v-model="o.hemoglobina" />
      <v-fieldset legend="Coordenadas" style="word-break: break-all;">
        <div v-if="o.lat" class="center">
          ({{ o.lat }}, {{ o.lon }})
        </div>
        <div class="alert yellow" v-if="!o.lat">
          No se pudo obtener las coordenadas actuales
        </div>
        <div class="right" style="margin-top:10px">
          <v-button icon="fa-compass" value="Obtener coordenadas actuales" @click.prevent="getCoordinates" />
        </div>
      </v-fieldset>
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
    </center>
  </v-page>
</template>
<script>
import { ui } from 'isobit-ui'
import { ref } from 'vue'
import axios from 'axios'
import VSketcher from '@/components/v-sketcher.vue';
import { Geolocation } from "@capacitor/geolocation";
export default ui({
  props: ["people", "id"],
  components: {
    VSketcher,
  },
  setup({ router, id }) {
    const o = ref({});
    const getCoordinates = () => {
      Geolocation.getCurrentPosition().then(({ coords }) => {
        if (coords) {
          const { latitude: lat, longitude: lon } = coords;
          o.value = { ...o.value, lat, lon }
        }
      })
    }
    const close = ({ success, data }) => {
      let _o = o.value;
      if (success === true) {
        _o = { ..._o, id: data.id, tmpId: data.tmpId };
        if (data.uploaded) {
          delete _o.tempFile;
        }
      }
      o.value = _o;
      const nid = _o.tmpId ? -_o.tmpId : _o.id;
      if (id != nid) {
        //router.replace("/admin/desarrollo-social/adulto-mayor/" + nid);
      }
    }
    return { o, close, getCoordinates }
  },
  data() {
    return {
      count: 0,
      red: [],
      age: null,
      tipo_seguro_medico: [
        "SIS", "ESSALUD", "PRIVADA", "NINGUNA"
      ]
    };
  },
  mounted() {
    this.changeRoute();
  },
  methods: {
    process({ people, ...o }) {
      return o;
    },
    validateInput() {
      // Only keep digits and limit to 8 characters
      if (this.o.dni)
        this.o.dni = this.o.dni.replace(/\D/g, '').slice(0, 8);
    },
    inputEdad(e) {
      this.o.edad = this.o.fecha_nacimiento ? this.app.getAge(this.o.fecha_nacimiento) : null;
    },
    async changeRoute() {
      const me = this, id = me.id, people = me.people;
      if (id < 0) {
        me.getStoredList("adulto-mayor").then((adultomayor) => {
          adultomayor.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              me.o = e;
            }
          });
        });
      } else if (Number(id)) {
        axios.get("/api/desarrollo-social/attention/" + id)
          .then(({ data }) => {
            this.o = data;
            axios.get("/api/desarrollo-social/people/" + data.persona_id)
              .then(({ data }) => {
                this.o.people = data;
              });
          });
      } else if (Number(people)) {
        axios.get("/api/desarrollo-social/people/" + people)
          .then(({ data }) => {
            this.o.people = data;
            this.o.persona_id = people;
          });
      }
    }
  },
});
</script>