<template>
  <v-page action="/api/desarrollo-social/attention" :header="(o.id ? 'Editar' : 'Crear') + '  Registro Attention'"
    :class="o.id < 0 || (o.tmpId && !o.synchronized)
      ? 'yellow'
      : o.tmpId
        ? 'green'
        : ''
      " store="attention">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <v-fieldset v-if="o.people" legend="Información personal" class="v-form">
        <label>Documento:</label>
        <div>{{ o.people.documento_tipo }} - {{ o.people.documento_nro }}</div>
        <label>Apellidos y Nombres:</label>
        <a :href="'/admin/desarrollo-social/people/' + o.persona_id + '#'"
          @click.prevent="open('/admin/desarrollo-social/people/' + o.persona_id)">

          <div>{{ o.people.ape_paterno }} {{ o.people.ape_materno }} {{ o.people.nombres }}</div>
        </a>
      </v-fieldset>
      <label>Red:</label>
      <v-select v-model="o.red" autoload="true" required="required" ref="red" v-on:input="
        $refs.microred.load({ code: o.red })
        ">
        <option value="">Select One...</option>
        <v-options store="red" display-field="name" value-field="code" />
      </v-select>
      <label>Microred:</label>
      <v-select autoload="false" :disabled="!o.red" store="microred" ref="microred" v-model="o.microred"
        :required="true" @input="$refs.establishment.load({ microredCode: /*'02' +*/ o.microred, type: 1 })">
        <option value="">Select One...</option>
        <v-options store="microred" display-field="name" value-field="code" />
      </v-select>
      <label>IPRESS:</label>
      <v-select ref="establishment" v-model="o.codigo_unico" :autoload="false" :disabled="!o.microred">
        <option value="">Select One...</option>
        <v-options store="establishment" display-field="name" value-field="code" />
      </v-select>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import VSketcher from '@/components/v-sketcher.vue';
import { Geolocation } from "@capacitor/geolocation";
export default ui({
  props: ["people", "id"],
  components: {
    VSketcher,
  },
  setup({ router, getStoredList, id, people }) {
    const oRef = ref({});
    const getCoordinates = () => {
      Geolocation.getCurrentPosition().then(({ coords }) => {
        if (coords) {
          const { latitude: lat, longitude: lon } = coords;
          oRef.value = { ...oRef.value, lat, lon }
        }
      })
    }
    const loadIPRESS = () => {
      let s = localStorage.getItem("setting");
      if (s) {
        s = JSON.parse(s);
        let o = oRef.value;
        if (s.red) o.red = s.red;
        if (s.microred) o.microred = s.microred;
        if (s.establishment) o.codigo_unico = s.establishment;
        oRef.value = { ...o };
      }
    }
    const changeRoute = () => {
      const o = oRef.value;
      if (id < 0) {
        getStoredList("adulto-mayor").then((adultomayor) => {
          adultomayor.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              oRef.value = { ...e };
            }
          });
        });
      } else if (Number(id)) {
        axios.get("/api/desarrollo-social/attention/" + id)
          .then(({ data }) => {
            oRef.value = { ...data };
          });
      } else {
        if (Number(people)) {
          axios.get("/api/desarrollo-social/people/" + people)
            .then(({ data }) => {

              o.people = data;
              o.persona_id = people;
              oRef.value = { ...o };
              loadIPRESS()
            });
        } else
          loadIPRESS()
      }
    }
    onMounted(() => {
      changeRoute();
    })
    const close = ({ success, data }) => {
      let _o = oRef.value;
      if (success === true) {
        _o = { ..._o, id: data.id, tmpId: data.tmpId };
        if (data.uploaded) {
          delete _o.tempFile;
        }
      }
      oRef.value = _o;
      const nid = _o.tmpId ? -_o.tmpId : _o.id;
      if (id != nid) {
        router.replace("/admin/desarrollo-social/attention/" + nid + '/edit');
      }
    }
    return { o: oRef, close, getCoordinates }
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
  methods: {
    process({ people, microred, red, ...o }) {
      return o;
    },
    validateInput() {
      // Only keep digits and limit to 8 characters
      if (this.o.dni)
        this.o.dni = this.o.dni.replace(/\D/g, '').slice(0, 8);
    },
    inputEdad(e) {
      this.o.edad = this.o.fecha_nacimiento ? this.app.getAge(this.o.fecha_nacimiento) : null;
    }
  },
});
</script>