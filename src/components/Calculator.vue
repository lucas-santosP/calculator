<template>
  <Grid rows="6" cols="4" gap="2" class="p-2 rounded-lg bg-gray-700 w-full my-10 sm:max-w-xl">
    <Screen :text="memory" />

    <Button class="col-span-2 bg-gray-200" @click="clear">Clear</Button>
    <Button class="bg-gray-200" @click="eraseLastDigit">Del</Button>
    <Button variant="operator" @click="addOperator('/')">/</Button>

    <Button
      v-for="number in buttonPadNumbers[0]"
      :key="number"
      @click="addDigit(number)"
      variant="digit"
    >
      {{ number }}
    </Button>
    <Button variant="operator" @click="addOperator('*')">*</Button>

    <Button
      v-for="number in buttonPadNumbers[1]"
      :key="number"
      @click="addDigit(number)"
      variant="digit"
    >
      {{ number }}
    </Button>
    <Button variant="operator" @click="addOperator('-')">-</Button>

    <Button
      v-for="number in buttonPadNumbers[2]"
      :key="number"
      @click="addDigit(number)"
      variant="digit"
    >
      {{ number }}
    </Button>
    <Button variant="operator" @click="addOperator('+')">+</Button>

    <Button class="col-span-2" @click="addDigit(0)" variant="digit">0</Button>
    <Button @click="addDigit('.')" variant="digit">.</Button>
    <Button variant="operator" @click="calculateResult">=</Button>
  </Grid>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from "vue";
import Button from "./Button.vue";
import Screen from "./Screen.vue";
import Grid from "./Grid.vue";

export default defineComponent({
  name: "HelloWorld",
  components: { Button, Screen, Grid },

  setup: () => {
    const buttonPadNumbers = [
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
      const hasValidOperation = mathExpression.split("").findIndex((char) => isOperator(char));
      if (!hasValidOperation) return;

      memory.value = `${eval(memory.value)}`;
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
      buttonPadNumbers,
      addDigit,
      addOperator,
      calculateResult,
      eraseLastDigit,
      clear,
    };
  },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
