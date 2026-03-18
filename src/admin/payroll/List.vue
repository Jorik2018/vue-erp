<template>
    <ion-page>
        <v-form header="Planillas" action="/admin/payroll">
            <v-table
                ref="table"
                rowKey="id"
                src="/api/payroll"
                :pagination="20"
                :row-style-class="rowStyleClass"
                :filters="filters"
                :selectable="true"
                :scrollable="true"
            >
                <template v-slot:header>
                    <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create"></v-button>
                    <v-button value="Editar" icon="fa-pen" @click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Ver" icon="fa-search" @click.prevent="view(getSelected()[0])"
                        :disabled="!rowSelectedCount"></v-button>
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

                    <td width="80" header="Año" class="center">
                        <v-filter>
                            <input v-model="filters.year"/>
                        </v-filter>
                        {{ row.year }}
                    </td>
                    <td width="80" header="Mes" class="center">
                        <v-filter>
                            <input v-model="filters.month"/>
                        </v-filter>
                        {{ MONTH_NAME[row.month]?.toUpperCase()|| row.month}}
                        
                    </td>
                    <td width="80" header="Número" class="center">
                        <v-filter>
                            <input v-model="filters.number"/>
                        </v-filter>
                        {{ row.number }}
                    </td>
                    <td width="240" header="Tipo">
                        <v-filter>
                            <input v-model="filters.typeId"/>
                        </v-filter>
                        {{ row.typeName }}
                    </td>
                    <td width="160" header="Fuente Financ." class="center">
                        <v-filter>
                            <input v-model="filters.idFuenteFinanc"/>
                        </v-filter>
                        {{ row.idFuenteFinanc }}
                    </td>
                    <td width="240" header="Comentarios">
                        <v-filter>
                            <input v-model="filters.comments"/>
                        </v-filter>
                        {{ row.comments }}
                    </td>

                    <td width="120" header="Fecha Generación" class="center">
                        <v-filter>
                            <input v-model="filters.generateDate"/>
                        </v-filter>
                        {{ row.generateDate }}
                    </td>

                    <td width="80" header="Cerrado" class="center">
                        <v-filter>
                            <input v-model="filters.closed"/>
                        </v-filter>
                        {{ row.closed }}
                    </td>

                    <td width="80" header="Cancelado" class="center">
                        <v-filter>
                            <input v-model="filters.canceled"/>
                        </v-filter>
                        {{ row.canceled }}
                    </td>

                    <td width="120" header="Preparado por" class="center">
                        <v-filter>
                            <input v-model="filters.preparedBy"/>
                        </v-filter>
                        {{ row.preparedBy }}
                    </td>

                </template>

            </v-table>

        </v-form>

        <div style="display:none">

            <v-form
                action="/api/payroll"
                :header="o.id ? 'Editar' : 'Crear' + ' Planilla'"
                id="form"
                width="480"
            >

                <div v-if="form" class="v-form">

                    <label>Año</label>
                    <input type="number" v-model="o.year"/>
                    <label>Mes</label>
                    <v-select v-model="o.month" required>
                        <option value="">Select One...</option>
                        <v-options :data="MONTHS" value-field="id" display-field="name"></v-options>
                    </v-select>
                    <label>Número</label>
                    <input type="number" v-model="o.number"/>
                    <label>Tipo</label>
                    <input v-model="o.typeId"/>
                    <label>Fuente Financiamiento</label>
                    <input v-model="o.idFuenteFinanc"/>
                    <label>Comentarios</label>
                    <v-textarea v-model="o.comments"/>
                </div>
            </v-form>

        </div>

    </ion-page>
</template>

<script>
import { ui, MsgBox } from 'isobit-ui'
import { ref } from 'vue'
import { MONTH_NAME } from './constants';

export default ui({

    setup({ open }) {

        const o = ref({})
        const table = ref(null)
        const form = ref(false)

        const openForm = () => {

            form.value = true

            MsgBox(
                document.querySelector('#form'),[]
            )

        }

        const edit = () => {
            const selected = table.value.load.selected.value
            o.value = { ...selected[0] }
            openForm()

        }

        const create = () => {
            const today = new Date();
            o.value = {year:today.getFullYear(), month:today.getMonth()+1}
            openForm()
        }

        const view = (o) => {
            open('/admin/payroll/' + (o.tmpId ? (-o.tmpId) : o.id));
        }

        const rowStyleClass = (row) => {
            return row.closed=='1'?'gray':row.generateDate?'yellow':'green'
        }
    
        return {
            o,
            form,
            rowStyleClass,
            table,
            edit,
            create,
            view,
            MONTH_NAME,
            MONTHS:Object.entries(MONTH_NAME).map(([id,name]) => ({ id:Number(id), name:name.toUpperCase() }))
        }

    }

})
</script>