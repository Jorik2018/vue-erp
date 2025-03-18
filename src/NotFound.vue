<template>
    <div class="not-found">
        <h1>404 - Página no encontrada</h1>
        <router-link to="/">Volver al inicio</router-link>
    </div>
</template>

<script lang="ts">
import { ui } from "isobit-ui";
export default ui({})
</script>

<style>
.not-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>