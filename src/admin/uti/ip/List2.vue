<template>

    <v-page header="IP" action="/admin/uti/ip">

        <v-table :selectable="true" :scrollable="true" row-style-class="row.active ? 'green' : 'red'" row-key="id"
            @dblclick="dblclick" :pagination="50" src="/admin/uti/api/ip">

            <template v-slot:header="">

                <v-button value="ON / OFF" icon="fa-toggle-off" @click.prevent="disable"
                    :disabled="!rowSelectedCount" />

                <v-button value="Crear" icon="fa-plus" class="on" @click.prevent="create" />

                <v-button value="Editar" icon="fa-pen" @click.prevent="edit2"
                    :disabled="!rowSelectedCount || !getSelected()[0]?.active" />

                <v-button value="Eliminar" icon="fa-trash" @click.prevent="destroy" :disabled="!rowSelectedCount" />

                <input style="width: 100px" v-model="filters.filter" />

                <v-button value="Limpiar" icon="fa-trash" @click.prevent="limpiar" :disabled="!rowSelectedCount" />

                <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh" />

                <v-button icon="fa-book" @click.prevent="open(report)" value="Descargar Reporte" />

                <v-button icon="fa-star" @click.prevent="open(scanner)" value="Scanner IP" />

            </template>


            <template v-slot="{ row, index }">

               


                


                


                

            </template>

        </v-table>




    </v-page>

</template>


<script>

import { ui } from 'isobit-ui'

import {
    ref
} from 'vue'


export default ui({

    setup2() {

        const report = ref(null)
        const scanner = ref(null)

        const queryIP = ref(null)
        const scanResult = ref([])
        const ips = ref([{}, {}])

        return {
            report,
            scanner,
            queryIP,
            scanResult,
            ips
        }
    },

    created2() {

        const user =
            this.user

        /*
         * Antes:
         *
         * #{systemController.access('ADMIN_UTI_ATTENTION')}
         *
         * Esto ya no debe resolverse con JSF.
         *
         * Si el frontend actual obtiene permisos desde
         * this.app.can(), puedes hacer:
         */
        this.perms.ADMIN_UTI_ATTENTION =
            this.app?.can
                ? this.app.can('ADMIN_UTI_ATTENTION')
                : false


        if (
            user &&
            !(
                user.uid === 1 ||
                user.ext?.perms?.ADMIN_UTI
            )
        ) {

            this.filters.user =
                user.ext?.people?.id

            if (
                user.ext?.perms?.ATTEND_UTI_ATTENTION
            ) {
                this.filters.empty = true
            }

        }


        try {

            const saved =
                localStorage.getItem('scanResult')

            if (saved) {
                this.scanResult =
                    JSON.parse(saved)
            }

        } catch (e) {

            console.log(e)

        }

    }

})

</script>