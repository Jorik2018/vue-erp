<template>

    <v-form class="v-form" header="CONSTANCIA DE PAGO DE HABERES Y DESCUENTOS" store="setting">
     
        <div class="v-form">
        <v-button value="hola" v-on:click="send"/>
        {{o}}
        </div>
    </v-form>

</template>

<script lang="ts">
import axios from "axios";
import { ui } from 'vue3-ui'
export default ui({
    data() {
        return {
            o: { id: null},
            image: 0,
            base: 'http://web.regionancash.gob.pe/cdn/web/viewer.html?v=1&file=http://web.regionancash.gob.pe/admin/uti/api/document/download/'
        }
    },
    methods: {
        send() {
            const me = this;
            axios.post('http://localhost:8000/wp-json/api/payroll/chd', me.o).then(({ data }) => {
                let fo = new FormData();
                fo.append(
                    "file",
                    new Blob([JSON.stringify(data)], { type: "text/plain" }),
                    "data.json"
                );
                fo.append("filename", "data.json");
                fo.append("template", "hc");
                me.saveAs("http://web.regionancash.gob.pe/api/jreport/", fo);
            });
        }
    }
})
</script>