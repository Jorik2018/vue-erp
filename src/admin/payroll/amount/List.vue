<template>
    <ion-page>
        <v-form header="Montos" action="/admin/payroll/amount">
            <v-table ref="table" rowKey="id" src="/api/payroll/amount" :pagination="20" :filters="filters"
                :selectable="true" :scrollable="true">
                <template v-slot:header>
                    <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create"></v-button>
                    <v-button value="Editar" icon="fa-pen" @click.prevent="edit"
                        :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Eliminar" icon="fa-trash" @click.prevent="destroy"
                        :disabled="!rowSelectedCount"></v-button>
                    <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
                </template>

                <template v-slot="{ row }">
                    <td width="60" header="ID" class="center">
                        {{ pad(row.id, 4) }}
                    </td>
                    <td width="140" header="Tipo Planilla" class="center">
                        <v-filter>
                            <input v-model="filters.payrollTypeId" />
                        </v-filter>
                        {{ row.payrollType }}
                    </td>

                    <td width="180" header="Tipo" class="center">
                        <v-filter>
                            <input v-model="filters.type" />
                        </v-filter>
                        {{ TARGET_TYPE_NAME[row.type]||row.type }}
                    </td>

                    <td width="180" header="Destino" class="center">
                        <v-filter>
                            <input v-model="filters.targetId" />
                        </v-filter>
                        {{ row.targetName?.toUpperCase()||row.targetId }}
                    </td>

                    <td width="220" header="Concepto" class="center">
                        <v-filter>
                            <input v-model="filters.concept" />
                        </v-filter>
                        {{ row.conceptName }}
                    </td>
                    <td width="120" header="Monto" class="right">
                        <v-filter>
                            <input v-model="filters.amount" />
                        </v-filter>
                        {{ row.amount }}
                    </td>
                    <td width="120" header="Inicio" class="center">
                        <v-filter>
                            <input v-model="filters.iniDate" />
                        </v-filter>
                        {{ row.iniDate }}
                    </td>

                    <td width="120" header="Fin" class="center">
                        <v-filter>
                            <input v-model="filters.endDate" />
                        </v-filter>
                        {{ row.endDate }}
                    </td>
                </template>
            </v-table>

        </v-form>

        <div style="display:none">

            <v-form :header="o.id ? 'Editar' : 'Crear' + ' Monto'" id="form" width="480" action="/api/payroll/amount">

                <div v-if="form" class="v-form">
                    <v-fieldset legend="Destino">
                        <label>Tipo:</label>
                        <v-select v-model="o.type" name="event" required>
                            <option value="">Select One...</option>
                            <v-options :data="targetType" value-field="id" display-field="name"></v-options>
                        </v-select>
                        <v-template v-if="o.type == 'PT'">
                            <label>Tipo Planilla:</label>
                            <input v-model="o.targetId" />
                        </v-template>
                        <v-template v-if="o.type == 'GR'">
                            <label>Grupo:</label>
                            <v-select v-model="o.targetId" required>
                                <option value="">Select One...</option>
                                <v-options store="group" value-field="id" display-field="name"></v-options>
                            </v-select>
                        </v-template>
                        <v-template v-if="o.type == 'PE'">
                            <label>Persona:</label>
                            <v-autocomplete placeholder="Ingrese mas de 5 caracteres y presione ENTER" page="20"
                                :show-selection="true" inputClass="center" @input="inputPeople" minQueryLength="5" required v-model="o.targetId"
                                src="/api/hr/personal">
                                <template v-slot:label="{ selected }">
                                    <template v-if="selected">
                                        {{ selected.code }}: {{ selected.fullName }}
                                    </template>
                                </template>
                                <template v-slot="{ row }">
                                    {{ row.code }}: {{ row.fullName }}
                                </template>
                            </v-autocomplete>
                        </v-template>
                        <v-template v-if="o.type">
                            <label>Tipo Planilla</label>
                            <v-select v-model="o.payrollType">
                                <option value="">All...</option>
                                <v-options src="/api/payroll/type" value-field="id" display-field="name"></v-options>
                            </v-select>
                        </v-template>
                    </v-fieldset>
                    <v-fieldset legend="Concepto">
                        <label>Tipo:</label>
                        <v-select v-model="o.conceptType" required
                            @input="$refs.concept.load({ typeId: o.conceptType })">
                            <option value="">Select One...</option>
                            <v-options :data="conceptType" value-field="id">
                                <template #default="{ item }">
                                    {{ item.id }}: {{ item.name }}
                                </template>
                            </v-options>
                        </v-select>
                        <label>Concepto:</label>
                        <v-select ref="concept" :disabled="!o.conceptType" v-model="o.concept">
                            <option value="">Select One...</option>
                            <v-options name="concept" store="concept" value-field="id" display-field="name" />
                        </v-select>
                    </v-fieldset>
                    <label>Fecha Inicio:</label>
                    <input type="date" v-model="o.iniDate" required />
                    <label>Fecha Fin:</label>
                    <input type="date" v-model="o.endDate" />
                    <label>Monto:</label>
                    <v-number v-model="o.amount" required />
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
import { targetType, conceptType } from '../constants';

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
            form,
            table,
            edit,
            create,
            targetType,
            conceptType,
            TARGET_TYPE_NAME: Object.fromEntries(targetType.map(o => [o.id, o.name]))
        }

    }

})
</script>