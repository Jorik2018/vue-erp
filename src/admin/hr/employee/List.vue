<template>
  <v-form header="Empleados" style="position: relative" action="/admin/hr/employee">

    <v-table store="poll" v-on:row-select="rss" row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
      src="/api/hr/employee" pagination="50" scrollable="true" :filters="filters" @updated="bindLinks($el)">
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
      const p = {},
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
    const me = this;
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