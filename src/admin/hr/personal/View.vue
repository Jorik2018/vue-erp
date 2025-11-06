<template>

  <v-page action="/api/hr/personal" :title="o.synchronized" header="Ver Personal" store="personal" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    ">
    <div class="v-form">
      <label>ID:</label>
      <div>
        {{ pad(o.id, 4) }}
      </div>
      <v-fieldset legend="Datos generales">
        <label>Secuencia Funcional:</label>
        <div>{{ o.secuenciaFuncional || '---' }}</div>
        <label>Actividad:</label>
        <div>{{ o.actividad || '---' }}</div>
        <label>DNI:</label>
        <div>{{ o.dni || '---' }}</div>
        <label>AIRHSP:</label>
        <div>{{ o.codigoAirhsp || '---' }}</div>
        <label>Apellidos Nombres:</label>
        <div>{{ o.apellidosNombres || '---' }}</div>
        <label>Organo:</label>
        <div>{{ o.organo || '---' }}</div>
        <label>Unidad Organica:</label>
        <div>{{ o.unidadOrganica || '---' }}</div>
        <label>Cargo:</label>
        <div>{{ o.cargo || '---' }}</div>
        <label>Fecha Inicio Contrato:</label>
        <div>{{ o.fechaDeInicioContrato || '---' }}</div>
        <label>Fecha Inicio OFIS:</label>
        <div>{{ o.fechaDeInicioOfis || '---' }}</div>
        <label>Tipo Contrato:</label>
        <div>{{ o.tipoDeContrato || '---' }}</div>
        <label>Clasificador Gasto Contrato:</label>
        <div>{{ o.clasificadorDeGastoContrato || '---' }}</div>
        <label>Sistema Pensión:</label>
        <div>{{ o.afpOnp || '---' }}</div>
        <label>CUSPP:</label>
        <div>{{ o.nCuspp || '---' }}</div>
      </v-fieldset>
      <v-fieldset legend="Recursos">
        <v-table autoload="false" :scrollable="true" :style="{ maxHeight: maxHeight }"
          src="/api/hr/personal/resource/0/0" :value="o.damage_salud" store="personal_resource"
          row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')" ref="resource" :filters="filters"
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
          </template>
        </v-table>
        <!--div class="right" style="margin-top: 10px" v-if="perms.HR_PERSONAL_REGISTER && o.editable">
          <v-button icon="fa-trash" :disabled="!selections.resource" @click="destroy"
            v-if="perms.HR_PERSONAL_ADMIN"></v-button>
          <v-button icon="fa-pen" :disabled="!selections.resource" @click="edit"></v-button>
          <v-button icon="fa-plus" @click="add('resource', o)"></v-button>
        </div-->
      </v-fieldset>
      <v-fieldset legend="Servicios">
        <v-table autoload="false" class="visit" src="/api/hr/personal/service/0/0" :style="{ maxHeight: maxHeight }"
          :scrollable="true" :value="o.damagesIPRESS" store="personal_service"
          row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')" ref="service" :filters="filters"
          @row-select="selections.service = $event.current">
          <template v-slot:default="{ row, index }">
            <td header="N°" class="center" width="40">
              {{ pad(index + 1, 2) }}
            </td>
            <td header="Usuario Red" class="center" width="120">
              {{ row.usuarioDeRed }}
            </td>
            <td header="Usuario Red" class="center" width="120">
              {{ row.usuarioDeSgd }}
            </td>
            <td header="Usuario Red" class="center" width="120">
              {{ row.usuarioDeSiaf }}
            </td>
            <td header="Usuario Red" class="center" width="120">
              {{ row.usuarioDeSiga }}
            </td>
            <td header="Correo Institucional" width="220">
              {{ row.correoInstitucional }}
            </td>
            <td header="Correo Grupo" width="220">
              {{ row.correoGrupo }}
            </td>
            <td header="Numero Celular" width="120">
              {{ row.numeroCelular }}
            </td>
            <td header="Numero Anexo" width="120" class="center">
              {{ row.numeroAnexo }}
            </td>
            <td header="IP" width="120" class="center">
              {{ row.ip }}
            </td>
            <td header="VPN Anydesk" width="120" class="center">
              {{ row.vpnAnydesk }}
            </td>
            <td header="Certificado Digital" width="120" class="center">
              {{ row.certificadoDigital }}
            </td>
            <td header="AC Compartido" width="120" class="center">
              {{ row.acCompartido }}
            </td>
            <td header="Otros Recursos" width="120">
              {{ row.otrosRecursos }}
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

          <v-button icon="fa-trash" :disabled="!selections.service" @click="destroy"
            v-if="perms.HR_PERSONAL_ADMIN"></v-button>
          <v-button icon="fa-pen" :disabled="!selections.service" @click="edit"></v-button>
          <v-button icon="fa-plus" @click="add('service', o)"></v-button>


        </div>
      </v-fieldset>
    </div>
    <center v-if="perms.HR_PERSONAL_REGISTER && o.editable">
      <v-button style="margin-left: 10px" value="Editar" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
        $router.replace(
          '/admin/hr/personal/' +
          (o.tmpId ? -o.tmpId : o.id) +
          '/edit'
        )
        "></v-button>
    </center>
  </v-page>
</template>
<script>
import { ui, db } from 'isobit-ui'
import axios from 'axios'
export default ui({
  props: ["id"],
  created() {
    let me = this;
    me.getStoredList("personal").then((emeds) => {

      /*
      me.$on("destroyed", (e, storeName) => {
        e.forEach((o) => {
          emeds.forEach((e) => {
            if (
              (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
              e.id == o.emedId
            ) {
              console.log(storeName);
              let sn = storeName.replace("emed_", "");
              console.log(e);
              console.log(sn);
              me.setStoredList(storeName,
                e[sn] = e[sn].filter(r => r.tmpId != o.tmpId)
                || []);
              _.db
                .transaction(["personal"], "readwrite")
                .objectStore("personal")
                .put(e);
            }
          });
 
 
 
        });
      });*/
    });
    /*this.$on("sync", (o) => {
      me.getStoredList("personal").then((emeds) => {
        emeds.forEach((e) => {
          if (e.tmpId == Math.abs(o.tmpId)) {
            e.visits.forEach((visit) => {
              if (o.visits)
                o.visits.forEach((o) => {
                  if (o.tmpId == visit.tmpId) {
                    visit.id = o.id;
                    visit.synchronized = o.synchronized;
                  }
                });
              visit.emedId = o.id;
            });
            _.db
              .transaction(["personal"], "readwrite")
              .objectStore("personal")
              .put(e);
          }
        });
      });
    });*/
  },
  data() {
    return {
      count: 0,
      delay: 400,
      clicks: 0,
      timer: null,
      selections: { damage_salud: null, damage_ipress: null, action: null },
      k: 0,
      dd: [],
      maxHeight: '400px',
      o: { synchronized: null, files: [] },
    };
  },
  methods: {
    close() { },
    add(table, o) {
      this.open(
        "/admin/hr/personal/" + o.id + "/add/" + table.replace('_', '-'),
        this.$refs[table].load
      );
    },
    loadTables() {
      let refs = this.$refs;
      for (let e in refs) {
        if (refs[e] && refs[e].load) refs[e].load();
      }
    },
    changeRoute() {
      const me = this,
        id = me.id;
      if (id < 0) {
        me.getStoredList("personal").then((personal) => {
          personal.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              let o = e;
              o.files = o.files || [];
              me.setStoredList("emed_action", o.action || []);
              me.setStoredList("emed_damage_ipress", o.damage_ipress || []);
              me.setStoredList("emed_damage_salud", o.damage_salud || []);
              me.setStoredList("emed_file", o.files || []);
              me.o = o;
              me.filters.personal = e.id;
              me.loadTables();
            }
          });
        });
      } else if (Number(id)) {
        me.filters.personal = me.id;
        let loaded = 0;
        me.getStoredList("personal").then((personal) => {
          personal.forEach((e) => {
            if (e.id == me.id) {
              let o = e;
              me.setStoredList("emed_action", o.action || []);
              me.setStoredList("emed_damage_ipress", o.damage_ipress || []);
              me.setStoredList("emed_damage_salud", o.damage_salud || []);
              me.setStoredList("emed_file", o.files || []);
              me.o = o;
              me.filters.personal = e.id;
              //se espera q se cargue la data de los setStoredList
              me.loadTables();
              loaded = 1;
            }
          });
        });
        axios
          .get("/api/hr/personal/" + id)
          .then((response) => {
            let o = response.data;
            o.files = o.files || [];
            me.o = o;
            if (!loaded) me.loadTables();
          });
      }
    },
    changeImage(result) {
      let me = this, o = me.o;
      me.count = 0;
      if (!result.src && result.tempFile)
        result.src = me.baseURL.replace('/wp-json', '') + "/uploads/" + result.tempFile;
      if (me.file) {
        //put src to temporal reference me.file when is sync by dblclick
        me.file.src = result.src;
        //update store
        delete me.file;
      } else {
        o.files.push(result);
      }
      result.emedId = o.id;
      console.log('me.online==', me.app);
      if (!me.app.online) {
        result.tmpId = 1 * (new Date());
        result.id = -result.tmpId;
        console.log('o==', o);
        db()
          .transaction(["personal"], "readwrite")
          .objectStore("personal")
          .put(o);
      } else {
        axios.post("/api/hr/personal/file", { src: result.src, emedId: result.emedId })
      }
    }
  },
  mounted() {
    const me = this;
    //if (this.$children[0]) me.app.title = this.$children[0].header;*/
    me.changeRoute();
  },
});
</script>
<style scoped>
#dateDiff:empty,
#msg:empty {
  display: none;
}

#dateDiff {
  border-radius: 4px;
  background-color: #fdfad9;
  border: 1px solid #dddddd;
  padding: 5px 10px;
  margin-top: 10px;
}

.coordinates {
  margin-top: 10px;
  border: 1px solid #ffcf00;
  background-color: #ffff80;
  padding: 10px;
}
</style>