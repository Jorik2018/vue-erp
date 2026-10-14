<template>
    <v-page header="Cartas Fianza" action="/admin/treasury/warrant">
        <v-table :selectable="true" :pagination="50" :scrollable="true" :filters="filters" groups="obra"
            src="/api/treasury/warrant" row-key="id" :row-style-class="row.ext > 5
                ? 'ooo'
                : row.ext > 1
                    ? 'yellow'
                    : row.ext > 0
                        ? ''
                        : ''
                ">
            <template v-slot:header="">
                <v-button vif="can('ADMIN_TESORERIA_WARRANT')" value="Crear" icon="fa-plus" class="on"
                    @click.prevent="create(getSelected())" />
                <v-button vif="can('ADMIN_TESORERIA_WARRANT')" value="Editar" icon="fa-pen"
                    :disabled="!rowSelectedCount"
                    @click.prevent="open('/admin/treasury/warrant/' + getSelected()[0].id)"
                    click.prevent="edit(getSelected()[0])" />
                <v-uploader vif="can('ADMIN_TESORERIA_WARRANT')||1" :disabled="!rowSelectedCount" @input="upload" />

                <v-button vif="can('ADMIN_TESORERIA_WARRANT')||1" value="Eliminar" icon="fa-trash"
                    :disabled="!rowSelectedCount" @click.prevent="destroy" />

                <v-button value="Exportar" icon="fa-download" class="on"
                    @click.prevent="open('/admin/treasury/report/warrant')" />

                <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh" />

            </template>
            <template v-slot="{ row, index }">
                <td width="36" class="center" header="#">
                    {{ pad(index + 1, 3) }}
                </td>
                <td width="56" class="center" header="Adjunto">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    <a v-if="row.upload" :href="'/fs/tesoreria/cartaFianza/' + row.ext?.src" target="_blank">
                        SI
                    </a>
                </td>
                <td width="200" header="Proveedor">
                    <v-filter>
                        <input v-model="filters.provider" />
                    </v-filter>

                    <template v-if="row.provider">

                        <a :href="'/admin/directorio/' + row.provider.id" target="_blank">
                            {{ row.proveedor }}
                        </a>

                    </template>
                    <template v-else>
                        {{ row.proveedor }}
                    </template>

                </td>
                <td width="80" class="center" header="Expediente">
                    <v-filter>
                        <input v-model="filters.expediente" />
                    </v-filter>
                    {{ pad(row.expediente, 4) }}
                </td>
                <td width="200" header="Tipo Proceso">
                    <v-filter>
                        <input v-model="filters.processType" />
                    </v-filter>

                    {{ row.processType }}

                </td>
                <td width="350" class="value" header="Obra">
                    <v-filter>
                        <input v-model="filters.obra" />
                    </v-filter>

                    {{ row.obra }}

                </td>
                <td width="130" header="Entidad">
                    <v-filter>
                        <input v-model="filters.entidad" />
                    </v-filter>

                    {{ row.entidad }}

                </td>
                <td width="100" class="center" header="Tipo Garantía">
                    <v-filter>

                        <v-select label="&nbsp;" multiple="true" style="width: 100%" v-model="filters.warrantType"
                            autoload="true">
                            <v-options src="/api/treasury/warrant-type/0/0" value-field="id" display-field="name" />
                        </v-select>


                    </v-filter>

                    {{ row.warrantType?.name }}

                </td>
                <td width="80" class="right" header="Total" :title="row.total">
                    <v-filter>
                        <v-filter-number v-model="filters.total" name="Total" />
                    </v-filter>

                    {{ format(row.total) }}

                </td>
                <td width="90" class="center" header="Fecha Renovación">
                    <v-filter>
                        <v-filter-date v-model="filters.fechaRenovacion" />
                    </v-filter>

                    {{ date(row.fechaRenovacion) }}

                </td>
                <td width="120" class="center" header="Número Carta">
                    <v-filter>
                        <input v-model="filters.code" />
                    </v-filter>

                    {{ row.nroCarta }}

                </td>
                <td width="90" class="center" header="Fecha Emisión">
                    <v-filter>
                        <v-filter-date v-model="filters.fechaEmision" />
                    </v-filter>

                    {{ date(row.fechaEmision) }}

                </td>
                <td width="100" class="center cf-cyan" header="Fecha Vencimiento">
                    <v-filter>
                        <v-filter-date v-model="filters.fechaVencimiento" />
                    </v-filter>

                    {{ date(row.fechaVencimiento) }}

                </td>
                <td width="120" class="center" header="Días Vencimiento" :class="row.renovated
                    ? 'green'
                    : row.diff > 5
                        ? ''
                        : row.diff > 0
                            ? 'yellow'
                            : 'red'
                    ">
                    <v-filter>
                        <v-select v-model="filters.faltan">
                            <option value="0">TODOS</option>
                            <option value="5">POR VENCER</option>
                            <option value="-1">VENCIDOS</option>
                            <option value="-2">RENOVADOS</option>
                        </v-select>
                    </v-filter>

                    <template v-if="row.renovated">
                        RENOVADO
                    </template>

                    <template v-else-if="row.diff > 5">
                        {{ row.diff }}
                    </template>

                    <template v-else-if="row.diff > 0">
                        POR VENCER EN {{ row.diff }} DÍAS
                    </template>

                    <template v-else>
                        VENCIDO HACE {{ -row.diff }} DÍAS
                    </template>
                </td>
                <td width="90" class="center" header="Fecha Registro">
                    <v-filter>
                        <v-filter-date v-model="filters.fechaRegistro" />
                    </v-filter>
                    {{ date(row.fechaRegistro) }}
                </td>
                <td width="160" header="Observación">
                    <v-filter>
                        <input disabled v-model="filters.observacion" />
                    </v-filter>

                    {{ row.observacion }}

                </td>
                <td width="100" class="center" header="Confirmación Banco">
                    <v-filter>
                        <input disabled v-model="filters.confirmacionBanco" />
                    </v-filter>

                    {{
                        row.confirmacionBanco &&
                            row.confirmacionBanco !== '0'
                            ? 'SI'
                            : ''
                    }}

                </td>

            </template>
            <template v-slot:header-group="{ group }">
                <td :type="group.name" colspan="18"
                    style="text-align: left;padding: 0px 5px;background-color: #b31111;color:white">

                    {{ group.name }}

                </td>



            </template>
        </v-table>
        <v-popup @success="onSuccess" @close="onClose" />
    </v-page>
</template>


<script>
import { ui } from 'isobit-ui'

export default ui({
    setup({ open }) {

        const create = (selected) => {
            if (selected.length)
                open('/admin/treasury/warrant/create/' + selected[0].id);
            else
                open('/admin/treasury/warrant/create');
        }

        const onSuccess = (result) => {
            console.log('SUCCESS:', result)
        }

        const onClose = (v) => {
            console.log('Popup cerrado')
        }

        const format = (n) => {
            if (
                n === null ||
                n === undefined ||
                n === ''
            ) {
                return ''
            }
            const number = Number(n)
            if (Number.isNaN(number)) {
                return n
            }
            return number.toLocaleString(
                'es-PE',
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            )
        }

        const upload = async (file) => {
            const selected =
                this.getSelected?.() || []
            if (!selected.length) {
                return
            }
            file.id = selected[0].id
            await app.axios.post(
                '/api/treasury/warrant/save-file',
                file
            )
            refresh()
        }

        const can = (permission) => {
            if (
                this.user?.uid === 1
            ) {
                return true
            }
            return this.app?.can
                ? this.app.can(permission)
                : true
        }

        return {
            create,
            format,
            onSuccess,
            upload,
            can,
            onClose
        }
    },
    created() {
        this.filters.order = 'e'
    }
})
</script>


<style scoped>
.cf-cyan {
    background-color: #a9fff7;
}

.ui-state-hover .cf-cyan {
    background-color: #8bdcd5;
}

tr.v-selected .cf-cyan {
    background-color: #274a47;
}

.ui-state-highlight .cf-white {
    color: #ffffff !important;
}

.v-datatable-header>.v-uploader {
    font-size: 12px !important;
    padding: 6px 20px;
}




/*
 * Filas de agrupación por expediente/obra.
 */
:deep(.warrant-group .group) {
    font-weight: bold;
}



.hidden {
    display: none;
}
</style>