<template>
  <v-form
    action="/api/uti/ip"
    :header="(o.id ? 'Editar' : 'Crear') + ' Atención'"
  >
    <div class="v-form">

      <label>Categoria:</label>
      <v-textarea
        v-model="o.category"
        rows="1"
      />

      <label>Codigo:</label>
      <input v-model="o.code" />

      <v-button
        value="Scanear"
        @click.prevent="scan"
      />

      <v-fieldset v-if="scanResult">
        <template
          v-for="(item, index) in scanResult"
          :key="index"
        >
          <div
            v-for="(v, k) in item"
            :key="k"
          >
            {{ k }}={{ v }}
          </div>
        </template>
      </v-fieldset>

      <label>Tipo:</label>
      <v-radio-group v-model="o.type">
        <v-radio label="WIFI" value="W" />
        <v-radio label="ETHERNET" value="E" />
      </v-radio-group>

      <label>Usuario:</label>
      <input v-model="o.name" />

      <label>Cargo:</label>
      <input v-model="o.position" />

      <label>Antivirus:</label>
      <v-radio-group v-model="o.antivirus">
        <v-radio label="SI" value="SI" />
        <v-radio label="NO" value="NO" />
      </v-radio-group>

      <label>Restriction:</label>
      <v-switch v-model="o.restriction" />


      <!-- Escritorio Remoto -->

      <v-fieldset
        legend="Escritorio Remoto"
        class="v-form"
      >
        <label>Server:</label>
        <input v-model="o.remoteServer" />

        <label>Codigo:</label>
        <input v-model="o.remoteCode" />

        <label>Contraseña:</label>

        <div style="position: relative">

          <input
            v-if="showRemotePass"
            v-model="o.remotePass"
          />

          <input
            v-else
            v-model="o.remotePass"
            type="password"
            disabled
          />

          <i
            style="
              position: absolute;
              right: 7px;
              top: 6px;
              cursor: pointer;
            "
            class="fa"
            :class="showRemotePass ? 'fa-key' : 'fa-eye'"
            :style="{
              color: showRemotePass ? 'black' : 'white'
            }"
            @click="showRemotePass = !showRemotePass"
          />
        </div>
      </v-fieldset>


      <!-- Estabilizador -->

      <v-fieldset
        legend="Estabilizador"
        class="v-form"
      >
        <label>Tiene estabilizador:</label>
        <v-switch v-model="o.stabilizer" />

        <label>Codigo Patrimonial:</label>
        <input v-model="o.stabilizerCode" />

        <label>Descripcion:</label>
        <v-textarea
          v-model="o.stabilizerDescription"
          rows="3"
          maxlength="245"
        />
      </v-fieldset>
      <v-fieldset
        legend="Impresora o Fotocopiadora"
        class="v-form"
      >
        <label>Impresora:</label>
        <v-switch v-model="o.printer" />

        <label>Codigo Patrimonial:</label>
        <input v-model="o.printerCode" />

        <label>Modelo:</label>
        <input v-model="o.printerModel" />

        <label>Serie:</label>
        <input v-model="o.printerSerie" />

        <label>Descripcion:</label>
        <v-textarea
          v-model="o.printerDescription"
          rows="3"
          maxlength="245"
        />
      </v-fieldset>


      <!-- Equipo -->

      <v-fieldset
        legend="Equipo"
        class="v-form"
      >
        <label>Código Patrimonial:</label>
        <input v-model="o.patrimonialCode" />

        <label>Nombre:</label>
        <input v-model="o.device" />

        <label>Modelo:</label>
        <input
          v-model="o.deviceModel"
          maxlength="100"
        />

        <label>Serie:</label>
        <input v-model="o.deviceSerie" />

        <label>Mac ID:</label>
        <input
          v-model="o.macId"
          maxlength="17"
        />

        <label>Workgroup:</label>
        <input v-model="o.workgroup" />

        <label>Descripción:</label>
        <v-textarea
          v-model="o.description"
          rows="1"
          maxlength="145"
        />
      </v-fieldset>


      <!-- SIAF -->

      <v-fieldset
        legend="SIAF"
        class="v-form"
      >
        <label>Servidor:</label>
        <input v-model="o.siaf" />

        <label>Usuario:</label>
        <input v-model="o.userSiaf" />

        <label>Clave:</label>
        <input v-model="o.clave" />
      </v-fieldset>


      <!-- Mantenimiento -->

      <v-fieldset
        legend="Mantenimiento"
        class="v-form"
      >
        <label>Tipo:</label>

        <v-radio-group v-model="o.maintenanceType">
          <v-radio
            label="PREVENTIVO"
            value="P"
          />

          <v-radio
            label="CORRECTIVO"
            value="C"
          />
        </v-radio-group>

        <label>Fecha:</label>
        <v-calendar
          v-model="o.maintenanceDate"
        />
      </v-fieldset>


      <!-- Office -->

      <v-fieldset
        legend="TITULO OFICCE 2021"
        class="v-form"
      >
        <label>Licencia Serie:</label>
        <input v-model="o.licenseSerie" />

        <label>Codigo de Activación:</label>
        <input v-model="o.activationCode" />

        <label>Fecha:</label>
        <v-calendar
          v-model="o.activationDate"
        />
      </v-fieldset>


      <label>Habilitado:</label>
      <v-switch v-model="o.active" />

    </div>


    <center>
      <v-button
        value="Grabar"
        icon="fa-save"
        class="blue"
        @click.prevent="save"
      />

      <v-button
        style="margin-left: 10px"
        value="Cancelar"
        icon="fa-ban"
        @click.prevent="close"
      />
    </center>

  </v-form>
</template>


<script>
import { ui } from 'isobit-ui'

import {
  computed,
  ref,
} from 'vue'


export default ui({

  props: [
    'id',
    'callback',
  ],


  setup({
    app,
    id,
    callback,
  }) {

    const { axios } = app


    const oRef = ref({
      ext: {
        server: null,
        client: null,
        dependency: null,
      },
      dependencyId: null,
    })


    const scanResult = ref(null)

    const filter = ref(null)

    const showRemotePass = ref(false)

    const user = computed(() => {
      return app.session
    })

    const canAttend = computed(() => {

      const u = user.value

      return (
        u?.ext?.perms?.ATTEND_UTI_ATTENTION
        || u?.uid == 1
      )
    })

    const inputClient = (v) => {

      const o = oRef.value

      o.clientId = v
        ? v.peopleId
        : null

      if (v) {
        o.dependencyId = v.dependencyId
        o.ext.dependency = v.dependency
      }
    }


    const dependencyInput = (v) => {
      oRef.value.dependencyId = v? v.id: null
    }

    const scan = () => {

      const code = oRef.value.code

      if (!code) {
        return
      }

      axios
        .get(
          '/api/ipscan/?q=' +
          encodeURIComponent(code)
        )
        .then(response => {

          scanResult.value = response.data
        })
    }

    const find = (id) => {
      if(id)
        axios.get(`/api/uti/ip/${id}`).then(response => {
            const o = response.data
            o.ext = o.ext || {
              server: null,
              client: null,
              dependency: null,
            }
            oRef.value = o
          })
    }

    find(id);


    const process = (o) => {

      /*const user = this.user

      if (o.peopleId == '0') {
        o.peopleId = null
      }

      if (!o.user) {
        o.user = user.idDir
      }*/

      return o
    }

    return {
      o: oRef,
      process,
      scanResult,
      filter,
      showRemotePass,

      user,
      canAttend,

      inputClient,
      dependencyInput,

      scan
    }
  },

})
</script>