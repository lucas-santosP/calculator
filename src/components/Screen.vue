<template>
  <div class="col-span-4 flex justify-end items-center bg-gray-700 text-white px-5">
    <template v-if="text">{{ text }}</template>
    <span v-else class="animate-pulse mt-6">__</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Screen",
  props: {
    text: { type: String, default: "" },
  },
});
</script>
