<template>
    <ion-page>
        <v-form header="Eventos" action="/admin/desarrollo-social/emed">
            <v-table :selectable="true" :row-class="rowClass" store="emed" :scrollable="true" rowKey="id"
                :pagination="20" @updated="bindLinks($el)" :filters="filters" src="/api/desarrollo-social/emed">
                <template v-slot:header>
                    <v-button value="Enviar" v-if="app.connected && perms.EMED_REGISTER" icon="fa-save"
                        :disabled="!rowSelectedCount" @click.prevent="sync"></v-button>
                    <v-button value="Crear" v-if="perms.EMED_REGISTER" icon="fa-plus" class="on"
                        @click.prevent="create"></v-button>
                    <v-button value="Editar" v-if="perms.EMED_REGISTER" icon="fa-pen" @click.prevent="edit"
                        :disabled="!editable"></v-button>
                    <v-button value="Ver" icon="fa-search" @click.prevent="view(getSelected()[0])"
                        :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Eliminar" v-if="perms.EMED_ADMIN" icon="fa-trash" @click.prevent="destroy"
                        :disabled="!rowSelectedCount"></v-button>
                    <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
                </template>
                <template v-slot="{ row }">

                    <td width="80" class="center" header="ID">
                        <v-filter>
                            <input v-model="filters.id" />
                        </v-filter>
                        {{ pad(row.id, 4) }}
                    </td>
                    <td width="80" class="center" header="Codigo">
                        <v-filter>
                            <input v-model="filters.code" />
                        </v-filter>
                        {{ row.code }}
                    </td>
                    <td width="120" header="Fecha y hora" class=center>
                        <v-filter>
                            <v-calendar-range v-model="filters.datetime" />
                        </v-filter>
                        {{ date(row.date, 'date-') }} {{ row.time }}
                    </td>
                    <td width="120" header="Categoria">
                        <v-filter>
                            <v-select v-model="filters.category">
                                <option value="">Select One...</option>
                                <v-options :data="category" value-field="name"></v-options>
                            </v-select>
                        </v-filter>
                        {{ row.category }}
                    </td>
                    <td width="200" header="Evento">
                        <v-filter>
                            <input v-model="filters.type" />
                        </v-filter>
                        {{ row.type }}
                    </td>
                    <td width="220" header="Detalle">
                        <v-filter>
                            <input v-model="filters.detail" />
                        </v-filter>
                        {{ row.detail }}
                    </td>
                    <td width="300" header="Descripción">
                        <v-filter>
                            <input v-model="filters.description" />
                        </v-filter>
                        {{ row.description }}
                    </td>
                    <td width="120" class="center" header="DIRESA">
                        <v-filter>
                            <v-select disabled>
                                <option>Select One...</option>
                            </v-select>
                        </v-filter>
                        {{ row.diresa }}
                    </td>
                    <td width="140" class="center" header="Red">
                        <v-filter>
                            <v-select v-model="filters.red" ref="red"
                                voninput="$refs.microredSelect.load({ Codigo_Red: o.red })" :required="true">
                                <option>Select One...</option>
                                <v-options store="red" display-field="name" value-field="code" />
                            </v-select>
                        </v-filter>
                        {{ pad(row.red, 2) }}
                    </td>
                    <td width="90" class="center" header="MicroRed">
                        <v-filter>
                            <v-select disabled>
                                <option>Select One...</option>
                            </v-select>
                        </v-filter>
                        {{ row.microred }}
                    </td>
                    <td width="90" class="center" header="Provincia">
                        <v-filter>
                            <input v-model="filters.province" />
                        </v-filter>
                        {{ row.province }}
                    </td>
                    <td width="90" class="center" header="Distrito">
                        <v-filter>
                            <input v-model="filters.district" />
                        </v-filter>
                        {{ row.district }}
                    </td>
                    <td width="200" header="Referencia">
                        <v-filter>
                            <input v-model="filters.referencia" />
                        </v-filter>
                        {{ row.referencia }}
                    </td>
                    <td width="120" header="Ambulancias" class=center>
                        <v-filter>
                            <input v-model="filters.ambulancias" />
                        </v-filter>
                        {{ row.ambulancias }}
                    </td>
                    <td width="120" header="Personal" class=center>
                        <v-filter>
                            <input v-model="filters.personal" />
                        </v-filter>
                        {{ row.personal }}
                    </td>
                    <td width="120" header="Brigadistas" class=center>
                        <v-filter>
                            <input v-model="filters.brigadistas" />
                        </v-filter>
                        {{ row.brigadistas }}
                    </td>
                    <td width="120" header="Equipo Técnico" class=center>
                        <v-filter>
                            <input v-model="filters.equipo_tecnico" />
                        </v-filter>
                        {{ row.equipo_tecnico }}
                    </td>
                    <td width="120" header="Creador" class=center>
                        <v-filter>
                            <input v-model="filters.uid_insert" />
                        </v-filter>
                        {{ row.uid_insert }}
                    </td>
                    <td width="120" header="Fecha Insert" class=center>
                        <v-filter>
                            <input v-model="filters.insert_date" />
                        </v-filter>
                        {{ row.insert_date }}
                    </td>
                </template>
            </v-table>
        </v-form>
    </ion-page>
</template>
<script>
import { ui } from 'isobit-ui'
import { category } from './constants';
export default ui({
    setup() {
        const rowClass = (row) => {
            //row.synchronized ? 'green' : (row.tmpId > 0 ? 'yellow' : '')
            return row.editable ? 'bold' : 'bold'
        }
        return { rowClass };
    },
    data() {
        return { data: [], mode: 0, query: null, category }
    },
    created() {
        //const me = this;
        //me.filters.uid = me.user.uid;
        //console.log(me)
        /*
        me.$on('sync', (dr, dl) => {//data remote -> data local
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
    computed: {
        editable() {
            const selected = this.getSelected()[0];
            return selected ? 1 * selected.editable : null;
        }
    },
    methods: {
        view(o) {
            this.open('/admin/desarrollo-social/emed/' + (o.tmpId ? (-o.tmpId) : o.id));
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