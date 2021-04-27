<template>
  <Grid
    rows="6"
    cols="4"
    gap="2"
    class="w-full sm:max-w-md h-screen sm:h-auto sm:my-10 p-3 pt-8 sm:rounded-lg bg-gray-600"
  >
    <Screen :text="memory" :error="error" class="col-span-4" />

    <Button variant="red" class="col-span-2" @click="clear">Clear</Button>
    <Button variant="yellow" @click="eraseLast">Del</Button>
    <Button variant="green" @click="addOperator('/')">/</Button>

    <Button v-for="number in ['7', '8', '9']" :key="number" @click="addDigit(number)">
      {{ number }}
    </Button>
    <Button variant="green" @click="addOperator('*')">*</Button>

    <Button v-for="number in ['4', '5', '6']" :key="number" @click="addDigit(number)">
      {{ number }}
    </Button>
    <Button variant="green" @click="addOperator('-')">-</Button>

    <Button v-for="number in ['1', '2', '3']" :key="number" @click="addDigit(number)">
      {{ number }}
    </Button>
    <Button variant="green" @click="addOperator('+')">+</Button>

    <Button class="col-span-2" @click="addDigit('0')">0</Button>
    <Button @click="addDigit('.')">.</Button>
    <Button variant="green" @click="calculateResult">=</Button>
  </Grid>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import { useCalculate } from "../compositions/useCalculate";
import { useKeyboard } from "../compositions/useKeyboard";
import Button from "./Button.vue";
import Screen from "./Screen.vue";
import Grid from "./Grid.vue";
import { DIGITS, OPERATORS, RESULT_KEYS, CLEAR_KEYS, ERASE_KEYS } from "../shared/constants";

export default defineComponent({
  name: "Calculator",
  components: { Button, Screen, Grid },

  setup: () => {
    const calculate = useCalculate();
    const keyboard = useKeyboard();

    onMounted(() => {
      keyboard.addListener((e) => {
        const key = e.key === "," ? "." : e.key;

        if (DIGITS.includes(key)) calculate.addDigit(key);
        if (OPERATORS.includes(key)) calculate.addOperator(key);
        if (RESULT_KEYS.includes(key)) calculate.calculateResult();
        if (ERASE_KEYS.includes(key)) calculate.eraseLast();
        if (CLEAR_KEYS.includes(key)) calculate.clear();
      });
    });

    onBeforeUnmount(() => {
      keyboard.removeAllListeners();
    });

    return { ...calculate };
  },
});
</script>
