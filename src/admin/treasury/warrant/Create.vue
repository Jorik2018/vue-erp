<template>
  <v-form action="/admin/tesoreria/api/warrant" :header="(o.id ? 'Editar' : 'Crear') + ' Carta Fianza'">
    <div class="v-form">

      <label>Proveedor:</label>
      <v-textarea required rows="1" class="ucase" v-model="o.proveedor" title="Proveedor" />

      <label>Expediente:</label>

      <input required id="expediente" class="center" v-model="o.expediente" title="Expediente" />

      <div v-if="!o.id" class="right" style="margin-top: 12px">
        <v-button value="Nuevo expediente" icon="fa-file" @click="nuevoExpediente(0)" />
      </div>


      <label>Entidad:</label>
      <input required id="entidad" class="ucase" v-model="o.entidad" title="Entidad" />

      <label>Obra:</label>
      <v-textarea required v-model="o.obra" title="Obra" />

      <label>Tipo de proceso:</label>
      <v-textarea maxlength="60" rows="1" v-model="o.processType" />

      <label>Tipo:</label>
      <v-select id="tipoGarantia" v-model="o.warrantTypeId" required autoload="true" >
        <option value="">
          Seleccione
        </option>

        <v-options src="/api/treasury/warrant-type/0/0" value-field="id" display-field="name" />
      </v-select>

      <label>Total:</label>
      <input id="total" v-model="o.total" required decimalSeparator="." thousandSeparator="," title="Total" />

      <label>Fecha Renovación:</label>
      <v-calendar id="fechaRenovacion" pattern="dd/MM/yyyy" v-model="o.fechaRenovacion" showOn="button" />

      <label>Nro Carta:</label>
      <input id="nroCarta" v-model="o.nroCarta" />

      <label>Fecha Emisión:</label>
      <v-calendar id="fechaEmision" pattern="dd/MM/yyyy" v-model="o.fechaEmision" showOn="button" />

      <label>Fecha Vencimiento:</label>
      <v-calendar required pattern="dd/MM/yyyy" v-model="o.fechaVencimiento" showOn="button" />

      <label>Fecha Registro:</label>
      <v-calendar id="fechaRegistro" pattern="dd/MM/yyyy" v-model="o.fechaRegistro" showOn="button" />

      <label>Observación:</label>
      <v-textarea id="observacion" v-model="o.observacion" title="Observación" />

      <label>Confirmación Banco:</label>
      <input id="confirmacionBanco" v-model="o.confirmacionBanco" title="Confirmación banco" />

      <label>Renovado:</label>
      <v-switch id="renovado" v-model="o.renovated" />

      <div class="center uploader" style="margin-bottom: 20px;margin-top: 24px;">
        <div v-if="o.ext?.tempFile" style="padding: 10px 0">
          <a :href="remote_path + '/fs/temp/' + o.ext.tempFile" target="_cartaFianza">
            Ver Documento
          </a>
        </div>

        <template v-if="o.upload">

          <div style="padding: 10px 0">
            <a v-if="!o.ext?.tempFile" :href="remote_path + '/fs/tesoreria/cartaFianza/' + o.ext?.src"
              target="_cartaFianza">
              Ver Documento
            </a>
          </div>

          <div style="margin-bottom: 8px">
            <v-checkbox v-model="o.ext.deleteUpload" label="Eliminar archivo adjunto" @input="deleteInput" />
          </div>

        </template>

        <template v-if="o.cartaFianzaUpload">
          <div style="
              word-wrap: break-word;
              padding: 10px 0;
            ">
            {{ o.cartaFianzaUpload.filename }}
          </div>
        </template>

        <v-uploader @input="uploaderInput" />
      </div>

    </div>

    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save" />

      <v-button style="margin-left: 10px" value="Cancelar" icon="fa-ban" @click.prevent="close" />
    </center>

  </v-form>
</template>

<script>
import { ui } from 'isobit-ui'
import { ref } from 'vue'

export default ui({

  props: [
    'id',
    'parent',
    'callback',
  ],


  setup({ app, id, parent, callback }) {

    const { axios } = app

    const oRef = ref({
      ext: {},
    })


    const nuevoExpediente = (parentId = 0) => {

      axios
        .get(
          '/api/treasury/warrant/create/' +
          (parentId || 0)
        )
        .then(response => {

          const o = response.data

          o.ext = o.ext || {}

          o.ext.src = null
          o.ext.tempFile = null

          oRef.value = o
        })
    }


    const changeRoute = () => {
      if (id) {
        axios.get('/api/treasury/warrant/' + id)
          .then(response => {
            const o = response.data
            o.ext = o.ext || {}
            o.ext.tempFile = null
            oRef.value = o
          })

        return
      }
      nuevoExpediente(parent)
    }

    const uploaderInput = (o) => {
      /*oRef.value.ext = {
        ...oRef.value.ext,
        tempFile: file.tempFile
      };*/
      oRef.value.ext.tempFile = o.tempFile;
    }

    const close = () => {
      callback()
    }


    const save = () => {
      callback(45678)
    }

    const remote_path = import.meta.env.VITE_REMOTE_PATH;
    return {
      o: oRef,
      save,
      remote_path,
      changeRoute,
      nuevoExpediente,
      uploaderInput,
      close,
    }
  },


  mounted() {
    this.changeRoute()
  },


  methods: {

    deleteInput(value) {

      this.o.ext = this.o.ext || {}

      this.o.ext.deleteUpload = value
    },


    process(o) {

      console.log(o)

      return o
    },


    close() {

      this.closePopup()
    },

  },

})

</script>