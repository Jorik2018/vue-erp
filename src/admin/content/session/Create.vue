<template>
    <v-form
        header="Redis"
        action="/api/content/node"
    >

        <div class="redis-container">

            <div class="redis-keys">
                <h3>Keys</h3>

                <div
                    v-for="key in keys"
                    :key="key"
                    class="redis-key"
                >
                    <a
                        href="#"
                        @click.prevent="selectKey(key)"
                    >
                        {{ key }}
                    </a>
                </div>
            </div>

            <div class="redis-editor">

                <div>
                    <label>Key</label>

                    <input
                        v-model="selectedKey"
                        type="text"
                        placeholder="captcha:xxxx"
                    />
                </div>

                <div>
                    <label>Valor</label>

                    <textarea
                        v-model="value"
                        rows="10"
                        placeholder="Contenido de Redis"
                    ></textarea>
                </div>

                <div>
                    <label>TTL segundos</label>

                    <input
                        v-model.number="ttl"
                        type="number"
                        min="0"
                    />

                    <small>
                        0 = sin expiración
                    </small>
                </div>

                <div class="buttons">

                    <button
                        type="button"
                        @click="saveKey"
                    >
                        Guardar
                    </button>

                    <button
                        type="button"
                        @click="createKey"
                    >
                        Nueva key
                    </button>

                </div>

            </div>

        </div>

    </v-form>
</template>

<script>
import { ui } from 'isobit-ui'
import {
    ref,
    onMounted
} from 'vue'

import axios from 'axios'


export default ui({

    props: ['id'],

    setup() {

        const keys = ref([])

        const selectedKey = ref('')
        const value = ref('')
        const ttl = ref(300)


        const loadKeys = async () => {

            const { data } =
                await axios.get(
                    '/api/auth/redis/keys'
                )

            keys.value = data || []
        }


        const selectKey = async (key) => {

            selectedKey.value = key

            const { data } =
                await axios.get(
                     `/api/auth/redis/keys/${encodeURIComponent(key)}`,
                    {
                        params: {
                            key
                        }
                    }
                )

            value.value =
                data.value ?? ''

            ttl.value =
                data.ttl ?? 0
        }


        const saveKey = async () => {

            if (!selectedKey.value) {
                return
            }

            await axios.post(
                '/api/auth/redis/keys',
                {
                    key: selectedKey.value,
                    value: value.value,
                    ttl: ttl.value
                }
            )

            await loadKeys()
        }


        const createKey = () => {

            selectedKey.value = ''
            value.value = ''
            ttl.value = 300
        }


        onMounted(() => {
            loadKeys()
        })


        return {
            keys,
            selectedKey,
            value,
            ttl,

            selectKey,
            saveKey,
            createKey
        }
    }
})
</script>

<style scoped>

.redis-container {
    display: flex;
    gap: 20px;
}

.redis-keys {
    width: 320px;
    border-right: 1px solid #ddd;
    padding-right: 20px;
}

.redis-key {
    margin-bottom: 6px;
}

.redis-key a {
    cursor: pointer;
    text-decoration: none;
}

.redis-editor {
    flex: 1;
}

.redis-editor > div {
    margin-bottom: 15px;
}

.redis-editor input,
.redis-editor textarea {
    width: 100%;
    box-sizing: border-box;
}

.buttons {
    display: flex;
    gap: 10px;
}

</style>