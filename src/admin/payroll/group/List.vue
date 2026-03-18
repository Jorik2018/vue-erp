<template>
  <ion-page>
    <v-form header="Grupos" action="/admin/group">
      <v-table ref="table" rowKey="id" src="/api/group/group" :pagination="20" :scrollable="true" :selectable="true">
        <template v-slot:header>
          <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create"></v-button>
          <v-button value="Editar" icon="fa-pen" @click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
          <v-button value="Eliminar" icon="fa-trash" @click.prevent="destroy" :disabled="!rowSelectedCount"></v-button>
          <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
        </template>

        <template v-slot="{ row }">
          <td width="60" header="ID" class="center">{{ row.id }}</td>
          <td width="240" header="Nombre">{{ row.name }}</td>
          <td width="240" header="Parent">{{ row.parentName || '-' }}</td>
          <td width="120" header="Es Parent" class="center">{{ row.isParent ? 'Sí' : 'No' }}</td>
        </template>
      </v-table>
    </v-form>

    <div style="display:none">
      <v-form :header="o.id ? 'Editar' : 'Crear' + ' Grupo'" id="form" width="480" action="/api/group/group">
        <div v-if="form" class="v-form">
          <label>Nombre:</label>
          <input v-model="o.name" required />

          <label>Tipo:</label>
          <v-select v-model="o.parentId">
            <option value="">Ninguno</option>
            <v-options src="/api/payroll/group/0/0?orphan=1" :filters="{orphan:1}" value-field="id" display-field="name"></v-options>
          </v-select>
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
      create
    }
  }
})
</script>