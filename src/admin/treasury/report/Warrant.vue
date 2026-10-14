<template>
    <v-form header="Reporte de Cartas Fianzas">
        <v-fieldset legend="Parámetros" class="v-form">


            <v-fieldset legend="VENCIMIENTO">
                <div style="display: flex;flex-direction: row;">
                    <div style="
          display: inline-block;
          width: calc(50% - 4px);
          margin-right: 2px;
        ">
                        <label>Desde:</label>

                        <v-calendar style="width: 100%" pattern="dd/MM/yyyy" v-model="o.FECHA_INI" showOn="button" />
                    </div>

                    <div style="
          display: inline-block;
          width: calc(50% - 4px);
          margin-left: 2px;
        ">
                        <label>Hasta:</label>

                        <v-calendar style="width: 100%" pattern="dd/MM/yyyy" v-model="o.FECHA_FIN" showOn="button" />
                    </div>
                </div>
            </v-fieldset>

            <div class="gra" style="
          margin-bottom: 10px;
          width: 100%;
        ">
                <label>Título de Reporte:</label>

                <v-textarea v-model="o.TITLE_REPORT" title="Título de Reporte" />

                <label>
                    Mostrar solo las cartas fianza por vencer:
                </label>

                <v-switch v-model="o.danger" />

                <label>Ordenado por:</label>

                <v-radio-group v-model="o.order">
                    <v-radio value="e" label="Expediente" />

                    <v-radio value="v" label="Fecha Vencimiento" />
                </v-radio-group>

                <label>Agrupado por:</label>

                <v-radio-group v-model="o.group">
                    <v-radio value="0" label="Ninguno" />

                    <v-radio value="1" label="Expediente" />

                    <v-radio value="2" label="Proveedor" />
                </v-radio-group>

                <label>Formato de Salida:</label>

                <v-radio-group v-model="o.FORMAT">
                    <v-radio value="pdf" label="Documento de Formato Portable (pdf)" />

                    <v-radio value="xls" label="Hoja de Cálculo Excel (xls)" />
                </v-radio-group>

            </div>

        </v-fieldset>

        <center style="margin-top: 20px">
            <v-button icon="fa-download" value="Descargar"
                @click.prevent="saveAs('/api/treasury/warrant/download', params())" />

            <v-button style="margin-left: 10px" value="Cancelar" icon="fa-ban" @click.prevent="close" />
        </center>

    </v-form>
</template>

<script>
import { ui, date } from 'isobit-ui'
import { ref } from 'vue'

export default ui({

    props: [
        'callback',
    ],


    setup({ app, callback }) {

        const now = new Date()

        const firstDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        )

        const lastDay = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        )


        const oRef = ref({
            FECHA_INI: firstDay,
            FECHA_FIN: lastDay,
            TITLE_REPORT: 'REPORTE DE CARTAS FIANZAS',
            danger: false,
            order: 'e',
            group: '0',
            FORMAT: 'pdf',
        })


        const params = () => {

            const o = {
                ...oRef.value,
            }


            if (
                typeof o.FECHA_INI === 'number' ||
                o.FECHA_INI instanceof Date
            ) {
                o.FECHA_INI = date(
                    o.FECHA_INI,
                    'dMY'
                )
            }


            if (
                typeof o.FECHA_FIN === 'number' ||
                o.FECHA_FIN instanceof Date
            ) {
                o.FECHA_FIN = date(
                    o.FECHA_FIN,
                    'dMY'
                )
            }


            return o
        }


        const close = () => {
            callback()
        }


        return {
            o: oRef,
            params,
            close,
        }
    },

})
</script>