<template>
    <v-page header="Personas" action="/admin/desarrollo-social/people">
        <v-table :selectable="true" row-style-class2="row.synchronized?'green':(row.tmpId>0?'yellow':'')" store="people"
            @loaded="ll" :scrollable="true" rowKey="id" :pagination="20" @updated="app.bindLinks($el)"
            :filters="filters" src="/api/desarrollo-social/people">
            <template v-slot:header>
                <v-button value="Crear" v-if="1 || can(perms.DS_PEOPLE_REGISTER)" icon="fa-plus" class="on"
                    @click.prevent="create"></v-button>
                <v-button value="Editar" v-if="1 || can(perms.DS_PEOPLE_REGISTER)" icon="fa-pen" @click.prevent="edit"
                    :disabled="!rowSelectedCount"></v-button>
                <v-button value="Ver" icon="fa-search" @click.prevent="view(getSelected()[0])"
                    :disabled="!rowSelectedCount"></v-button>
                <v-button value="Eliminar" v-if="1 || can(perms.DS_PEOPLE_ADMIN)" icon="fa-trash"
                    @click.prevent="destroy" :disabled="!rowSelectedCount"></v-button>
                <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
            </template>
            <template v-slot="{ row }">
                <td width="80" class="center" header="ID">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{ pad(row.id, 4) }}
                </td>
                <td width="120" header="Documento" class="center">
                    <v-filter>
                        <input v-model="filters.dni" />
                    </v-filter>
                    {{ row.documento_nro }}
                </td>
                <td width="220" header="Apellidos y Nombres">
                    <v-filter>
                        <input v-model="filters.apellidos_nombres" />
                    </v-filter>
                    {{ row.ape_paterno }} {{ row.ape_materno }} {{ row.nombres }}
                </td>
                <td width="120" header="Fecha Nacimiento" class="center">
                    <v-filter>
                        <input v-model="filters.fecha_nacimiento" />
                    </v-filter>
                    {{ date(row.fecha_nacimiento, 'date') }}
                </td>
                <td width="220" header="Dirección" class="center">
                    <v-filter>
                        <input v-model="filters.direccion" />
                    </v-filter>
                    {{ row.direccion }}
                </td>

                <td width="120" header="Insertado" class="center">
                    <v-filter>
                        <input v-model="filters.insert_date" />
                    </v-filter>
                    {{ date(row.insert_date) }} - {{ row.insert_user }}
                </td>
                <td width="120" header="Actualizado" class="center">
                    <v-filter>
                        <input v-model="filters.updated_date" />
                    </v-filter>
                    {{ date(row.updated_date) }}
                </td>
            </template>
        </v-table>
    </v-page>
</template>
<script>
import { ui } from 'isobit-ui'
export default ui({
    data() {
        return { rowSelectedCount2: 0, page: 0, data: [], mode: 0, query: null }
    },
    created() {
        var me = this;
        /*
        me.filters.uid = me.user.uid;
        me.$on('sync', function (dr, dl) {//data remote -> data local
            if (dr.people && dl.people) {
                dr.people.forEach(pr => {
                    dl.people.forEach(pl => {
                        if (pl.tmpId == pr.tmpId) {
                            if (pr.id) {
                                pl.id = pr.id;
                                pl.tmpSynchronized = 1;
                            }
                            if (pr.encuesta_id) {
                                pl.encuesta_id = pr.encuesta_id;
                                pl.parent = pr.encuesta_id;
                            }
                            console.log(pl);
                        }
                    });
                });
            }
        });*/
    },
    methods: {
        ll(e) { console.log(e) },
        rss(e) {
            e = e.selection;
            this.rowSelectedCount2 = e ? e.length : 0;
        },
        can(o) {
            var m = this, u = m.user;
            return o || u.uid == 1;
            /*return u.uid == 1 || p.REGISTER_DESARROLLO_SOCIAL_SIVICO &&
            !o || o.user == u.id;*/
        },
        view(o) {
            this.open('/admin/desarrollo-social/people/' + (o.tmpId ? (-o.tmpId) : o.id));
        },
        toInt(o) {
            return Array.isArray(o) ? o.length : o;
        }
    }
});
</script>
<style scoped>
.hg {
    background-color: green !important;
}

.hgd {
    background-color: #005d00 !important;
}

.hr {
    background-color: #bf0000 !important;
}

.hbd {
    background-color: #033d71 !important;
}
</style>