<template>
  <ion-page>
    <v-form action="/api/hr/movement" :header="(o.id ? 'Editar' : 'Crear') + '  Asignación'" :class="o.id < 0 || (o.tmpId && !o.synchronized)
      ? 'yellow'
      : o.tmpId
        ? 'green'
        : ''
      " store="Asignación">
      <div class="v-form">
        <label>ID:</label>
        <div>{{ pad(o.id || 0, 4) }}</div>
        <v-fieldset legend="Datos generales" class="v-form">
          <label>Usuario:</label>
          <v-autocomplete queryEvent="enter" placeholder="Ingrese mas de 2 letras y presione ENTER" minQueryLength="3"
            emptyMessage="Buscar por nombre (2 caracteres min.)" size="20" v-model="o.personal"
            src="/api/hr/personal">
            <template v-if="o.personal" v-slot:label="{ selected }">{{ selected.dni }}: {{
              selected.apellidosNombres }}bbb</template>
            <template v-slot="{ row }">
              {{ row.dni }}: {{ row.apellidosNombres }}
            </template>
          </v-autocomplete>
        </v-fieldset>
        <v-fieldset legend="Recursos">
          <label>Recurso:</label>
          <v-autocomplete queryEvent="enter" ref="resourceAutocomplete"
            placeholder="Ingrese mas de 2 letras y presione ENTER" minQueryLength="3"
            emptyMessage="Buscar por nombre (2 caracteres min.)" size="20" v-model="o.resource"
            src="/api/hr/resource">
            <template v-slot:label="{ selected }" v-if="o.resource">{{ selected.codpatrimonio }}: {{ selected.marca }}
              {{ selected.modelo }}</template>
            <template v-slot="{ row }">
              {{ row.codpatrimonio }}: {{ row.marca }} {{ row.modelo }}
            </template>
          </v-autocomplete>
          <div style="padding:10px 0px;text-align:right">
            <v-button value="Agregar" icon="fa-plus" @click="updateResource" />
          </div>
          <v-table autoload="false" :scrollable="true" :style="{ maxHeight: maxHeight }" :value="o.resources"
            row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
            row-key="resourceId"
            @row-select="selections.resource = $event.current">
            <template v-slot:default="{ row, index }">
              <td header="N°" class="center" width="40">
                {{ pad(index + 1, 2) }}
              </td>
              <td header="Tipo" class="center" width="160">
                {{ row.typeName }}
              </td>
              <td header="Cod. Patrimonial" class="center" width="160">
                {{ row.codpatrimonio }}
              </td>
              <td header="Estado" class="center" width="160">
                {{ row.estado }}
              </td>
              <td header="Codigo" class="center" width="160">
                {{ row.codigo }}
              </td>
              <td header="Modelo" class="center" width="160">
                {{ row.modelo }}
              </td>
              <td header="Marca" class="center" width="160">
                {{ row.marca }}
              </td>
              <td header="Observaciones" width="160">
                {{ row.observaciones }}
              </td>
              <td header="Marca" class="center" width="160">
                {{ row.marca }}
              </td>
              <td header="Fecha Asignación" class="center" width="160">
                {{ row.fechaAsignacion }}
              </td>
              <td header="Fecha Devolución" class="center" width="160">
                {{ row.fechaDevolucion }}
              </td>
              <td width="120" header="Creado" class="center">
                {{ date(row.insertDate) }}
              </td>
              <td width="120" header="Editado" class="center">
                {{ date(row.updateDate) }}
              </td>
            </template>
          </v-table>
          <div class="right" style="margin-top: 10px" v-if="perms.HR_PERSONAL_REGISTER && o.editable">
            <v-button icon="fa-trash" :disabled="!selections.resource" @click="destroy"
              v-if="perms.HR_PERSONAL_ADMIN"></v-button>
            <v-button icon="fa-pen" :disabled="!selections.resource" @click="edit"></v-button>
            <v-button icon="fa-plus" @click="add('resource', o)"></v-button>
          </div>
        </v-fieldset>
      </div>
      <center>
        <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
        <v-button style="margin-left: 10px" value="Ver" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
          $router.replace(
            '/admin/hr/movement/' + (o.tmpId ? -o.tmpId : o.id)
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
import { contract_type, afp_onp, organ } from '../personal/constants';

export default ui({
  props: ["id"],
  data() {
    return {
      red: [],
      contract_type, afp_onp, organ,
      selections: {}
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
    const oRef = ref({ resources: [], personal:null, resource: null });
    const resourceAutocomplete = ref();
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
          .get("/api/hr/movement/" + id)
          .then(({ data }) => {
            oRef.value = data;
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
        router.replace("/admin/hr/movement/" + nid);
      }
      oRef.value = o;
    }
    const updateResource = () => {
      const {id, ...resource} =oRef.value.resource;
      resource.resourceId = id;
      oRef.value.resources.push(resource);
      resourceAutocomplete.remove();
    }
    return { o: oRef, close, resourceAutocomplete, updateResource }
  },
  methods: {
    process(o) {
      delete o.resource;
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