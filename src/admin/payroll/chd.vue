<template>
    <v-page class="v-form" header="CONSTANCIA DE PAGO DE HABERES Y DESCUENTOS" store="setting">
        <div class="v-form" style="flex-direction: column;display: flex;flex: 1 1 0%;">
            <label>Empleado:</label>
            <v-autocomplete placeholder="Ingrese mas de 2 letras y presione ENTER" src="api/hr/employee"
                v-model="o.employee">
                <template v-slot:label="{ selected }">
                    {{ selected.code }}: {{ selected.fullName }}
                </template>
                <template v-slot="{ row }">
                    <a v-bind:href="'/admin/directorio/' + row.id" onclick="return false">
                        <span>{{ row.code }}</span>:
                        {{ row.fullName ? row.fullName.toUpperCase() : null }}
                    </a>
                </template>
            </v-autocomplete>
            <v-button :disabled="!o.employee" style="margin-top: 10px;" icon="fa fa-download" value="Generar Constancia"
                v-on:click="send" />
            <iframe vif="pdfUrl" :src="pdfUrl" width="100%" height="0px" style="flex:1"></iframe>
        </div>
    </v-page>
</template>

<script>
import axios from 'axios'
import { reactive, ref } from 'vue'
import { ui } from "isobit-ui"

export default ui({
setup() {
    const o = reactive({
      id: null,
      employee: null
    })
    const pdfUrl = ref()
    const image = 0

    const base =
      'http://web.regionancash.gob.pe/cdn/web/viewer.html?v=1&file=http://web.regionancash.gob.pe/admin/uti/api/document/download/'

    function send() {
        axios.post('/api/hd/report', { employee: o.employee.id },{
            responseType: 'blob'
        }).then(({ data }) => {
            const file = new Blob([data], { type: 'application/pdf' })
            const fileURL = URL.createObjectURL(file)
            pdfUrl.value = fileURL
        })
    }

    return {
        pdfUrl,
        o,
        image,
        base,
        send
    }
  }
})
</script>