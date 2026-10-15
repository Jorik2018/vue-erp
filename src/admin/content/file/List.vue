<template>

    <v-page class="v-form" header="Explorador de Archivo" store="setting">

        <div class="v-form" style="
            display: flex;
            flex: 1;
            flex-direction: column;
        ">
            <div style="padding-bottom: 10px; display: flex; align-items: center;">

                <a style="display:inline-block;padding: 5px;cursor: pointer;"
                    v-on:click="send({ path: null, type: 'D' })">
                    <i class="fa fa-home"></i>
                </a>

                <template v-for="(item, i) in o.parents" :key="i">
                    <span>
                        \
                        <a style="display:inline-block;padding: 5px;cursor: pointer;" :title="item"
                            v-on:click="send({ path: item.path, type: 'D' })">
                            {{ item.name }}
                        </a>
                    </span>
                </template>

                <!-- Acciones a la derecha -->
                <div style="
                    margin-left: auto;
                    margin-right: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <!-- Trash múltiple -->
                    <button v-if="selected.length" type="button"
                        style="cursor: pointer;margin-right: 5px;font-size: 22px;" v-on:click="remove(selected)"
                        title="Eliminar seleccionados">
                        <i class="fa fa-trash"></i>
                    </button>

                    <v-uploader :dst="o.current" onlyicon="false" icon="fa-upload" @input="onUploaded" />
                </div>

            </div>

            <div style="
                flex-direction: column;
                display: flex;
                overflow-y: auto;
            ">
                <div v-for="item in o.files" style="
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid gray;
    position: relative;
    gap: 10px;
">
                    <!-- Checkbox -->
                    <input type="checkbox" :value="item" v-model="selected" :disabled="item.type != 'F'" style="
            width: auto;
            min-width: auto;
            flex: 0 0 auto;
            margin: 0;
        " />

                    <!-- Icono -->
                    <i style="width: 20px; padding: 2px; text-align: center;" class="fa"
                        :class="item.type == 'F' ? 'fa-file' : 'fa-folder'"></i>

                    <!-- Nombre -->
                    <a style="line-break: anywhere; cursor: pointer;" v-on:click="send(item)">
                        {{ label(item.path) }}
                    </a>

                    <!-- Tamaño -->
                    <span v-if="item.type == 'F'" style="
            font-size: 16px;
            color: #444;
            white-space: nowrap;
        ">
                        {{ formatSize(item.length) }}
                    </span>

                    <!-- Fecha y trash a la derecha -->
                    <div style="
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 15px;
    ">
                        <span style="
            font-size: 14px;
            color: #666;
            white-space: nowrap;
        ">
                            {{ date(item.lastModified) }}
                        </span>

                        <span style="cursor: pointer;" v-on:click="remove(item)">
                            <i class="fa fa-trash"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </v-page>

</template>
<script>
import axios from "axios";
import { ui } from 'isobit-ui'
import { ref, computed, onMounted, onBeforeMount, getCurrentInstance } from 'vue';
let ax;
export default ui({
    setup({ app }) {
        const { appContext } = getCurrentInstance();
        console.log(appContext);
        const ax = app.axios;

        const o = ref({ current: 'C:\\wildfly-18.0.1.Final\\standalone', id: null, files: [], parents: [] });
        const image = ref(0);
        const base = ref('http://web.regionancash.gob.pe/cdn/web/viewer.html?v=1&file=http://web.regionancash.gob.pe/admin/uti/api/document/download/');

        const subpaths = computed(() => {
            let path = o.value.current || '';
            if (!path) return [];

            const isWindows = /^[a-zA-Z]:\\/.test(path);
            const sep = isWindows ? '\\' : '/';

            if (path.length > 1 && path.endsWith(sep)) {
                if (!(isWindows && path.length === 3)) {
                    path = path.slice(0, -1);
                }
            }

            let parts = path.split(sep);
            let result = [];

            if (isWindows) {
                parts = parts.filter(Boolean);

                const drive = parts[0] + '\\';
                result.push(drive);

                for (let i = 1; i < parts.length; i++) {
                    result.push(result[i - 1] + parts[i]);
                }

                return result;
            } else {
                if (path.startsWith('/')) {
                    result.push('/');
                    parts = parts.slice(1);
                }

                for (let i = 0; i < parts.length; i++) {
                    if (!parts[i]) continue;

                    const prev = result[result.length - 1] || '';
                    result.push(prev === '/' ? '/' + parts[i] : prev + '/' + parts[i]);
                }

                return result;
            }
        });

        const getParameterByName = (name) => {
            const regex = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&#]*)', 'i');
            const results = regex.exec(window.location.search);
            return results ? decodeURIComponent(results[1]) : null;
        };

        const send = (item) => {
            if (item.type === 'D') {
                ax.post('/api/content/file', { current: item.path }).then(({ data }) => {
                    o.value.files = data.data;
                    o.value.parents = data.parents;
                    o.value.current = item.path;
                });
            } else {
                axios.post('/api/content/file/download',
                    { folder: item.path },
                    { responseType: 'blob' }
                ).then(({ data }) => {
                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', item.path.split('\\').pop());
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).catch(error => {
                    console.error('Error descargando el archivo:', error);
                });
            }
        };

        const encodePath = (path) => {
            return btoa(unescape(encodeURIComponent(path)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        };

        const remove = (items) => {
            if (!Array.isArray(items)) {
                items = [items];
            }

            Promise.all(
                items.map(item =>
                    axios.delete('/api/content/file/' + encodePath(item.path))
                )
            ).then(() => {
                selected.value = [];
                send({ path: o.value.current, type: 'D' });
            });
        };

        const onUploaded = () => {
            send({ path: o.value.current, type: 'D' });
        };

        const label = (path) => {
            const paths = path.split('\\');
            return paths.pop() || paths.pop();
        };

        onBeforeMount(() => {
            const path = getParameterByName('path');
            if (path) {
                o.value.current = path;
            }
        });


        const formatSize = (bytes) => {
            if (bytes === null || bytes === undefined) {
                return '';
            }

            const size = Number(bytes);

            if (size === 0) {
                return '0 B';
            }

            const units = ['B', 'KB', 'MB', 'GB', 'TB'];
            const index = Math.floor(Math.log(size) / Math.log(1024));

            return (size / Math.pow(1024, index)).toFixed(
                index === 0 ? 0 : 2
            ) + ' ' + units[index];
        }

        onMounted(() => {
            send({ path: o.value.current, type: 'D' });
        });

        const selected = ref([])

        const deleteSelected = () => {
            console.log('Eliminar:', selected.value)

            // Tu lógica de eliminación aquí
        }

        return {
            selected,
            deleteSelected,
            o,
            image,
            base,
            subpaths,
            send,
            remove,
            onUploaded,
            label,
            formatSize
        };
    }
})
</script>