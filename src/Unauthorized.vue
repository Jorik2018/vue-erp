<template>
    <div class="unauthorized center">
        <h1>🚫 Acceso Denegado</h1>
        <p>No tienes permisos para ver esta página.</p>
        <v-button @click.prevent="app.logout" value="Cerrar sesión e intentar con otra cuenta"></v-button>
    </div>
</template>

<script>
import { ui } from "isobit-ui";
export default ui({})
</script>

<style>
.unauthorized {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>