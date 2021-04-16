<template>
  <div
    class="w-full h-full min-h-screen bg-gray-800 text-gray-200 flex justify-center items-center font-mono text-2xl sm:text-3xl"
  >
    <Calculator />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Calculator from "./components/Calculator.vue";

export default defineComponent({
  name: "App",
  components: { Calculator },
});
</script>
