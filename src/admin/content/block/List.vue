<template>
    <v-page header="Publicaciones" action="/admin/content/block">
        <v-table :selectable="true" row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
            store="inventory" :scrollable="true" rowKey="bid" :pagination="20" :filters="filters"
            src="/api/content/block">
            <template v-slot:header>
                <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create"></v-button>
                <v-button value="Editar" icon="fa-pen" @click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
                <v-button value="Eliminar" icon="fa-trash" @click.prevent="destroy"
                    :disabled="!rowSelectedCount"></v-button>
                <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
            </template>
            <template v-slot="{ row }">
                 <td width="80" :header="$t('Module')" class="center" title="#{row.delta}">
                    {{row.module}}
                </td>
                <td width="80" :header="$t('Theme')" class="center">
                    {{row.theme}}
                </td>
                <td width="80" :header="$t('Status')" class="center">
                    {{row.status?'ACTIVO':'OCULTO'}}
                </td>
                <td width="160" :header="$t('Title')">
                    {{row.title}}
                </td>
                <td width="80" :header="$t('Peso')" class="center">
                    {{row.weight}}
                </td>
                <td width="80" :header="$t('Region')">
                    {{row.region}}
                </td>
                <td width="80" :header="$t('Custom')" class="center">
                    {{row.custom}}
                </td>
                <td width="80" :header="$t('Throttle')" class="center">
                    {{row.throttle}}
                </td>
                <td width="80" :header="$t('Visibility')" class="center">
                    {{row.visibility}}
                </td>
                <td width="250" :header="$t('Page')+'s'">
                    {{row.pages}}
                </td>
                <td width="80" :header="$t('Cache')" class="center">
                    {{row.cache}}
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