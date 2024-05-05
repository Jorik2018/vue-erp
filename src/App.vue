<template>
  <router-view></router-view>
</template>
<script lang="ts">
import axios from "axios";
import { ui } from "vue3-ui";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
export default ui({
  data() {
    return {
      app: null,
      counter: 0,
    }
  }
})
</script>
