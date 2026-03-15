<template>
    <ion-page>
        <v-form header="Personas por Grupo" action="/admin/payroll/group-people">
            <v-table ref="table" rowKey="id" src="/api/payroll/group-people" :pagination="20" :filters="filters"
                :selectable="true" :scrollable="true">
                <template v-slot:header>
                    <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create"></v-button>
                    <v-button value="Eliminar" icon="fa-trash" @click.prevent="destroy"
                        :disabled="!rowSelectedCount"></v-button>
                    <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
                </template>
                <template v-slot="{ row }">
                    <td width="60" header="ID" class="center">
                        {{ pad(row.id, 4) }}
                    </td>
                    <td width="120" header="Código" class="center">
                        <v-filter>
                            <input v-model="filters.code" />
                        </v-filter>
                        {{ row.code }}
                    </td>

                    <td width="220" header="Nombre">
                        <v-filter>
                            <input v-model="filters.fullName" />
                        </v-filter>
                        {{ row.fullName }}
                    </td>

                    <td width="200" header="Grupo">
                        <v-filter>
                            <input v-model="filters.groupName" />
                        </v-filter>
                        {{ row.groupName }}
                    </td>

                </template>
            </v-table>
        </v-form>

        <div style="display:none">

            <v-form header="Agregar Persona en Grupo" id="form" width="420" action="/api/payroll/group-people">

                <div v-if="form" class="v-form">
                    <label>Persona:</label>
                    <v-autocomplete placeholder="Ingrese mas de 5 caracteres y presione ENTER"  page="20"
                        :show-selection="true" inputClass="center"
                        minQueryLength="5" required v-model="o.people" @complete="peopleComplete"
                        src="/api/hr/personal">
                        <template v-slot:label="{ selected }">
                            <template v-if="selected">
                                {{ selected.code }}: {{ selected.apellidosNombres }}
                            </template>
                        </template>
                        <template v-slot="{ row }">
                            {{ row.code }}: {{ row.apellidosNombres }}
                        </template>
                    </v-autocomplete>
                    <label>Grupo:</label>
                    <v-select v-model="o.group" required>
                        <option value="">Select One...</option>
                        <v-options store="group" value-field="id" display-field="name">
                        </v-options>
                    </v-select>

                </div>

                <center>
                    <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save">
                    </v-button>
                </center>

            </v-form>

        </div>

    </ion-page>
</template>

<script>

import { ui, MsgBox } from 'isobit-ui'
import { ref } from 'vue'


export default ui({

    setup({ save }) {

        const o = ref({})
        const table = ref(null)
        const form = ref(false)

        const openForm = () => {
            form.value = true
            MsgBox(document.querySelector('#form'), [])
        }

        const edit = () => {
            const selected = table.value.load.selected.value
            o.value = { ...selected[0] }
            openForm()
        }

        const create = () => {
            o.value = {}
            openForm()
        }

        return {
            o,
            table,
            form,
            edit,
            create
        }

    },
    methods:{
        process: ({people:{id}, ...others})=> ({people:id, ...others})
        
    }

})

</script>