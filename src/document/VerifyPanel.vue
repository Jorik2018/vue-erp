<template>
    <v-page header="VERIFICACION DE DOCUMENTOS FIRMADOS DIGITALMENTE">
        <div class="v-form">
            <label>Tipo de Documento (Requerido):</label>
            <v-select v-model="o.documentTypeId" required="true">
                <option value="">[SELECCIONAR]</option>
                <option v-for="(value, key) in options.type" v-bind:key="'documentTypeId-' + key"
                    v-bind:value="value[0]">
                    {{ value[1] }}</option>
            </v-select>
            <label>Codigo (Requerido):</label>
            <input v-model="o.code" required="true" />
            <label>Ingrese texto de siguiente imagen:</label>
            <div style="
    display: flex;
    flex-direction: row;
">
                <img style="height: 40px; max-width: 220px;"
                    :src="'http://www.regionancash.gob.pe/includes/captcha.php?v=' + image">
                <span v-on:click="refre"><i style="padding: 10px;" class="fa fa-refresh"></i></span>
            </div>
            <input v-model="o.captcha" required="true" />
            <div class="right" style="margin-top: 20px;"><v-button icon="fa-search" value="Ver documento"
                    v-on:click="send" /></div>
            <v-fieldset v-if="o.name" legend="Documento">
                <div>
                    {{ o.name }} - {{ o.description }} <a :href="o.code">Descargar
                        <i class="fa fa-download"></i>
                    </a>
                </div>
                <iframe width="100%" height="180px" :src="base + o.id + '.' + o.code" style="border-radius: 20px; padding: 5px 0px 0px; max-height: 100vh; 
                height: 80vw; width: 100% !important; border: 0px none;"></iframe>
            </v-fieldset>
        </div>
    </v-page>
</template>
<script lang="ts">
import axios from "axios";
export default {
    data() {
        return {
            o: { id: null, code: null, documentTypeId: null, name: null, description: null, captcha: null },
            options: {
                type: [
                    ['memo', 'MEMO'],
                    ['memu', 'MEMO MULTIPLE'],
                    ['o', 'OFICIO'],
                    ['omul', 'OFICIO MULTIPLE'],
                    ['ar', 'ADENDAS REGIONALES'],
                    ['acr', 'ACUERDO CONSEJO REGIONAL'],
                    ['ca', 'CARTA'],
                    ['dr', 'DECRETO REGIONAL'],
                    ['cnv', 'CONVENIOS'],
                    ['or', 'ORDENANZA REGIONAL'],
                    ['rdr', 'RESOLUCIÓN DIRECTORAL REGIONAL'],
                    ['rer', 'RESOLUCIÓN EJECUTIVA REGIONAL'],
                    ['rgr', 'RESOLUCIÓN GERENCIAL GENERAL REGIONAL'],
                    ['rm', 'RESOLUCIÓN MINISTERIAL']
                ]
            },
            image: 0,
            base: 'http://web.regionancash.gob.pe/cdn/web/viewer.html?v=1&file=http://web.regionancash.gob.pe/admin/uti/api/document/download/'
        }
    },
    methods: {
        send() {
            const me = this;
            axios.post('http://web.regionancash.gob.pe/admin/uti/api/document/find', me.o).then(({ data }:any) => {
                me.o = { ...me.o, ...data }
            });
        },
        refre() {
            this.image++;
        }
    }
}
</script>