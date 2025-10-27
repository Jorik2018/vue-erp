<template>
    <ion-page>
        <v-form header="Movimiento" action="/admin/hr/movement">
            <v-table :selectable="true" :row-style-class="rowClass" store="emed" :scrollable="true" rowKey="id"
                :pagination="20" @updated="bindLinks($el)" :filters="filters" src="/api/hr/movement">
                <template v-slot:header>
                    <v-button value="Enviar" v-if="app.connected && perms.HR_PERSONAL_REGISTER" icon="fa-save"
                        :disabled="!rowSelectedCount" @click.prevent="sync"></v-button>
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
                    <td width="80" class="center" header="Secuencia Funcional">
                        <v-filter>
                            <input v-model="filters.secuenciaFuncional" />
                        </v-filter>
                        {{ row.secuenciaFuncional }}
                    </td>
                    <td width="120" class="center" header="Actividad">
                        <v-filter>
                            <input v-model="filters.actividad" />
                        </v-filter>
                        {{ row.actividad }}
                    </td>
                    <td width="80" class="center" header="DNI">
                        <v-filter>
                            <input v-model="filters.dni" />
                        </v-filter>
                        {{ row.dni }}
                    </td>
                    <td width="120" header="AIRHSP" class="center">
                        <v-filter>
                            <input v-model="filters.codigoAirhsp" />
                        </v-filter>
                        {{ row.codigoAirhsp }}
                    </td>
                    <td width="220" header="Apellidos Nombres" >
                        <v-filter>
                            <input v-model="filters.apellidosNombres" />
                        </v-filter>
                        {{ row.apellidosNombres }}
                    </td>
                    <td width="220" header="Organo" :title="'==='+filters.organo">
                        <v-filter>
                            <v-select v-model="filters.organo">
                                <option value="">Select One...</option>
                                <v-options :data="organ" value-field="name"></v-options>
                            </v-select>
                        </v-filter>
                        {{ row.organo }}
                    </td>
                    <td width="220" header="Unidad Organica" >
                        <v-filter>
                            <input v-model="filters.unidadOrganica" />
                        </v-filter>
                        {{ row.unidadOrganica }}
                    </td>
                    <td width="220" header="Cargo" >
                        <v-filter>
                            <input v-model="filters.cargo" />
                        </v-filter>
                        {{ row.cargo }}
                    </td>
                    <td width="90" header="Fecha Inicio Contrato" class="center">
                        <v-filter>
                            <input v-model="filters.fechaDeInicioContrato" />
                        </v-filter>
                        {{ row.fechaDeInicioContrato }}
                    </td>
                    <td width="90" header="Fecha Inicio Ofis" class="center">
                        <v-filter>
                            <input v-model="filters.fechaDeInicioOfis" />
                        </v-filter>
                        {{ row.fechaDeInicioOfis }}
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
            this.open('/admin/hr/personal/' + (o.tmpId ? (-o.tmpId) : o.id));
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