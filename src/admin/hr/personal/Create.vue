<template>
  <ion-page>
    <v-form action="/api/hr/personal" :header="(o.id ? 'Editar' : 'Crear') + '  Personal'" :class="o.id < 0 || (o.tmpId && !o.synchronized)
      ? 'yellow'
      : o.tmpId
        ? 'green'
        : ''
      " store="personal">
      <div class="v-form">
        <label>ID:</label>
        <div>{{ pad(o.id || 0, 4) }}</div>
        <v-fieldset legend="Datos generales" class="v-form">
          <label>Secuencia Funcional:</label>
          <input v-model="o.secuenciaFuncional" />
          <label>Unidad Ejecutora:</label>
          <v-select v-model="o.actividad" @input="$refs.organo.load({ ue: o.actividad })">
              <option value="">Select One...</option>
              <v-options :data="actividad"></v-options>
          </v-select>
          <label>DNI:</label>
          <input v-model="o.dni" />
          <label>AIRHSP:</label>
          <input v-model="o.codigoAirhsp" />
          <label>Apellidos Nombres:</label>
          <v-textarea v-model="o.apellidosNombres" maxlength="200" />
          <label>Organo:</label>
          <v-select v-model="o.organoId" required @input="$refs.unidad.load({ organo: o.organoId })" ref="organo">
            <option value="">Select One...</option>
            <v-options store="organ" display-field="name" value-field="code"></v-options>
          </v-select>
          <label>Unidad Organica:</label>
          <v-select v-model="o.unidadId" required :disabled="!o.organoId" ref="unidad">
            <option value="">Select One...</option>
            <v-options store="unidad" display-field="name" value-field="code"></v-options>
          </v-select>
          <label>Cargo:</label>
          <input v-model="o.cargo" />
          <label>Fecha Inicio Contrato:</label>
          <v-calendar v-model="o.fechaDeInicioContrato" />
          <label>Fecha Fin Contrato:</label>
          <v-calendar v-model="o.fechaDeInicioOfis" />
          <label>Tipo Contrato:</label>
          <v-select v-model="o.tipoDeContrato" required>
            <option value="">Select One...</option>
            <v-options :data="contract_type"></v-options>
          </v-select>
          <label>Clasificador Gasto Contrato:</label>
          <input v-model="o.clasificadorDeGastoContrato" />
          <label>Sistema Pensión:</label>
          <v-select v-model="o.afpOnp">
              <option value="">Select One...</option>
              <v-options :data="afp_onp"></v-options>
          </v-select>
          <label>CUSPP:</label>
          <input v-model="o.nCuspp" />
          <label>Estado:</label>
          <v-select v-model="o.estado">
              <option value="">Select One...</option>
              <v-options :data="estado" display-field="name" value-field="id"></v-options>
          </v-select>
        </v-fieldset>
      </div>
      <center v-if="perms.HR_PERSONAL_REGISTER">
        <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
        <v-button style="margin-left: 10px" value="Ver" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
          $router.replace(
            '/admin/hr/personal/' + (o.tmpId ? -o.tmpId : o.id)
          )
          "></v-button>
      </center>

    </v-form>
  </ion-page>
</template>
<script>
import { ui, pad } from 'isobit-ui'
import axios from 'axios'
import { onMounted, ref } from 'vue';
import { contract_type, afp_onp, organ, estado, actividad } from './constants';

export default ui({
  props: ["id"],
  data() {
    return {
      red: [],
      contract_type, afp_onp, organ, estado, actividad
    };
  },
  computed: {
    event() {
      const e = this.category.find((e) => e.name === this.o.category);
      if (!e) return [];
      if (!e.type) {
        e.type = [{ name: e.name }]
      }
      return e.type;
    },
    detail() {
      /*const e = this.event.find((e) => e.name === this.o.type);
      if (!e) return [];
      if (!e.detail) {
        e.detail = [{ name: e.name }]
      }
      return e.detail;*/

      return [];
    }
  },
  setup({ id, router }) {
    const oRef = ref({});
    const changeRoute = () => {
      let o = oRef.value;
      if (id < 0) {
        me.getStoredList("personal").then((personal) => {
          personal.forEach((e) => {
            if (e.tmpId == Math.abs(id)) {
              me.o = e;
            }
          });
        });
      } else if (Number(id)) {
        axios
          .get("/api/hr/personal/" + id)
          .then(({ data }) => {
            const o = data;
            oRef.value = o;
          });
      } else {
        setTimeout(() => {
          try {
            let s = localStorage.getItem("setting");
            if (s) {
              s = JSON.parse(s);
              let o = oRef.value;
              if (s.region) o.region = s.region.code;
              if (s.district) o.district = s.district.code;
              if (s.town) o.codigoCCPP = s.town.id;

              o.codigo_ccpp = s.town;
            }
          } catch (e) {
            console.log(e);
          }
        })
      }
    }
    onMounted(() => {
      changeRoute();
    })
    const close = ({ data: { id, tmpId, uploaded }, success }) => {
      let o = oRef.value;
      const _id = o.id;
      if (success === true) {
        o = { ...o, id, tmpId }
        if (uploaded) {
          delete o.tempFile;
        }
      }
      let nid = o.tmpId ? -o.tmpId : o.id;
      if (_id != nid) {
        router.replace("/admin/hr/personal/" + nid);
      }
      oRef.value = o;
    }

    return { o: oRef, close }
  },
  methods: {
    process(o) {
      return o;
    }
  },
});
</script>
<style>
.column.v-button {
  display: flex;
  width: 90px;
  flex-direction: column;
}
.column.v-button>svg {
  font-size: 20px;
  margin-bottom: 10px;
  margin-right: 0px;
}
</style>