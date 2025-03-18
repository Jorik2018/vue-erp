import { ref, computed } from 'vue'
import { defineStore, getActivePinia } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  if (!getActivePinia()) {
    throw new Error("Pinia is not active");
  }
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
