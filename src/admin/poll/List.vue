<template>
  <v-form header="Cuestionario de Condiciones de Vida" style="position: relative" action="/admin/poll/1">

    <v-table store="poll" v-on:row-select="rss" row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
      src="/api/poll/1" pagination="50" scrollable="true" :filters="filters" @updated="bindLinks($el)">
      <template v-slot:header>
        <v-button value="Crear" icon="fa-plus" class="on" v-on:click.prevent="create"></v-button>
        <v-button value="Grabar" icon="fa-save" v-show="app.connected" class="on"
          v-on:click.prevent="sync({ sufix: '/' + app.poll })"></v-button>

        <v-button value="Editar" v-if="1 || can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-pen"
          v-on:click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
        <v-button value="Eliminar" icon="fa-trash" v-show="rowSelectedCount2" v-on:click.prevent="destroy"
          :disabled="!rowSelectedCount"></v-button>
        <v-button title="Refrescar" icon="fa-sync" v-on:click.prevent="refresh"></v-button>
      </template>
      <template v-slot="{ row }">
        <td header="ID" width="80" class="center">{{ pad(row.id, 4) }}</td>
        <td header="IDENTIFICACION MUESTRAL" width="300">
          <a v-bind:href="'/admin/poll/' + (row.tmpId ? -row.tmpId : row.id)">URB_RUR={{ row.urb_rur }}
            <template v-if="row.distrito">/ DISTRITO={{ row.distrito }}</template>
            <template v-if="row.conglomerado">/ CONGLOMERADO={{ row.conglomerado }}</template>
            <template v-if="row.zona">/ ZONA={{ row.zona }}</template>
            <template v-if="row.manzana">/ MANZANA={{ row.manzana }}</template>
            <template v-if="row.vivienda">/ VIVIENDA={{ row.vivienda }}</template>
            <template v-if="row.hogar">/ HOGAR={{ row.hogar }}</template>
          </a>
        </td>
        <td header="DIRECCION" width="200">
          <template v-if="row.nombre_calle">/ CALLE O AVENIDA={{ row.nombre_calle }}</template>
          <template v-if="row.numero">/ NUMERO={{ row.numero }}</template>
          <template v-if="row.lote">/ LOTE={{ row.lote }}</template>
          <template v-if="row.km">/ KM={{ row.km }}</template>
        </td>
        <td header="MIEMBROS" width="140" class="center">
          {{ row.people ? row.people.length : 0 }}
        </td>
        <td header="FECHA" width="120" class="center">
          {{ row.tmpId | date }}
        </td>
      </template>
    </v-table>
  </v-form>
</template>
<script>
import { ui } from 'isobit-ui'
export default ui({
  props: ["src"],
  computed: {
    filter() {
      console.log(window.app.session.rol);
      let p = {},
        me = this;
      if (me.query) {
        p.query = me.query;
      }
      return p;
    },
  },
  data() {
    return { rowSelectedCount2: 0, page: 0, data: [], mode: 0, query: null };
  },
  updated() {
    window.bindLinks(this.$el);
  },
  mounted() {
    let me = this;
    me.changeRoute();
    me.filters.poll = me.app.poll;
    /*me.$on("sync", function (dr, dl) {
      if (dr.people && dl.people) {
        for (let ki = 0; ki < dr.people.length; ki++) {
          for (let kj = 0; kj < dl.people.length; kj++) {
            if (dl.people[kj].tmpId == dr.people[ki].tmpId) {
              if (dr.people[ki].id) {
                dl.people[kj].id = dr.people[ki].id;
                dl.people[kj].synchronized = 1;
              }
              if (dr.people[ki].encuesta_id) {
                dl.people[kj].encuesta_id = dr.people[ki].encuesta_id;
              }
              console.log(dl.people[kj]);
            }
          }
        }
      }
    });*/
  },
  methods: {
    rss(e) {
      e = e.selection;
      this.rowSelectedCount2 = e ? e.length : 0;
    },
    changeRoute() {
      this.resize();
    },
  },
});
</script>
<style scope>
img.error {
  padding: 40px !important;
  width: calc(100% - 80px) !important;
  background-color: transparent;
}

a {
  display: inline-block;
}

.controls a:not(:last-child) {
  display: inline-block;
  margin-right: 0px;
}

.store-list {
  background-color: rgb(240, 240, 240);
  padding: 20px;
}

.store {
  padding: 0px;
  background-color: white;
  position: relative;
  width: calc(100% - 0px);
}

.store:not(:last-child) {
  margin-bottom: 20px;
}

.store img {
  width: 60%;
  margin: 0 auto !important;
  border: 0;
}

.store-info .controls {
  position: absolute;
  top: 0px;
  right: -10px;
}

.v-no-results {
  background: white !important;
}
</style>