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

                    <input type="password" v-model="o.ext.clave" required/>
                </div>

                <div class="v-c-6">
                    <label>Confirmar:</label>

                    <input type="password" v-model="o.ext.confirm" required />
                </div>

            </div>


            <!-- Estado -->

            <label>Estado:</label>

            <v-radio-group v-model="o.status" required>
                <v-radio label="BLOQUEADO" :value="0" />

                <v-radio label="ACTIVO" :value="1" />
            </v-radio-group>


            <!-- Roles -->

            <v-fieldset legend="Roles">

                <div v-if="loadingRoles" class="roles-loading">
                    Cargando roles...
                </div>

                <v-checkbox-group v-else class="roles" v-model="o.roleCollection">
                    <v-checkbox v-for="role in roles" :key="role.rid" :label="role.name" :title="role.rid"
                        :value="role.rid" />
                </v-checkbox-group>

            </v-fieldset>


            <!-- Notificación -->

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
        'uid',
        'callback',
    ],


    setup({
        app,
        uid,
        callback,
    }) {

        const { axios } = app


        /*
         * ============================================================
         * STATE
         * ============================================================
         */

        const peopleAutocomplete = ref(null)

        const roles = ref([])

        const loadingRoles = ref(false)

        const oRef = ref({
            ext:{notify: true},
            status: 1,
            roleCollection: []
        })

        const loadRoles = async () => {
            loadingRoles.value = true
            try {
                const { data } = await axios.get(
                    '/api/admin/role/0/0'
                )
                const list = Array.isArray(data)
                    ? data
                    : data?.data || []

                roles.value = list.sort(
                    (a, b) =>
                        (a.name || '').localeCompare(
                            b.name || '',
                        ),
                )

            } catch (error) {

                console.error(
                    'Error cargando roles:',
                    error.response?.data || error,
                )

                roles.value = []

            } finally {

                loadingRoles.value = false
            }
        }


        /*
         * ============================================================
         * LOAD USER
         * ============================================================
         */

        const find = async (id) => {

            if (!id) {
                return
            }

            try {

                const { data } = await axios.get(
                    `/api/content/user/${id}`,
                )


                /*
                 * Roles del backend:
                 *
                 * [
                 *   { rid: 1 },
                 *   { rid: 2 }
                 * ]
                 *
                 * ↓
                 *
                 * [1, 2]
                 */

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

                    /*
                     * No reutilizamos password/hash
                     * recibido desde backend.
                     */
                    pass: undefined,

                    clave: '',
                    confirm: '',

                    notify: true,

                    roleCollection,

                    people:
                        data.people
                        || null,
                }

            } catch (error) {

                console.error(
                    'Error cargando usuario:',
                    error.response?.data || error,
                )
            }
        }


        /*
         * ============================================================
         * PEOPLE
         * ============================================================
         */

        const peopleInput = (people) => {

            console.log(people);
            return;
            const o = oRef.value

            if (!people) {

                o.idDir = null
                o.people = null

                return
            }

            o.idDir = people.id

            o.people = people

            /*
             * Igual que el sistema anterior:
             * al elegir una persona proponemos automáticamente
             * correo y código como usuario.
             */

            if (people.mail) {
                o.mail = people.mail
            }

            if (people.code) {
                o.name = people.code
            }
        }


        /*
         * ============================================================
         * PROCESS BEFORE SAVE
         * ============================================================
         */

        const process = (source) => {

            const o = {
                ...source,
            }


            /*
             * Validación de contraseña.
             *
             * En edición puede quedar vacía para indicar
             * que no se modifica.
             */

            if (o.clave || o.confirm) {

                if (o.clave !== o.confirm) {

                    throw new Error(
                        'Las contraseñas no coinciden',
                    )
                }
            }


            /*
             * El objeto People se usa solamente en frontend.
             * El backend recibe idDir.
             */

            delete o.people


            /*
             * Convertimos:
             *
             * [1, 2, 3]
             *
             * a:
             *
             * [
             *   { rid: 1 },
             *   { rid: 2 },
             *   { rid: 3 }
             * ]
             */

            o.roleCollection =
                (o.roleCollection || [])
                    .map(rid => ({
                        rid,
                    }))


            /*
             * Confirm es exclusivamente frontend.
             */

            delete o.confirm


            return o
        }


        /*
         * ============================================================
         * INITIALIZATION
         * ============================================================
         */

        const init = async () => {

            /*
             * Primero cargamos los roles.
             *
             * Después cargamos el usuario para evitar la dependencia
             * asíncrona que tenía la implementación antigua.
             */

            await loadRoles()

            if (uid) {
                await find(uid)
            }
        }


        init()


        /*
         * ============================================================
         * EXPOSE
         * ============================================================
         */

        return {
            o: oRef,

            roles,
            loadingRoles,

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