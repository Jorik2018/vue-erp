<template>
    <ion-page>
        <v-form header="Conceptos" action="/admin/payroll/concept">
            <v-table :selectable="true" :row-style-class="rowClass" ref="table" :scrollable="true" rowKey="id"
                :pagination="20" :filters="filters" src="/api/payroll/concept">
                <template v-slot:header>
                    <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create"></v-button>
                    <v-button value="Editar" icon="fa-pen" @click.prevent="edit"
                        :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Eliminar" icon="fa-trash" @click.prevent="destroy"
                        :disabled="!rowSelectedCount"></v-button>
                    <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
                </template>

                <template v-slot="{ row }">
                    <td width="60" class="center" header="ID">
                        <v-filter>
                            <input v-model="filters.id" />
                        </v-filter>
                        {{ row.id }}
                    </td>
                    <td width="200" class="center" header="Nombre">
                        <v-filter>
                            <input v-model="filters.name" />
                        </v-filter>
                        {{ row.name }}
                    </td>
                    <td width="120" class="center" header="Abreviatura">
                        <v-filter>
                            <input v-model="filters.abbreviation" />
                        </v-filter>
                        {{ row.abbreviation }}
                    </td>
                    <td width="120" header="Tipo" class="center">
                        <v-filter>
                            <input v-model="filters.typeId" />
                        </v-filter>
                        {{ row.typeId }}
                    </td>
                    <td width="120" header="Código PDT" class="center">
                        <v-filter>
                            <input v-model="filters.pdtCode" />
                        </v-filter>
                        {{ row.pdtCode }}
                    </td>
                    <td width="160" header="Clase" class="center">
                        <v-filter>
                            <input v-model="filters.class" />
                        </v-filter>
                        {{ row.class }}
                    </td>
                    <td width="160" header="Padre" class="center">
                        <v-filter>
                            <input v-model="filters.parentId" />
                        </v-filter>
                        {{ row.parentId }}
                    </td>
                    <td width="260" header="Fórmula">
                        <v-filter>
                            <input v-model="filters.formula" />
                        </v-filter>
                        {{ row.formula }}
                    </td>
                </template>
            </v-table>
        </v-form>
        <div style="display:none">
            <v-form action="/api/payroll/concept" :header="o.id ? 'Editar' : 'Crear' + ' Concepto'" id="form"
                width="460">
                <div v-if="form" class="v-form">
                    <label>Nombre:</label>
                    <input v-model="o.name" required />
                    <label>Abreviatura:</label>
                    <input v-model="o.abbreviation" />
                    <label>Tipo:</label>
                    <input v-model="o.typeId" />
                    <label>Padre:</label>
                    <v-select v-model="o.parentId" :options="parents" value-field="id" display-field="name" />
                    <label>Código PDT:</label>
                    <input v-model="o.pdtCode" />
                    <label>Clase:</label>
                    <input v-model="o.class" />
                    <label>Fórmula:</label>
                    <input v-model="o.formula" />
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
import { ref } from 'vue'

export default ui({
    setup() {
        const o = ref({})
        const table = ref(null)
        const form = ref(false)
        const openForm = () => {
            form.value = true
            MsgBox(document.querySelector('#form'),[])
        }
        const edit = () => {
            o.value = { ...table.value.load.selected.value[0] }
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