<template>
    <Teleport to="body">
        <div v-if="isOpen" class="popup-overlay" @click.self="close">
            <div class="popup" :style="{ width }">
                <button type="button" class="popup-close" @click="close">
                    ✕
                </button>

                <component
    v-if="currentView"
    :is="currentView"
    v-bind="currentParams"
    :callback="callback"
/>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import {
    ref,
    shallowRef,
} from 'vue'

import { useRouter } from 'vue-router'


defineProps({
    width: {
        type: String,
        default: '600px',
    },
})


const emit = defineEmits([
    'success',
    'close',
])


const router = useRouter()

const isOpen = ref(false)
const currentView = shallowRef(null)
const currentParams = ref({})


const resolveView = async (routeRef) => {
    let route = router
        .getRoutes()
        .find(route => route.name === routeRef)

    let params = {}

    if (!route) {
        const resolved = router.resolve(routeRef)

        route = resolved.matched.at(-1)
        params = resolved.params
    }

    if (!route) {
        throw new Error(
            `No existe la ruta "${routeRef}"`
        )
    }

    let component =
        route.components?.default
        ?? route.component

    if (!component) {
        throw new Error(
            `La ruta "${routeRef}" no tiene componente`
        )
    }

    if (typeof component === 'function') {
        const module = await component()
        component = module.default ?? module
    }

    return {
        component,
        params,
    }
}

const open = async (
    routeRef,
    data = null,
) => {
    const resolved = await resolveView(routeRef)

    currentView.value = resolved.component
    currentParams.value = {
        ...resolved.params,
        ...(data ?? {}),
    }
    isOpen.value = true
}


const close = (v) => {

    isOpen.value = false
    

    emit('close',v);
    currentView.value = null
}

const callback = async (
    routeRef = null,
    result = undefined,
) => {

    /*if (result !== undefined) {
        close()
        success(result)
        
    }*/

    /*if (routeRef) {
        await open(
            routeRef,
            currentData.value,
        )

        return
    }*/
    close(routeRef)
    //success(result)
}


defineExpose({
    open,
    close,
})
</script>


<style scoped>
.popup-overlay {
    position: fixed;
    inset: 0;

    background: rgba(0, 0, 0, 0.45);

    overflow-y: auto;
    padding: 50px;

    display: flex;
    justify-content: center;
    align-items: flex-start;

    box-sizing: border-box;

    z-index: 999;
}

@media (prefers-color-scheme: dark) {
    .popup {
        background-color: black;
        border: 1px solid rgb(190, 190, 190);
        ;
    }
}

@media (prefers-color-scheme: light) {
    .popup {
        background-color: white;
        border: 1px solid rgb(190, 190, 190);
    }
}

.popup {
    position: relative;
    border-radius: 6px;

    padding: 24px;

    box-sizing: border-box;

    max-width: 100%;
    min-height: 100px;

    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.popup-close {
    position: absolute;
    top: 10px;
    right: 12px;

    border: 0;
    background: transparent;

    font-size: 20px;
    cursor: pointer;

    z-index: 1;
}
</style>
