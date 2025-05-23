<template>
  <v-page action="/api/desarrollo-social/people" :header="(o.id ? 'Editar' : 'Crear') + '  Registro Persona'" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    " store="people">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>




      <label>Nacionalidad:</label>
      <input v-model="o.nacionalidad" v-uppercase required maxlength="50" />

      <v-fieldset legend="Ubigeo" class="v-form">
        <label>Región:</label>
        <div>ANCASH</div>
        <label>Provincia:</label>
        <v-select ref="province" :autoload="false" storage="province_selected" v-model="o.province"
          @input="$refs.district.load({ code: o.province })">
          <option value="">Select One...</option>
          <v-options store="province" display-field="name" value-field="code" />
        </v-select>

        <label>Distrito:</label>
        <v-select ref="district" :autoload="false" store="district_selected" :disabled="!o.province" v-model="o.ubigeo"
          @input="$refs.cpSelect.load({ id: o.ubigeo })">
          <option value="">Select One...</option>
          <v-options name="district" store="district" value-field="code" display-field="name" />
        </v-select>

        <label>Centro Poblado:</label>
        <v-select :autoload="false" :label="o.districtName ? o.districtName : '---'" :disabled="!o.ubigeo"
          ref="cpSelect" v-model="o.ubigeo_ccpp" @input="inputCCPP">
          <option value="">Seleccionar Opción</option>
          <v-options store="town" display-field="name" value-field="id" />
        </v-select>
        <label>Dirección:</label>
        <v-textarea v-model="o.direccion" maxlength="150" v-uppercase />
      </v-fieldset>

      <v-fieldset legend="Documento Identidad" class="v-form">
        <label>Tipo:</label>
        <v-select v-model="o.documento_tipo" required>
          <option value="">Select One...</option>
          <v-options :data="documentType" value-field="code" display-field="name" />
        </v-select>
        <label>Número:</label>
        <input v-model="o.documento_nro" maxlength="20" class="center" @input="validateInput" required />
      </v-fieldset>
      <label>Ape. Paterno:</label>
      <input v-model="o.ape_paterno" required maxlength="50" />
      <label>Ape. Materno:</label>
      <input v-model="o.ape_materno" required maxlength="50" />
      <label>Nombres:</label>
      <input v-model="o.nombres" required maxlength="100" />

      <label>Fecha Nacimiento:</label>
      <v-calendar v-model="o.fecha_nacimiento" required @changed="inputEdad" />
      <label>Edad:</label>
      <div class="readonly">{{ (o.age || o.age
        == 0 ? o.age : '---') }}
      </div>
      <label>Sexo:</label>
      <v-radio-group required="true" v-model="o.sexo">
        <v-radio label="MASCULINO" value="M"></v-radio>
        <v-radio label="FEMENINO" value="F"></v-radio>
      </v-radio-group>
      <label>Estado Civil:</label>
      <v-radio-group required="true" v-model="o.estado_civil">
        <v-radio value="SOLTERO"></v-radio>
        <v-radio value="CASADO"></v-radio>
      </v-radio-group>
      <template v-if="o.estado_civil == 'CASADO'">
        <label>Ape. Casado:</label>
        <input v-model="o.ape_casado" required maxlength="50" />
      </template>
      <label>Celular:</label>
      <input v-model="o.celular" maxlength="20" />
      <label>Correo:</label>
      <input v-model="o.correo" maxlength="100" />
      <label>Idioma Predominante:</label>
      <input v-model="o.idioma_predominante" maxlength="20" v-uppercase />
      <label>Cod. Familia:</label>
      <v-textarea v-model="o.cod_familia" maxlength="255" />

      <v-fieldset legend="Coordenadas" style="word-break: break-all;">
        <template v-if="o.lat">
          ({{ o.lat }}, {{ o.lon }})
        </template>
        <div class="alert yellow" v-if="!o.lat && tried">
          No se pudo obtener las coordenadas actuales
        </div>
        <div class="right" style="margin-top:10px">
          <v-button icon="fa-compass" value="Obtener coordenadas actuales" @click.prevent="getCoordinates" />
        </div>
      </v-fieldset>


    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
      <v-button style="margin-left: 10px" value="Ver" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
        $router.replace(
          '/admin/desarrollo-social/people/' + (o.tmpId ? -o.tmpId : o.id)
        )
        "></v-button>
    </center>
  </v-page>
</template>
<script>
import { ui } from 'isobit-ui'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import VSketcher from '@/components/v-sketcher.vue';
import { Geolocation } from "@capacitor/geolocation";
import { documentType } from '../constants';

export default ui({
  props: ["id"],
  components: {
    VSketcher,
  },
  setup({ router, id }) {
    const oRef = ref({});
    const tried = ref(false);
    const province = ref();
    const getCoordinates = () => {
      Geolocation.getCurrentPosition().then(({ coords }) => {
        if (coords) {
          const { latitude: lat, longitude: lon } = coords;
          oRef.value = { ...oRef.value, lat, lon }
        }
        tried.value = true;
      }).catch(() => { tried.value = true; });
    }
    const changeRoute = () => {
      if (id < 0) {
        me.getStoredList("people").then((adultomayor) => {
          adultomayor.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              oRef.value = { ...e };
            }
          });
        });
      } else if (Number(id)) {

        axios.get("/api/desarrollo-social/people/" + id)
          .then(({ data }) => {
            oRef.value = { ...data };
            province.value.load({ code: oRef.value.region || '02' });
          });
      } else {
        setTimeout(() => {
          try {
            let s = localStorage.getItem("setting");
            if (s) {
              s = JSON.parse(s);
              let o = oRef.value;
              if (s.region) o.region = s.region.code;
              if (s.province) o.province = s.province.code;
              if (s.district) o.district = s.district.code;
            }
          } catch (e) {
            console.log(e);
          }

          province.value.load({ code: oRef.value && oRef.value.region || '02' });
        })
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
        router.replace("/admin/desarrollo-social/people/" + nid);
      }
    }
    return { o: oRef, close, getCoordinates, province, tried }
  },
  data() {
    return {
      count: 0,
      red: [],
      age: null,
      documentType
    };
  },
  methods: {
    process({ province, age, ubigeo_ccpp, ...o }) {
      return { ...o, ubigeo_ccpp: ubigeo_ccpp.substring(6) };
    },
    validateInput() {
      // Only keep digits and limit to 8 characters
      if (this.o.dni)
        this.o.dni = this.o.dni.replace(/\D/g, '').slice(0, 8);
    },
    inputEdad(e) {
      this.o.age = this.o.fecha_nacimiento ? this.app.getAge(this.o.fecha_nacimiento) : null;
    }
  },
});
</script>