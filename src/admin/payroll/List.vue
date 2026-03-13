<template>
    <ion-page>

        <v-form header="Planillas" action="/admin/payroll">

            <v-table
                ref="table"
                rowKey="id"
                src="/api/payroll"
                :pagination="20"
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

                    <td width="80" header="Número" class="center">
                        <v-filter>
                            <input v-model="filters.number"/>
                        </v-filter>
                        {{ row.number }}
                    </td>

                    <td width="80" header="Mes" class="center">
                        <v-filter>
                            <input v-model="filters.month"/>
                        </v-filter>
                        {{ row.month }}
                    </td>

                    <td width="120" header="Tipo" class="center">
                        <v-filter>
                            <input v-model="filters.typeId"/>
                        </v-filter>
                        {{ row.typeId }}
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

                    <label>Número</label>
                    <input type="number" v-model="o.number"/>

                    <label>Mes</label>
                    <input type="number" v-model="o.month"/>

                    <label>Tipo</label>
                    <input v-model="o.typeId"/>

                    <label>Fuente Financiamiento</label>
                    <input v-model="o.idFuenteFinanc"/>

                    <label>Comentarios</label>
                    <textarea v-model="o.comments"/>

                    <label>Fecha Generación</label>
                    <input type="datetime-local" v-model="o.generateDate"/>

                    <label>Cerrado</label>
                    <input type="checkbox" v-model="o.closed"/>

                    <label>Cancelado</label>
                    <input type="checkbox" v-model="o.canceled"/>

                    <label>Preparado por</label>
                    <input v-model="o.preparedBy"/>

                </div>

            </v-form>

        </div>

    </ion-page>
</template>

<script>
import { ui, MsgBox } from 'isobit-ui'
import { ref } from 'vue'

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
            o.value = {}
            openForm()
        }

        const view = (o) => {
            const selected = table.value.load.selected.value
            o.value = { ...selected[0] }
            open('/admin/payroll/' + (o.value.tmpId ? (-o.value.tmpId) : o.value.id));
        }
    
        return {
            o,
            form,
            table,
            edit,
            create,
            view
        }

    }

})
</script>