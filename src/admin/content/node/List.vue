<template>
    <v-page header="Publicaciones" action="/admin/content/node">
        <v-table :selectable="true" row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
            store="inventory" :scrollable="true" rowKey="id" :pagination="20" :filters="filters"
            src="/api/content/node">
            <template v-slot:header>
                <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create"></v-button>
                <v-button value="Editar" icon="fa-pen" @click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
                <v-button value="Eliminar" icon="fa-trash" @click.prevent="destroy"
                    :disabled="!rowSelectedCount"></v-button>
                <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
            </template>
            <template v-slot="{ row }">
                <td width="80" class="center" header="ID">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{ pad(row.id, 4) }}
                </td>
                <td width="80" header="Vid" class="center">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{row.vid}}
                </td>
                <td width="80" :header="$t('Type')" class="center">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{row.type}}
                </td>
                <td width="80" :header="$t('Language')" class="center">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{row.language}}
                </td>
                <td width="220" :header="$t('Title')" >
                    <v-filter>
                        <input v-model="filters.title" />
                    </v-filter>
                    <a :href="row.url" target="_blank">
                    {{ row.title }}
                    </a>
                </td>
                <td width="80" :header="$t('User')" class="center">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{row.uid}}
                </td>
                <td width="80" :header="$t('Status')"class="center">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{row.status}}
                </td>
                <td width="80" :header="$t('Created')" class="center">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{date(row.created)}}
                </td>
                <td width="80" :header="$t('Changed')" class="center">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{date(row.changed)}}
                </td>
                <td width="80" :header="$t('Comment')" class="center">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{row.comment}}
                </td>
                <td width="80" :header="$t('Promote')" class="center">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{row.promote}}
                </td>
                <td width="80" :header="$t('Moderate')" class="center">
                    <v-filter>
                        <input disabled />
                    </v-filter>
                    {{row.moderate}}
                </td>
            </template>
        </v-table>
    </v-page>
</template>
<script>
import { ui } from 'isobit-ui'
export default ui({
    data() {
        return { rowSelectedCount2: 0, page: 0, data: [], mode: 0, query: null, op: {} }
    },
    created() {
        const me = this;
        //me.filters.uid = me.user.uid;
    },
    updated() {
        this.app.bindLinks(this.$el);
    },
    methods: {
                rewrite(url) {
                    alert(url);
            return '/admin' + url;
        },
        ll(e) { console.log(e) },
        can(o) {
            var m = this, u = m.user;
            return o || u.uid == 1;
            /*return u.uid == 1 || p.REGISTER_DESARROLLO_SOCIAL_SIVICO &&
            !o || o.user == u.id;*/
        }
    }
});
</script>
<style scoped>
.hg {
    background-color: green !important;
}

.hgd {
    background-color: #005d00 !important;
}

.hr {
    background-color: #bf0000 !important;
}

.hbd {
    background-color: #033d71 !important;
}
</style>