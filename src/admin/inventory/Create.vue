<template>
  <v-page action="/api/inventory/item" :header="(o.id ? 'Editar' : 'Crear') + '  Item'" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    " store="cancer">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <v-fieldset legend="DATOS USUARIO" class="v-form general">
        <label>Usuario Responsable:</label>
        <input v-model="o.usuario_responsable" required="required" />
        <label>Modalidad:</label>
        <v-radio-group required="true" v-model="o.usuario_modalidad">
          <v-radio value="CAS"></v-radio>
          <v-radio value="LOCADOR"></v-radio>
        </v-radio-group>
        <label>Departamento/Área:</label>
        <v-select v-model="o.usuario_area" required="required" class="required">
          <option value="">Select One...</option>
          <option v-for="item in usuario_area" :key="item.name" :value="item.name">
            {{ (item.type == 'U' || item.type == 'S') ? '&emsp;&emsp; ' : '' }} {{ item.name }}
          </option>
        </v-select>
        <label>Ubicación:</label>
        <v-select v-model="o.usuario_ubicacion" required="required" class="required">
          <option value="">Select One...</option>
          <option v-for="item in usuario_ubicacion" :key="item" :value="item">
            {{ item }}
          </option>
        </v-select>
        <div class="right" style="padding-top: 10px;">
          <v-button value="Limpiar" icon="fa-eraser" class="blue" @click.prevent="clear"></v-button>
        </div>
      </v-fieldset>
      <v-fieldset legend="DATOS DEL EQUIPO / ACCESORIO" class="v-form">
        <label>Código Patrimonial:</label>
        <input v-model="o.codigo_patrimonial" class="center" />
        <label>Código Inventerio:</label>
        <input v-model="o.codigo_inventario" />
        <label>Tipo de Equipo / Accesorio:</label>
        <v-select v-model="o.tipo_equipo_accesorio" required="required" class="required">
          <option value="">Select One...</option>
          <option v-for="item in type" :key="item" :value="item">
            {{ item }}
          </option>
        </v-select>
        <label>Marca:</label>
        <input v-model="o.marca" />
        <template v-if="enabled.model">
          <label>Modelo:</label>
          <input v-model="o.modelo" />
        </template>
      </v-fieldset>
      <template v-if="enabled.device">
        <v-fieldset legend="PROCESADOR" class="v-form">
          <label>Nombre:</label>
          <input v-model="o.procesador_nombre" />
          <label>Generación:</label>
          <input v-model="o.procesador_generacion" />
        </v-fieldset>
        <v-fieldset legend="MEMORIA" class="v-form">
          <label>Capacidad:</label>
          <v-number v-model="o.memoria_capacidad" />
          <label>Tipo:</label>
          <input v-model="o.memoria_tipo" />
        </v-fieldset>
        <v-fieldset legend="ALMACENAMIENTO" class="v-form">
          <label>Capacidad:</label>
          <input v-model="o.almacenamiento_capacidad" />
          <label>Tipo:</label>
          <input v-model="o.almacenamiento_tipo" />
        </v-fieldset>
        <v-fieldset legend="MULTIMEDIA" class="v-form">
          <label>Altavoces:</label>
          <input v-model="o.multimedia_altavoces" />
        </v-fieldset>
        <v-fieldset legend="Sistema Operativo" class="v-form">
          <label>Versión:</label>
          <input v-model="o.sistema_operativo_version" />
        </v-fieldset>
      </template>
      <v-fieldset legend="Monitor" class="v-form" v-if="enabled.screen">
        <label>Pulgadas:</label>
        <input v-model="o.monitor_pulgadas" />
      </v-fieldset>
      <label>Estado:</label>
      <v-select v-model="o.estado" required="required" class="required">
        <option value="">Select One...</option>
        <option v-for="item in estado" :key="item" :value="item">
          {{ item }}
        </option>
      </v-select>
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
      <span style="width: 20px;display: inline-block;"></span>
      <v-button value="Nuevo" :disabled="!o.id" icon="fa-plus" class="blue" @click.prevent="create"></v-button>
    </center>
  </v-page>
</template>
<script>
import { ui } from 'isobit-ui'
import { ref } from 'vue'
import axios from 'axios'
export default ui({
  props: ["id"],
  setup({ router, id }) {
    const o = ref({ emedId: null, type: null });
    const close = ({ success, data }) => {
      let _o = o.value;
      if (success === true) {
        _o.id = data.id;
        _o.tmpId = data.tmpId;
        if (data.uploaded) {
          delete _o.tempFile;
        }
      }
      o.value = _o;
      const nid = _o.tmpId ? -_o.tmpId : _o.id;
      if (id != nid)
        router.replace("/admin/inventory/item");
    }
    return { close, o }
  },
  data() {
    return {
      count: 0,
      red: [],
      age: null,
      usuario_area:
        [
          { "name": "PRESIDENCIA EJECUTIVA", "type": "P" },
          { "name": "GERENCIA GENERAL", "type": "G" },
          { "name": "OFICINA DE ADMINISTRACIÓN", "type": "O" },
          { "name": "UNIDAD DE ABASTECIMIENTO Y CONTROL PATRIMONIAL", "type": "U" },
          { "name": "UNIDAD DE FINANZAS", "type": "U" },
          { "name": "UNIDAD DE RECURSOS HUMANOS", "type": "U" },
          { "name": "OFICINA DE ASESORÍA JURÍDICA", "type": "O" },
          { "name": "OFICINA DE PLANEAMIENTO, PRESUPUESTO Y MONITOREO", "type": "O" },
          { "name": "UNIDAD DE PRESUPUESTO", "type": "U" },
          { "name": "UNIDAD DE PLANEAMIENTO Y MODERNIZACIÓN", "type": "U" },
          { "name": "DIRECCIÓN DE DESARROLLO DE CAPACIDADES Y DESPLIEGUE TERRITORIAL", "type": "D" },
          { "name": "SUBDIRECCIÓN DE FORMACIÓN Y ACREDITACIÓN", "type": "S" },
          { "name": "SUBDIRECCIÓN DE DESPLIEGUE TERRITORIAL", "type": "S" },
          { "name": "DIRECCIÓN DE GOBIERNO DE DATOS Y SUPERVISIÓN", "type": "D" },
          { "name": "SUBDIRECCIÓN DE GOBIERNO DE DATOS", "type": "S" },
          { "name": "DIRECCIÓN DE SISTEMAS DE INFORMACIÓN SOCIAL", "type": "D" },
          { "name": "SUBDIRECCIÓN DE INFORMACIÓN E INNOVACIÓN", "type": "S" },
          { "name": "SUBDIRECCIÓN DE GESTIÓN DE LOS SERVICIOS E INFRAESTRUCTURA TECNOLÓGICA", "type": "S" },
          { "name": "DIRECCIÓN DE DISEÑO Y METODOLOGÍAS PARA LA FOCALIZACIÓN Y LA GESTIÓN DE LA INFORMACIÓN", "type": "D" },
          { "name": "SUBDIRECCIÓN ANÁLISIS, INVESTIGACIÓN Y METODOLOGÍA", "type": "S" },
          { "name": "SUBDIRECCIÓN DE DISEÑO DE FOCALIZACIÓN", "type": "S" },
          { "name": "DIRECCIÓN DE RELACIONAMIENTO Y COMUNICACIÓN SOCIAL", "type": "D" },
          { "name": "SUBDIRECCIÓN DE COMUNICACIÓN SOCIAL", "type": "S" },
          { "name": "SUBDIRECCIÓN DE ATENCIÓN AL CIUDADANO Y GESTIÓN DE SOLICITUDES", "type": "S" }
        ]
      ,
      usuario_ubicacion: [

        "PISO 06",
        "PISO 08"
      ],
      type: [
        "AURICULAR",
        "CAMARA WEB",
        "COMPUTADORA",
        "ESTACION DE TRABAJO",
        "FOTOCOPIADORA",
        "IMPRESORA",
        "LAPTOP",
        "LECTORA DE TARJETA INTELIGENTE",
        "MONITOR",
        "MOUSE",
        "TABLET",
        "TECLADO",
        "TELEFONO",
        "UPS"
      ],
      estado: [
        "BUENO",
        "MALO",
        "REGULAR"
      ],
      resultadoVisita: ["EJECUTADO", "RECHAZADO", "ABANDONADO"],
      o: {
        id: null,
        tipo_equipo_accesorio: null,
      },
      defaults: {}
    };
  },
  computed: {
    enabled() {
      const enabled = {
        "device": ["COMPUTADORA", "ESTACION DE TRABAJO", "LAPTOP", "TABLET"].includes(this.o.tipo_equipo_accesorio),
        "screen": ["LAPTOP", "TABLET", "MONITOR"].includes(this.o.tipo_equipo_accesorio),
      };
      enabled.model = this.o.tipo_equipo_accesorio && "LECTORA DE TARJETA INTELIGENTE" != this.o.tipo_equipo_accesorio;
      return enabled;
    }
  },
  mounted() {
    var me = this;
    me.changeRoute();
  },
  methods: {
    clear() {
      localStorage.setItem('inventory.defaults', null);
      this.changeRoute();
    },
    create() {
      this.o = { ...this.defaults };
      this.$router.replace('/admin/inventory/item/create');
    },
    onInputFUR(o) {
      if (o) {
        o = new Date(o);
        o.setFullYear(o.getFullYear() + 1);
        o.setMonth(o.getMonth() - 3);
        o.setDate(o.getDate() + 7);
      }
      this.o.gestanteFPP = _.toDate(o, "date-");
    },
    process(o) {
      const {
        usuario_responsable,
        usuario_modalidad,
        usuario_area,
        usuario_ubicacion
      } = o;
      if (!o.id) {
        localStorage.setItem('inventory.defaults', JSON.stringify({
          usuario_responsable,
          usuario_modalidad,
          usuario_area,
          usuario_ubicacion
        }))
      }
      return o;
    },
    async changeRoute() {
      var me = this,
        id = me.id, m = me.$refs.map; me.age = 0;
      me.trayLocation = 0;
      if (id < 0) {
        me.getStoredList("cancer").then((cancer) => {
          cancer.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              me.o = e;
              if (m)
                m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
              me.$refs.province.load({ code: me.o.region || "02" });
              me.trayLocation = Number(e.lat) && e.lon;
            }
          });
        });
      } else if (Number(id)) {
        axios
          .get("/api/inventory/item/" + id)
          .then((response) => {
            me.o = response.data;
          });
      } else {
        try {
          let s = localStorage.getItem("inventory.defaults");
          if (s) {
            s = JSON.parse(s);
            this.o = { ...s }
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  },
});
</script>
<style scoped>
.general {
  background-color: #cadff5;
}

@media (prefers-color-scheme: dark) {
  .general {
    background-color: #0d6fd533;
  }
}
</style>