<template>
    <v-form action="/admin/configuration/api/user" :header="(o.uid ? 'Editar' : 'Crear') + ' Usuario'">
        <div class="v-form">

            <!-- Directorio personal -->

            <label>Directorio Personal:</label>
            <v-autocomplete placeholder="Ingrese más de 2 letras y presione ENTER" ref="peopleAutocomplete"
                :show-selection="true" inputClass="center" :minQueryLength="3" v-model="o.people"
                src="/admin/directory/api/people" @input="peopleInput">
                <template #label="{ selected }">
                    {{ selected?.code }}:
                    {{ selected?.fullName }}
                </template>
                <template #default="{ row }">
                    <div class="people-option">
                        <strong>{{ row.code }}</strong>
                        <span>{{ row.fullName }}</span>
                    </div>
                </template>
            </v-autocomplete>
            <label>Nombre de usuario:</label>
            <input id="user" v-model="o.name" required />
            <label
                title="Una dirección de correo electrónico válida. Los correos del sistema se enviarán a esta dirección.">
                Dirección de correo electrónico:
            </label>

            <input id="mail" class="nocase" v-model="o.mail" type="email" required />


            <!-- Password -->

            <div class="v-row">

                <div class="v-c-6">
                    <label>Contraseña:</label>

                    <input type="password" v-model="o.ext.clave" :required="!o.uid"  />
                </div>

                <div class="v-c-6">
                    <label>Confirmar:</label>

                    <input type="password" v-model="o.ext.confirm" :required="!o.uid" />
                </div>

            </div>


            <!-- Estado -->

            <label>Estado:</label>

            <v-radio-group v-model="o.status" required>
                <v-radio label="BLOQUEADO" :value="0" />

                <v-radio label="ACTIVO" :value="1" />
            </v-radio-group>
            <v-fieldset legend="Roles">
                <v-checkbox-group class="roles" v-model="o.roleCollection">
                    <v-checkbox v-for="role in roles" :key="role.rid" :label="role.name" :title="role.rid"
                        :value="role.rid" />
                </v-checkbox-group>
            </v-fieldset>
            <v-checkbox label="Notificar al Usuario" v-model="o.notify" />

        </div>


        <!-- Acciones -->

        <center>
            <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save" />

            <v-button style="margin-left: 10px" value="Cancelar" icon="fa-ban" @click.prevent="close" />
        </center>

    </v-form>
</template>
<script>
import { ui } from 'isobit-ui'
import {
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
        const peopleAutocomplete = ref(null)
        const roles = ref([])
        const oRef = ref({
            ext: { notify: true },
            status: 1,
            roleCollection: []
        })

        const loadRoles = async () => {
            const { data } = await axios.get(
                '/api/admin/role/0/0'
            )
            roles.value = Array.isArray(data)
                ? data
                : data?.data || []
        }

        const find = async (id) => {
            const { data } = await axios.get(
                `/admin/configuration/api/user/${id}`,
            )
            const roleCollection =
                (data.roleCollection || [])
                    .map(role => {
                        if (
                            typeof role === 'number'
                            || typeof role === 'string'
                        ) {
                            return role
                        }
                        return role.rid
                    })
            oRef.value = {
                ...oRef.value,
                ...data,
                pass: undefined,
                clave: '',
                confirm: '',
                notify: true,
                roleCollection,
                people:
                    data.ext?.people
                    || null,
                ext:{...data.ext}
            }
        }

        const peopleInput = (people) => {
            console.log(people);
            const o = oRef.value
            if (!people) {
                o.idDir = null
                o.people = null
                return
            }
            o.idDir = people.id
            o.people = people
            if (people.mail) {
                o.mail = people.mail
            }
            if (people.code) {
                o.name = people.code
            }
        }

        const process = (source) => {
            const o = {
                ...source,
            }
            if ((o.clave || o.confirm) && o.clave !== o.confirm) {
                throw new Error(
                    'Las contraseñas no coinciden',
                )

            }
            delete o.people
            o.roleCollection =
                (o.roleCollection || [])
                    .map(rid => ({
                        rid,
                    }))
            delete o.confirm
            console.log(o)
            return false;
        }

        const init = async () => {
            await loadRoles()
            if (id) {
                await find(id)
            }
        }

        init()
        return {
            o: oRef,
            roles,
            peopleAutocomplete,
            peopleInput,
            process,
        }
    },

})
</script>


<style scoped>
.people-option {
    display: flex;
    gap: 8px;
    align-items: center;
}

.people-option strong {
    min-width: 90px;
}

.roles-loading {
    padding: 12px;
    color: #777;
}

.roles> :deep(.v-checkbox) {
    display: inline-block !important;
    width: calc(50% - 35px) !important;
}

.roles> :deep(.v-checkbox)>span:not(.checkmark) {
    text-overflow: ellipsis !important;
    white-space: nowrap;
    overflow-x: hidden;
    display: block;
    width: calc(100% - 5px);
}

@media (max-width: 700px) {
    .roles> :deep(.v-checkbox) {
        width: 100% !important;
    }
}
</style>