<template>
    <ion-page>
        <v-form header="Movimiento" action="/admin/hr/movement">
            <v-table :selectable="true" :row-style-class="rowClass" store="emed" :scrollable="true" rowKey="id"
                :pagination="20" @updated="bindLinks($el)" :filters="filters" src="/api/hr/movement">
                <template v-slot:header>
                    <v-button value="Crear" v-if="perms.HR_PERSONAL_REGISTER" icon="fa-plus" class="on"
                        @click.prevent="create"></v-button>
                    <v-button value="Editar" v-if="perms.HR_PERSONAL_REGISTER" icon="fa-pen" @click.prevent="edit"
                        :disabled="!editable"></v-button>
                    <v-button value="Ver" icon="fa-search" @click.prevent="view(getSelected()[0])"
                        :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Eliminar" v-if="perms.HR_PERSONAL_ADMIN" icon="fa-trash" @click.prevent="destroy"
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
                    <td width="80" class="center" header="DNI">
                        <v-filter>
                            <input v-model="filters.dni" />
                        </v-filter>
                        {{ row.dni }}
                    </td>
                    <td width="220" header="Apellidos Nombres" >
                        <v-filter>
                            <input v-model="filters.apellidosNombres" />
                        </v-filter>
                        {{ row.apellidosNombres }}
                    </td>
                    <td width="110" header="Fecha Asignación" class="center">
                        <v-filter>
                            <input v-model="filters.fechaAsignacion" />
                        </v-filter>
                        {{ row.fechaAsignacion }}
                    </td>
                    <td width="220" header="Acta Asignación">
                        <v-filter>
                            <input v-model="filters.actaAsignacion" />
                        </v-filter>
                        <a :href="`/wp-content/uploads/movements/${row.filename}`" target="_">{{ row.actaAsignacion }}</a>
                    </td>
                    <td width="110" header="Fecha Devolución" class="center">
                        <v-filter>
                            <input v-model="filters.fechaDevolucion" />
                        </v-filter>
                        {{ row.fechaDevolucion }}
                    </td>
                    <td width="220" header="Acta Devolución">
                        <v-filter>
                            <input v-model="filters.actaDevolucion" />
                        </v-filter>
                        <a :href="`/wp-content/uploads/movements/${row.filenameDev}`" target="_">{{ row.actaDevolucion }}</a>
                    </td>
                </template>
            </v-table>
        </v-form>
    </ion-page>
</template>
<script>
import { ui } from 'isobit-ui'
import { contract_type, afp_onp, organ } from '../personal/constants';
export default ui({
    setup() {
        const rowClass = (row) => {
            //row.synchronized ? 'green' : (row.tmpId > 0 ? 'yellow' : '')
            return row.editable ? 'bold' : ''
        }
        return { rowClass };
    },
    data() {
        return { data: [], mode: 0, query: null, contract_type, afp_onp, organ }
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
            return selected ? 1 * /*selected.editable : null*/1:0;
        }
    },
    methods: {
        view(o) {
            this.open('/admin/hr/movement/' + (o.tmpId ? (-o.tmpId) : o.id));
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