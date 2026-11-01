<template>
    <v-page header="IP" action="/admin/uti/ip">
        <v-table :selectable="true" :scrollable="true" :row-style-class="rowStyleClass" @dblclick="dblclick"
            pagination="50" src="/api/uti/ip">
            <template v-slot:header="">
                <v-button value="ON / OFF" icon="fa-toggle-off" @click.prevent="disable(getSelected())"
                    :disabled="!rowSelectedCount" />

                <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create" />

                <v-button value="Editar" icon="fa-pen" @click.prevent="edit"
                    :disabled="!(rowSelectedCount && getSelected()[0]?.active)" />

                <v-button value="Eliminar" icon="fa-trash" @click.prevent="destroy" :disabled="!rowSelectedCount" />

                <input style="width: 100px" v-model="filters.filter" />

                <v-button value="Limpiar" icon="fa-trash" @click.prevent="clear(getSelected())"
                    :disabled="!rowSelectedCount" />

                <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh" />

                <v-button icon="fa-book" @click.prevent="open($refs.report)" value="Descargar Reporte" />

                <v-button icon="fa-star" @click.prevent="open($refs.scanner)" value="Scanner IP" />
            </template>

            <template v-slot="{ row, index }">
                <td class="center" header="#" width="42">
                    {{ pad(index + 1, 3) }}
                </td>
                <td width="220" sort="category" class="center" header="Categoría">
                    <v-filter>
                        <v-select multiple="true" v-model="filters.category">
                            <v-options src="/api/uti/ip/category" value-field="id">
                                <template v-slot="{ item }">
                                    {{ item.id }}
                                </template>
                            </v-options>
                        </v-select>
                    </v-filter>

                    {{ row.category }}
                </td>
                <td width="100" sort="code" header="Code" class="center" remote="true">
                    <v-filter>
                        <input v-model="filters.code" />
                    </v-filter>

                    {{ row.code }}
                </td>


                <td width="220" sort="name" header="Nombre">
                    <v-filter>
                        <input v-model="filters.name" />
                    </v-filter>

                    {{ row.name }}
                </td>


                <td width="220" sort="position" header="Posición">
                    <v-filter>
                        <input v-model="filters.position" />
                    </v-filter>

                    {{ row.position }}
                </td>


                <td width="220" sort="antivirus" header="Antivirus">
                    <v-filter>
                        <input v-model="filters.antivirus" />
                    </v-filter>

                    {{ row.antivirus }}
                </td>


                <td width="220" sort="description" header="Descripción">
                    <v-filter>
                        <input v-model="filters.description" />
                    </v-filter>

                    {{ row.description }}
                </td>


                <td width="220" header="Restricción">
                    <v-filter>
                        <input v-model="filters.restriction" />
                    </v-filter>

                    {{ row.restriction }}
                </td>


                <td width="120" sort="macId" header="MacID" class="center">
                    <v-filter>
                        <input v-model="filters.macId" />
                    </v-filter>

                    {{ row.macId }}
                </td>


                <td width="80" sort="remoteCode" header="Código Remoto" class="center">
                    <v-filter>
                        <input v-model="filters.remoteCode" />
                    </v-filter>

                    {{ row.remoteCode }}
                </td>


                <td width="120" header="Workgroup" class="center">
                    <v-filter>
                        <input v-model="filters.workgroup" />
                    </v-filter>

                    {{ row.workgroup }}
                </td>


                <td width="120" sort="device" header="Código Patrimonial Estabilizador" class="center">
                    <v-filter>
                        <input disabled v-model="filters.stabilizerCode" />
                    </v-filter>

                    {{ row.stabilizerCode }}
                </td>


                <td width="100" header="Descripción Estabilizador" class="center">
                    <v-filter>
                        <input disabled v-model="filters.stabilizerDescription" />
                    </v-filter>

                    {{ row.stabilizerDescription }}
                </td>


                <td width="120" sort="device" header="Código Patrimonial Impresora" class="center">
                    <v-filter>
                        <input disabled v-model="filters.printerCode" />
                    </v-filter>

                    {{ row.printerCode }}
                </td>


                <td width="100" header="Modelo Impresora" class="center">
                    <v-filter>
                        <input disabled v-model="filters.printerModel" />
                    </v-filter>

                    {{ row.printerModel }}
                </td>


                <td width="120" sort="device" header="Serie Impresora" class="center">
                    <v-filter>
                        <input disabled v-model="filters.printerSerie" />
                    </v-filter>

                    {{ row.printerSerie }}
                </td>


                <td width="100" header="Descripción Impresora" class="center">
                    <v-filter>
                        <input disabled v-model="filters.printerDescription" />
                    </v-filter>

                    {{ row.printerDescription }}
                </td>


                <td width="100" header="Dispositivo" class="center">
                    <v-filter>
                        <input v-model="filters.device" />
                    </v-filter>

                    {{ row.device }}
                </td>


                <td width="120" header="SIAF" class="center">
                    <v-filter>
                        <input v-model="filters.siaf" />
                    </v-filter>

                    {{ row.siaf }}
                </td>


                <td width="120" header="Usuario SIAF" class="center">
                    <v-filter>
                        <input v-model="filters.userSiaf" />
                    </v-filter>

                    {{ row.userSiaf }}
                </td>


                <td width="220" header="Código Patrimonial">
                    <v-filter>
                        <input v-model="filters.patrimonialCode" />
                    </v-filter>

                    {{ row.patrimonialCode }}
                </td>
                <td width="80" class="center" sort="updated" remote="true" header="Tipo Mantenimiento">
                    <v-filter>
                        <input disabled />
                    </v-filter>

                    {{ row.maintenanceType }}
                </td>


                <td width="80" class="center" sort="maintenanceDate" remote="true" header="Fecha Mantenimiento">
                    <v-filter>
                        <input disabled />
                    </v-filter>

                    {{ date(row.maintenanceDate) }}
                </td>


                <td width="80" class="center" sort="activationCode" remote="true" header="Activation Code">
                    <v-filter>
                        <input disabled />
                    </v-filter>

                    {{ row.activationCode }}
                </td>


                <td width="80" class="center" sort="licenseSerie" remote="true" header="License Serie">
                    <v-filter>
                        <input disabled />
                    </v-filter>

                    {{ row.licenseSerie }}
                </td>


                <td width="80" class="center" sort="activationDate" remote="true" header="Fecha Activación">
                    <v-filter>
                        <input disabled />
                    </v-filter>

                    {{ date(row.activationDate) }}
                </td>


                <td width="80" class="center" header="Usuario">
                    <v-filter>
                        <input v-model="filters.user" disabled />
                    </v-filter>

                    {{ row.user }}
                </td>


                <td width="70" class="center" header="Fecha Creación">
                    <v-filter>
                        <input v-model="filters.creation" disabled />
                    </v-filter>

                    {{ date(row.creation) }}
                </td>


                <td width="80" class="center" sort="updated" remote="true" header="Fecha Actualización">
                    <v-filter>
                        <input v-model="filters.updated" disabled />
                    </v-filter>

                    {{ date(row.updated) }}
                </td>
            </template>
        </v-table>
        <v-popup />
        <v-popup ref="report">
            <v-panel header="Descargar Reporte">
                <div class="v-form v-panel">
                    <center>
                        <v-button icon="fa-download" value="Descargar"
                            @click.prevent="saveAs('/api/uti/ip/download')" />
                        <v-button icon="fa-ban" value="Cancelar" click.prevent="report.close()" />
                    </center>
                </div>
            </v-panel>
        </v-popup>
        <v-popup ref="scanner">
            <v-panel header="Scanner IP">
                <v-table :selectable="true" :scrollable="true" :value="scanResult">
                    <template v-slot:header="">
                        <div style="display: flex;">
                            <input v-model="queryIP" class="center" style="flex:1" />
                            <v-button value="Escanear" icon="fa-sync" class="on" @click.prevent="scan" />
                        </div>
                    </template>
                    <template v-slot="{ row, index }">
                        <td class="center" header="#" width="42">
                            {{ pad(index + 1, 3) }}
                        </td>
                        <td width="100" sort="code" header="Code" class="center" remote="true">
                            <v-filter>
                                <input v-model="filters.ip" />
                            </v-filter>

                            {{ row.ip }}
                        </td>
                        <td width="220" sort="name" header="Nombre">
                            <v-filter>
                                <input v-model="filters.name" />
                            </v-filter>

                            {{ row.name }}
                        </td>
                        <td width="180" sort="name" header="NetBIOSGroup" class="center">
                            <v-filter>
                                <input v-model="filters.netBIOSGroup" />
                            </v-filter>
                            {{ row.netBIOSGroup }}
                        </td>
                        <td width="180" sort="name" header="MacAddress" class="center">
                            <v-filter>
                                <input v-model="filters.macAddress" />
                            </v-filter>

                            {{ row.macAddress }}
                        </td>
                        <td width="220" sort="name" header="Manufacturer">
                            <v-filter>
                                <input v-model="filters.manufacturer" />
                            </v-filter>

                            {{ row.manufacturer }}
                        </td>
                        <td width="300" sort="name" header="More">
                            <v-filter>
                                <input v-model="filters.services" />
                            </v-filter>

                            <ul>
                                <li v-for="(service, index) in row.services" :key="index">
                                    <strong>{{ service.service }}</strong>
                                    <span v-if="service.description">
                                        - {{ service.description }}
                                    </span>
                                </li>
                            </ul>
                        </td>
                    </template>
                </v-table>
            </v-panel>
        </v-popup>
    </v-page>
</template>

<script>

import { ref } from 'vue'
import { ui } from 'isobit-ui'

export default ui({
    setup({ app, refresh, edit }) {
        const queryIP = ref('')
        const scanResult = ref([])
        const disable = (selected) => {
            app.axios.post(
                '/api/uti/ip/disable',
                selected.map(e => e.id)
            ).then(() => {
                refresh()
            })
        }

        const clear = (selected) => {
            app.axios.put(
                '/api/uti/ip/clear/' +
                selected.map(e => e.id)
            ).then(() => {
                refresh()
            })
        }

        const scan = () => {
            const range = queryIP.value?.trim()

            if (!range) {
                scanResult.value = []
                return
            }

            app.axios.post('/api/ipscan/scan', {
                range: range
            })
                .then(r => {
                    scanResult.value = r.data

                    localStorage.setItem(
                        'scanResult',
                        JSON.stringify(scanResult.value)
                    )
                })
                .catch(error => {
                    console.error('Error ejecutando IP Scan:', error)

                    scanResult.value = []
                })
        }

        const dblclick = (e) => {
            edit(e)
        }

        return {
            queryIP,
            scanResult,
            dblclick,
            disable,
            clear,
            scan,
            rowStyleClass: (row) => row.active ? 'green' : 'red'
        }
    }

})
</script>