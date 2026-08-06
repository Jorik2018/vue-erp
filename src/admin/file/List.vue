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

                <template v-for="(item, i) in subpaths">
                    <span>
                        \
                        <a style="display:inline-block;padding: 5px;cursor: pointer;"
                            v-on:click="send({ path: item, type: 'D' })">
                            {{ i === 0
                                ? item.replace(/[\\/]+$/, '') // 🔥 quita "\" final
                            : item.split(/[\\/]/).pop()
                            }}
                        </a>
                    </span>
                </template>

                <!-- 👇 esto lo empuja a la derecha -->
                <div style="margin-left: auto;margin-right: 10px;">
                <v-button value="o" @click="gg"/>
                    <v-uploader :dst="o.current" onlyicon="false" icon="fa-upload" @input="onUploaded" />
                </div>

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
                        :class="item.type == 'F' ? 'fa-file' : 'fa-folder'"></i>
                    <a style="line-break: anywhere;cursor: pointer;" v-on:click="send(item)"> {{
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
import { ref, computed, onMounted, onBeforeMount, getCurrentInstance } from 'vue';
let ax;
export default ui({
    setup({ app }) {
        const { appContext } = getCurrentInstance();
        console.log(appContext);
        const ax = app.axios;

        const o = ref({ current: 'D:\\', id: null, files: [] });
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
                ax.post('/api/file', { folder: item.path }).then(({ data }) => {
                    o.value.files = data.data;
                    o.value.current = item.path;
                });
            } else {
                axios.post('/api/file/download',
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

        const remove = (item) => {
            axios.delete('/api/file/' + encodeURIComponent(item.path)).then(() => {
                send({ path: o.value.current, type: 'D' });
            });
        };

        const gg = (item) => {
            axios.get('/api/bpm/prepare/1').then(({data}) => {
                console.log(data);
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

        onMounted(() => {
            send({ path: o.value.current, type: 'D' });
        });

        return {
        gg,
            o,
            image,
            base,
            subpaths,
            send,
            remove,
            onUploaded,
            label
        };
    }
})
</script>