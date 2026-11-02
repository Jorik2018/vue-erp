<template>
    <v-page :header="$t('Users')" action="/admin/content/user">
        <v-table :selectable="true" :scrollable="true" rowKey="uid" :pagination="20" :filters="filters"
            src="/api/admin/user">
            <template v-slot:header>
                <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create" />

                <v-button value="Ver" icon="fa-eye" @click.prevent="edit" :disabled="!rowSelectedCount" />

                <v-button value="Editar" icon="fa-pen" @click.prevent="edit" :disabled="!rowSelectedCount" />

                <v-button value="Eliminar" icon="fa-trash" @click.prevent="destroy" :disabled="!rowSelectedCount" />

                <v-button title="Refrescar" icon="fa-sync" class="on" @click.prevent="refresh" />
            </template>

            <template v-slot="{ row, index }">

                <!-- # -->
                <td width="50" class="center" header="#" :title="row.uid">
                    <v-filter>
                        <input disabled />
                    </v-filter>

                    {{ pad(index + 1, 3) }}
                </td>

                <!-- Usuario -->
                <td width="140" :header="$t('Name')" class="center">
                    <v-filter>
                        <input v-model="filters.name" />
                    </v-filter>

                    {{ row.name }}
                </td>

                <!-- Persona -->
                <td width="260" :header="$t('Full Name')" style="display: flex;padding: 20px">
                    <v-filter>
                        <input v-model="filters.people" />
                    </v-filter>

                    <div class="user-photo">
                        <img v-if="row.directoryId" :src="`/thumb/160/foto/${row.directoryId}.jpg`" alt="" />
                    </div>

                    <a class="user-name" v-if="row.directoryId" style="flex: 1;"
                        :href="`/admin/directorio/${row.directoryId}`" target="_blank">
                        {{ row.people?.fullName || '-' }}
                    </a>

                </td>

                <!-- Email -->
                <td width="220" :header="$t('Mail')">
                    <v-filter>
                        <input v-model="filters.mail" />
                    </v-filter>

                    {{ row.mail }}
                </td>

                <!-- Estado -->
                <td width="120" class="center" :header="$t('Status')">
                    <v-filter>
                        <v-select multiple v-model="filters.status">
                            <v-options :data="status" value-field="id">
                                <template v-slot="{ item }">
                                    {{ item.name }}
                                </template>
                            </v-options>
                        </v-select>
                    </v-filter>

                    <span class="user-status" :class="row.status
                        ? 'user-status--active'
                        : 'user-status--blocked'">
                        {{ row.status ? 'ACTIVO' : 'BLOQUEADO' }}
                    </span>
                </td>

                <!-- Fecha creación -->
                <td width="110" class="center" :header="$t('Created')">
                    <v-filter>
                        <v-filter-calendar v-model="filters.created" />
                    </v-filter>

                    {{ date(row.created && row.created * 1000) }}
                </td>

                <!-- Último acceso -->
                <td width="110" class="center" header="Último acceso">
                    <v-filter>
                        <v-filter-calendar v-model="filters.access" />
                    </v-filter>

                    {{ date(row.access && row.access * 1000) }}
                </td>

            </template>
        </v-table>
        <v-popup />
    </v-page>
</template>

<script>
import { ui } from 'isobit-ui'

export default ui({
    setup() {
        return {
            rewrite: (s) => {
                alert(s);
                return s
            }
        }
    },
    data() {
        return {
            status: [
                {
                    name: 'TODOS'
                },
                {
                    id: 1,
                    name: 'ACTIVO'
                },
                {
                    id: 'B',
                    name: 'BLOQUEADO'
                }
            ]
        }
    },
    methods: {
        rewrite: (s) => s.replace('/admin/user', '/admin/content/user')
    }
})
</script>

<style scoped>
.user-person {
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-photo {
    width: 55px;
    min-width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-photo img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
}

.user-name {
    min-width: 0;
}

.user-name a {
    text-decoration: none;
}

.user-name a:hover {
    text-decoration: underline;
}

.user-status {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
}

.user-status--active {
    background: #e2f3e5;
    color: #176b2c;
}

.user-status--blocked {
    background: #f5dfdf;
    color: #922323;
}
</style>
