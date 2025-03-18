<template>
    <div>
   hola9
    </div>
</template>
<script>
import { ui } from 'isobit-ui'
import { useRouter } from 'vue-router';
export default ui({
    setup() {
    try {
      const router = useRouter();
      console.log("Router:", router);
      return { router };
    } catch (error) {
      console.error("Error al obtener router:", error);
    }
  }
});
</script>