<template>
  <v-form action="/api/uti/ip" :header="(o.id ? 'Editar' : 'Crear') + ' Atención'">
    <div class="v-form">

      <label>Categoria:</label>
      <v-textarea v-model="o.category" rows="1" />

      <label>Codigo:</label>
      <div style="display:flex">
        <input v-model="o.code" style="flex:1" class="center" />

        <v-button value="Scanear" @click.prevent="scan" :disabled="!o.code" />
      </div>


<v-fieldset v-if="scanResult?.length">
  <template #legend>
    Resultado del escaneo
  </template>

  <div
    v-for="(item, index) in scanResult"
    :key="item.ip || index"
    class="scan-device"
  >
    <!-- Cabecera -->
    <div class="scan-device__header">
      <div>
        <strong>
          {{ item.name || item.ip }}
        </strong>

        <span class="scan-device__ip">
          {{ item.ip }}
        </span>
      </div>

      <span
        class="scan-status"
        :class="'scan-status--' + item.status"
      >
        {{ item.status }}
      </span>
    </div>

    <!-- Información -->
    <div class="scan-device__info">

      <div>
        <span>MAC</span>
        <strong>
          {{ item.macAddress || 'No disponible' }}
        </strong>
      </div>

      <div>
        <span>NetBIOS</span>
        <strong>
          {{ item.netBIOSName || 'No disponible' }}
        </strong>
      </div>

      <div>
        <span>Grupo</span>
        <strong>
          {{ item.netBIOSGroup || 'No disponible' }}
        </strong>
      </div>

      <div>
        <span>Fabricante</span>
        <strong>
          {{ item.manufacturer || 'No identificado' }}
        </strong>
      </div>

    </div>

    <!-- Servicios -->
    <div
      v-if="item.services?.length"
      class="scan-services"
    >
      <strong>Servicios detectados</strong>

      <ul>
        <li
          v-for="(service, sIndex) in item.services"
          :key="sIndex"
        >
          <strong v-if="service.service !== 'unknown'">
            {{ service.service }}
          </strong>

          <span>
            {{ service.description }}
          </span>
        </li>
      </ul>
    </div>

    <div
      v-else
      class="scan-services scan-services--empty"
    >
      Sin servicios detectados
    </div>
  </div>
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

      <v-fieldset legend="Escritorio Remoto" class="v-form">
        <label>Server:</label>
        <input v-model="o.remoteServer" />

        <label>Codigo:</label>
        <input v-model="o.remoteCode" />

        <label>Contraseña:</label>

        <div style="position: relative">

          <input v-if="showRemotePass" v-model="o.remotePass" />

          <input v-else v-model="o.remotePass" type="password" disabled />

          <i style="
              position: absolute;
              right: 7px;
              top: 6px;
              cursor: pointer;
            " class="fa" :class="showRemotePass ? 'fa-key' : 'fa-eye'" :style="{
              color: showRemotePass ? 'black' : 'white'
            }" @click="showRemotePass = !showRemotePass" />
        </div>
      </v-fieldset>


      <!-- Estabilizador -->

      <v-fieldset legend="Estabilizador" class="v-form">
        <label>Tiene estabilizador:</label>
        <v-switch v-model="o.stabilizer" />

        <label>Codigo Patrimonial:</label>
        <input v-model="o.stabilizerCode" />

        <label>Descripcion:</label>
        <v-textarea v-model="o.stabilizerDescription" rows="3" maxlength="245" />
      </v-fieldset>
      <v-fieldset legend="Impresora o Fotocopiadora" class="v-form">
        <label>Impresora:</label>
        <v-switch v-model="o.printer" />

        <label>Codigo Patrimonial:</label>
        <input v-model="o.printerCode" />

        <label>Modelo:</label>
        <input v-model="o.printerModel" />

        <label>Serie:</label>
        <input v-model="o.printerSerie" />

        <label>Descripcion:</label>
        <v-textarea v-model="o.printerDescription" rows="3" maxlength="245" />
      </v-fieldset>


      <!-- Equipo -->

      <v-fieldset legend="Equipo" class="v-form">
        <label>Código Patrimonial:</label>
        <input v-model="o.patrimonialCode" />

        <label>Nombre:</label>
        <input v-model="o.device" />

        <label>Modelo:</label>
        <input v-model="o.deviceModel" maxlength="100" />

        <label>Serie:</label>
        <input v-model="o.deviceSerie" />

        <label>Mac ID:</label>
        <input v-model="o.macId" maxlength="17" />

        <label>Workgroup:</label>
        <input v-model="o.workgroup" />

        <label>Descripción:</label>
        <v-textarea v-model="o.description" rows="1" maxlength="145" />
      </v-fieldset>


      <!-- SIAF -->

      <v-fieldset legend="SIAF" class="v-form">
        <label>Servidor:</label>
        <input v-model="o.siaf" />

        <label>Usuario:</label>
        <input v-model="o.userSiaf" />

        <label>Clave:</label>
        <input v-model="o.clave" />
      </v-fieldset>


      <!-- Mantenimiento -->

      <v-fieldset legend="Mantenimiento" class="v-form">
        <label>Tipo:</label>

        <v-radio-group v-model="o.maintenanceType">
          <v-radio label="PREVENTIVO" value="P" />

          <v-radio label="CORRECTIVO" value="C" />
        </v-radio-group>

        <label>Fecha:</label>
        <v-calendar v-model="o.maintenanceDate" />
      </v-fieldset>


      <!-- Office -->

      <v-fieldset legend="TITULO OFICCE 2021" class="v-form">
        <label>Licencia Serie:</label>
        <input v-model="o.licenseSerie" />

        <label>Codigo de Activación:</label>
        <input v-model="o.activationCode" />

        <label>Fecha:</label>
        <v-calendar v-model="o.activationDate" />
      </v-fieldset>


      <label>Habilitado:</label>
      <v-switch v-model="o.active" />

    </div>


    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save" />

      <v-button style="margin-left: 10px" value="Cancelar" icon="fa-ban" @click.prevent="close" />
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
      oRef.value.dependencyId = v ? v.id : null
    }

    const scan = () => {
      const code = oRef.value.code?.trim()

      if (!code) {
        return
      }

      axios
        .post('/api/ipscan/scan', {
          range: code
        })
        .then(response => {
          scanResult.value = response.data
        })
        .catch(error => {
          console.error(
            'Error ejecutando IP Scan:',
            error.response?.data || error
          )

          scanResult.value = []
        })
    }

    const find = (id) => {
      if (id)
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

<style>
.scan-device {
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.scan-device__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.scan-device__ip {
  margin-left: 10px;
  font-size: 0.9rem;
  color: #666;
}

.scan-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  text-transform: uppercase;
  background: #eee;
}

.scan-status--alive {
  background: #dff5e3;
  color: #19712c;
}

.scan-status--dead {
  background: #f8dddd;
  color: #9c2525;
}

.scan-status--unknown {
  background: #eee;
  color: #666;
}

.scan-device__info {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(180px, 1fr)
  );
  gap: 12px;
}

.scan-device__info > div {
  display: flex;
  flex-direction: column;
}

.scan-device__info span {
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 3px;
}

.scan-services {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.scan-services ul {
  margin: 8px 0 0;
  padding-left: 20px;
}

.scan-services li {
  margin-bottom: 5px;
}

.scan-services li strong {
  margin-right: 6px;
}

.scan-services--empty {
  color: #888;
  font-size: 0.85rem;
}
</style>