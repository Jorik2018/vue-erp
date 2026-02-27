<template>

    <v-page class="v-form" header="Explorador de Archivo" store="setting">

        <div class="v-form" style="
    display: flex;
    flex: 1;
    flex-direction: column;
">
            <div style="padding-bottom: 10px;">
                <a style="display:inline-block;padding: 5px;" v-on:click="send({ path: null, type: 'D' })"><i
                        class="fa fa-home"></i></a>

                <template v-for="item in subpaths">
                    \ <a style="display:inline-block;padding: 5px;" v-on:click="send({ path: item, type: 'D' })"> {{
                        item.split('\\').pop()
                    }}</a>
                </template>

            </div>
            <div style="
    flex-direction: column;
    display: flex;
    overflow-y: auto;
    /* height: 0px; */
">
                <div v-for="item in o.files"
                    style="display:block;padding: 10px;border:1px solid gray;position: relative;">
                    <i style="width: 20px;padding: 2px;margin-right: 10px;text-align: center;" class="fa"
                        :class="item.type == 'F' ? 'fa-file' : 'fa-folder'"></i><a style="line-break: anywhere;"
                        v-on:click="send(item)"> {{
                            label(item.path) }}</a>
                    <span v-if="item.type == 'F'" style="position:absolute;right: 0px;padding: 4px 10px;"
                        v-on:click="remove(item)"><i class="fa fa-trash"></i></span>
                </div>
            </div>
        </div>
    </v-page>

</template>

<script>
import axios from "axios";
import { ui } from 'isobit-ui'
export default ui({

    computed: {
        subpaths() {
            const parts = (this.o.current || '').split("\\");
            return parts.map((_, index) => {
                // Crea cada subruta desde la raíz hasta el índice actual
                return parts.slice(0, index + 1).join("\\");
            });
        },
    },
    data() {
        return {
            o: { current: 'D:\\', id: null, files: [] },
            image: 0,
            base: 'http://web.regionancash.gob.pe/cdn/web/viewer.html?v=1&file=http://web.regionancash.gob.pe/admin/uti/api/document/download/'
        }
    },
    created() {
        const path = this.getParameterByName('path');
        if (path) {
            this.o.current = path;
        }
    },
    mounted() {

        this.send({ path: this.o.current, type: 'D' });
    },
    methods: {
        getParameterByName(name) {
            const regex = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&#]*)', 'i');
            const results = regex.exec(window.location.search);
            return results ? decodeURIComponent(results[1]) : null;
        },
        label(path) {
            const paths = path.split('\\');
            return paths.pop() || paths.pop();
        },
        send(item) {
            const me = this;
            if (item.type == 'D') {
                axios.post('/api/obresec/file', { folder: item.path }, {
                    headers: { authorization: "" }
                }).then(({ data }) => {
                    me.o.files = data.data;
                    me.o.current = item.path;
                });
            } else {
                axios.post('/api/obresec/file/download',
                    { folder: item.path },
                    {
                        headers: { authorization: "" },
                        responseType: 'blob' // Especifica que la respuesta debe ser tratada como un archivo binario
                    }
                ).then(({ data }) => {
                    // Crear un enlace de descarga dinámico
                    const url = window.URL.createObjectURL(new Blob([data]));

                    // Crear un enlace de descarga
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', item.path.split('\\').pop()); // Define el nombre del archivo a descargar
                    document.body.appendChild(link);
                    link.click(); // Simula el clic para iniciar la descarga
                    document.body.removeChild(link); // Limpia el enlace después de la descarga
                }).catch(error => {
                    console.error('Error descargando el archivo:', error);
                });
            }
        },
        remove(item) {
            const me = this;
            axios.delete('http://38.250.135.118/api/obresec/file/' + encodeURIComponent(item.path)).then(() => {
                me.send({ path: me.o.current, type: 'D' });
            });
        }
    }
})
</script>