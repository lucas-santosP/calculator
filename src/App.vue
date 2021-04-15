<template>
  <div
    class="h-screen w-screen bg-gray-200 text-gray-800 flex justify-center items-center text-3xl sm:text-4xl"
  >
    <Calculator />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Calculator from "./components/Calculator.vue";

export default defineComponent({
  name: "App",
  components: {
    Calculator,
  },
});
</script>
