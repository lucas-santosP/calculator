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

    <Button variant="blue" v-for="number in padNumbers[0]" :key="number" @click="addDigit(number)">
      {{ number }}
    </Button>
    <Button variant="green" @click="addOperator('*')">*</Button>

    <Button variant="blue" v-for="number in padNumbers[1]" :key="number" @click="addDigit(number)">
      {{ number }}
    </Button>
    <Button variant="green" @click="addOperator('-')">-</Button>

    <Button variant="blue" v-for="number in padNumbers[2]" :key="number" @click="addDigit(number)">
      {{ number }}
    </Button>
    <Button variant="green" @click="addOperator('+')">+</Button>

    <Button variant="blue" class="col-span-2" @click="addDigit(0)">0</Button>
    <Button variant="blue" @click="addDigit('.')">.</Button>
    <Button variant="green" @click="calculateResult">=</Button>
  </Grid>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, onBeforeUnmount } from "vue";
import { useKeyboard } from "../compositions/useKeyboard";
import Button from "./Button.vue";
import Screen from "./Screen.vue";
import Grid from "./Grid.vue";
import {
  DIGITS_KEYS,
  OPERATORS_KEYS,
  RESULT_KEYS,
  ERASE_KEYS,
  CLEAR_KEYS,
} from "../shared/constants";

export default defineComponent({
  name: "Calculator",
  components: { Button, Screen, Grid },

  setup: () => {
    const padNumbers = [
      [7, 8, 9],
      [4, 5, 6],
      [1, 2, 3],
    ];
    const operators = ["/", "*", "+", "-"];
    let memory = ref("");
    let error = ref(false);
    let clearOnNextDigit = ref(false);
    const keyboard = useKeyboard();

    onMounted(() => {
      keyboard.addListener((e) => {
        const key = e.key === "," ? "." : e.key;

        if (DIGITS_KEYS.includes(key)) addDigit(key);
        if (OPERATORS_KEYS.includes(key)) addOperator(key);
        if (RESULT_KEYS.includes(key)) calculateResult();
        if (ERASE_KEYS.includes(key)) eraseLast();
        if (CLEAR_KEYS.includes(key)) clear();
      });
    });

    onBeforeUnmount(() => {
      keyboard.removeAllListeners();
    });

    function isOperator(string: string) {
      return operators.find((operator) => operator === string);
    }

    function lastCharIsOperator(string: string) {
      const stringNormalized = string.replace(/\s/g, "");
      return isOperator(stringNormalized[stringNormalized.length - 1]);
    }

    function addDigit(digit: number | string) {
      const lastDigit = memory.value[memory.value.length - 1];

      if (lastDigit === "." && digit === ".") return;
      if (lastDigit === "0" && memory.value.length === 1) clear();
      if (clearOnNextDigit.value) clear();
      if ((!memory.value || lastCharIsOperator(memory.value)) && digit === ".") memory.value += "0";

      clearOnNextDigit.value = false;
      memory.value += `${digit}`;
    }

    function addOperator(operator: string) {
      if (!memory.value) return;
      if (lastCharIsOperator(memory.value)) eraseLast();

      clearOnNextDigit.value = false;
      memory.value += ` ${operator} `;
    }

    function calculateResult() {
      if (!memory.value) return;

      let mathExpression = memory.value.replace(/\s/g, ""); //remove spaces
      if (lastCharIsOperator(mathExpression)) {
        mathExpression = mathExpression.slice(0, mathExpression.length - 1);
      }

      try {
        mathExpression = mathExpression.replace(/\b0*((\d+\.\d+|\d+))\b/g, "$1"); // remove octal numeric
        memory.value = `${eval(mathExpression) || ""}`;
      } catch (_) {
        error.value = true;
        memory.value = "";
      } finally {
        clearOnNextDigit.value = true;
      }
    }

    function eraseLast() {
      if (!memory.value.length) return;

      if (lastCharIsOperator(memory.value)) {
        memory.value = memory.value.slice(0, memory.value.length - 3); // remove spaces too
      } else {
        memory.value = memory.value.slice(0, memory.value.length - 1);
      }
      clearOnNextDigit.value = false;
    }

    function clear() {
      memory.value = "";
      error.value = false;
    }

    return {
      memory,
      error,
      padNumbers,
      addDigit,
      addOperator,
      calculateResult,
      eraseLast,
      clear,
    };
  },
});
</script>
