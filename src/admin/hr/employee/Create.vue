<template>
    <v-form header="Crear Empleado" action="/api/hr/employee">
        <span class="v-button-top-float" @click="save"><i class="fa fa-save"></i></span>
        <div class="v-form">
            <label>DNI:</label>
            <input v-model="o.code" required="true" class="center" />
            <label>Nombres:</label>
            <input v-model="o.names" class="ucase" required="true" />
            <label>Ap. Paterno:</label>
            <input v-model="o.paternalSurname" required="true" />
            <label>Ap. Materno:</label>
            <input v-model="o.maternalSurname" required="true" />
            <label>RUC:</label>
            <input v-model="o.ruc" class="center" />
        </div>
    </v-form>
</template>
<script lang="ts">
import { ui } from 'isobit-ui'
export default ui({
    props: ["id"],
    data() {
        return {
            o: {
                id: null
            },
        };
    },
    methods: {
    },
});
</script>
<style scoped>
.xyz {
    padding: 0px !important;
}

.xyz>a {
    padding: 10px;
    background-color: #e1f8ff;
    border: 1px solid gray;
    margin-top: 10px;
    display: block;
}
</style>