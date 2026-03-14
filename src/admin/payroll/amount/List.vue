<template>
    <ion-page>
        <v-form header="Montos" action="/admin/payroll/amount">
            <v-table
                ref="table"
                rowKey="id"
                src="/api/payroll/amount"
                :pagination="20"
                :filters="filters"
                :selectable="true"
                :scrollable="true"
            >
                <template v-slot:header>
                    <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create"></v-button>
                    <v-button value="Editar" icon="fa-pen" @click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Eliminar" icon="fa-trash" @click.prevent="destroy" :disabled="!rowSelectedCount"></v-button>
                    <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
                </template>

                <template v-slot="{ row }">

                    <td width="60" header="ID" class="center">
                        <v-filter>
                            <input v-model="filters.id"/>
                        </v-filter>
                        {{ row.id }}
                    </td>

                    <td width="140" header="Grupo Planilla" class="center">
                        <v-filter>
                            <input v-model="filters.payrollGroupId"/>
                        </v-filter>
                        {{ row.payrollGroupId }}
                    </td>

                    <td width="140" header="Tipo Planilla" class="center">
                        <v-filter>
                            <input v-model="filters.payrollTypeId"/>
                        </v-filter>
                        {{ row.payrollTypeId }}
                    </td>

                    <td width="80" header="Tipo" class="center">
                        <v-filter>
                            <input v-model="filters.type"/>
                        </v-filter>
                        {{ row.type }}
                    </td>

                    <td width="120" header="Target" class="center">
                        <v-filter>
                            <input v-model="filters.targetId"/>
                        </v-filter>
                        {{ row.targetId }}
                    </td>

                    <td width="120" header="Concepto" class="center">
                        <v-filter>
                            <input v-model="filters.conceptId"/>
                        </v-filter>
                        {{ row.conceptId }}
                    </td>

                    <td width="120" header="Inicio" class="center">
                        <v-filter>
                            <input v-model="filters.iniDate"/>
                        </v-filter>
                        {{ row.iniDate }}
                    </td>

                    <td width="120" header="Fin" class="center">
                        <v-filter>
                            <input v-model="filters.endDate"/>
                        </v-filter>
                        {{ row.endDate }}
                    </td>

                    <td width="120" header="Monto" class="center">
                        <v-filter>
                            <input v-model="filters.amount"/>
                        </v-filter>
                        {{ row.amount }}
                    </td>

                    <td width="80" header="Cancelado" class="center">
                        <v-filter>
                            <input v-model="filters.canceled"/>
                        </v-filter>
                        {{ row.canceled }}
                    </td>

                </template>
            </v-table>

        </v-form>

        <div style="display:none">

            <v-form :header="o.id ? 'Editar' : 'Crear' + ' Monto'" id="form" width="480">

                <div v-if="form" class="v-form">

                    <label>Grupo Planilla</label>
                    <input v-model="o.payrollGroupId"/>

                    <label>Tipo Planilla</label>
                    <input v-model="o.payrollTypeId"/>

                    <label>Tipo</label>
                    <input v-model="o.type"/>

                    <label>Target</label>
                    <input v-model="o.targetId"/>

                    <label>Concepto</label>
                    <input v-model="o.conceptId"/>

                    <label>Fecha Inicio</label>
                    <input type="date" v-model="o.iniDate"/>

                    <label>Fecha Fin</label>
                    <input type="date" v-model="o.endDate"/>

                    <label>Monto</label>
                    <v-number v-model="o.amount"/>
                </div>
                <center>
                    <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
                </center>
            </v-form>

        </div>

    </ion-page>
</template>

<script>
import { ui, MsgBox } from 'isobit-ui'
import axios from 'axios'
import { ref } from 'vue'

export default ui({

    setup({ save }) {

        const o = ref({})
        const table = ref(null)
        const form = ref(false)

        const openForm = () => {
            form.value = true
            MsgBox(document.querySelector('#form'),[])
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
            form,
            table,
            edit,
            create
        }

    }

})
</script>