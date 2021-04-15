<template>
  <button class="h-24 p-4 rounded-lg focus:outline-none transition-all" :class="classes">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

type IVariant = "default" | "digit" | "operator";

type IVariantsClasses = {
  [key in IVariant]: string;
};

export default defineComponent({
  name: "Button",
  props: {
    variant: { type: String as PropType<IVariant>, default: "default" },
  },

  setup(props) {
    const variantsClasses: IVariantsClasses = {
      default: "bg-red-400 hover:bg-red-300",
      digit: "bg-blue-400 hover:bg-blue-300",
      operator: "bg-yellow-400 hover:bg-yellow-300",
    };

    return { classes: variantsClasses[props.variant] };
  },
});
</script>
