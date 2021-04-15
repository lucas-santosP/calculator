<template>
  <Grid
    rows="6"
    cols="4"
    gap="2"
    class="p-1 sm:p-4 rounded-lg bg-gray-600 w-full my-10 sm:max-w-md"
  >
    <Screen :text="memory" />

    <Button variant="red" class="col-span-2 bg-gray-200" @click="clear">Clear</Button>
    <Button variant="yellow" class="bg-gray-200" @click="eraseLastDigit">Del</Button>
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
import { ref, defineComponent, computed } from "vue";
import Button from "./Button.vue";
import Screen from "./Screen.vue";
import Grid from "./Grid.vue";

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

    function isOperator(string: string) {
      return operators.find((operator) => operator === string);
    }

    function lastCharIsOperator(string: string) {
      const stringNormalized = string.replace(/\s/g, "");
      return isOperator(stringNormalized[stringNormalized.length - 1]);
    }

    function addDigit(digit: number | string) {
      if ((!memory.value || lastCharIsOperator(memory.value)) && digit === ".") memory.value += "0";
      memory.value += `${digit}`;
    }

    function addOperator(operator: string) {
      if (!memory.value && operator !== "s") return;
      if (lastCharIsOperator(memory.value)) eraseLastDigit();
      memory.value += ` ${operator} `;
    }

    function calculateResult() {
      if (!memory.value) return;

      let mathExpression = memory.value.replace(/\s/g, ""); //remove spaces

      if (lastCharIsOperator(mathExpression)) {
        mathExpression = mathExpression.slice(0, mathExpression.length - 1);
      }
      const hasValidOperation = mathExpression.split("").find((char) => isOperator(char));
      if (!hasValidOperation) return;

      mathExpression = mathExpression.replace(/\b0*((\d+\.\d+|\d+))\b/g, "$1"); // remove octal numeric
      memory.value = `${eval(mathExpression)}`;
    }

    function eraseLastDigit() {
      if (!memory.value.length) return;

      if (lastCharIsOperator(memory.value)) {
        memory.value = memory.value.slice(0, memory.value.length - 3); // remove spaces too
      } else {
        memory.value = memory.value.slice(0, memory.value.length - 1);
      }
    }

    function clear() {
      memory.value = "";
    }

    const memoryNormalized = computed(() => memory.value.replaceAll("s", "-"));

    return {
      memory: memoryNormalized,
      padNumbers,
      addDigit,
      addOperator,
      calculateResult,
      eraseLastDigit,
      clear,
    };
  },
});
</script>
