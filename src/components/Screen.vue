<template>
  <div class="relative col-span-4 flex justify-end items-center bg-gray-800 px-5">
    <div class="overflow-hidden text-right">
      <span v-if="text" class="float-right whitespace-pre pr-5">
        {{ text }}
      </span>
    </div>

    <i class="w-4 absolute bottom-5 right-5 border-b-4 bg-white animate-pulse"></i>
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
