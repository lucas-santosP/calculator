<template>
  <div
    class="grid grid-rows-6 grid-cols-4 gap-2 p-1 rounded-lg bg-gray-700 w-full my-10 sm:max-w-2xl"
  >
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
    <Button variant="operator" @click="addOperator('s')">-</Button>

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
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from "vue";
import Button from "./Button.vue";
import Screen from "./Screen.vue";

interface IOperators {
  [key: string]: (a: number, b: number) => number;
}

export default defineComponent({
  name: "HelloWorld",
  components: { Button, Screen },

  setup: () => {
    const buttonPadNumbers = [
      [7, 8, 9],
      [4, 5, 6],
      [1, 2, 3],
    ];
    const operators: IOperators = {
      "/": (a: number, b: number) => a / b,
      "*": (a: number, b: number) => a * b,
      "+": (a: number, b: number) => a + b,
      s: (a: number, b: number) => a - b,
    };

    let memory = ref("");

    function isOperator(string: string) {
      const keys = Object.keys(operators).filter((key) => key !== "isOperator");
      return keys.includes(string);
    }

    function addDigit(digit: number | string) {
      if (!memory.value && digit === ".") memory.value += "0";
      memory.value += `${digit}`;
    }

    function addOperator(operator: string) {
      if (!memory.value && operator !== "s") return;
      if (memory.value[memory.value.length - 1] === " ") eraseLastDigit();
      memory.value += ` ${operator} `;
    }

    function calculateOperation(chars: string[]): number {
      const operatorIndex = chars.findIndex((char) => isOperator(char));
      if (operatorIndex === -1) return 0;

      const currentOperator = chars[operatorIndex];

      let firstNumber = "";
      for (let i = operatorIndex - 1; i >= 0 && !isOperator(chars[i]); i--) {
        firstNumber = chars[i] + firstNumber;
      }

      let secondNumber = "";
      for (let i = operatorIndex + 1; i !== chars.length && !isOperator(chars[i]); i++) {
        secondNumber += chars[i];
      }

      const firstNumberParsed = parseFloat(firstNumber) || 0;
      const secondNumberParsed = parseFloat(secondNumber) || 0;
      const result = operators[currentOperator](firstNumberParsed, secondNumberParsed);

      chars.splice(operatorIndex - firstNumber.length, firstNumber.length);
      chars.splice(operatorIndex - firstNumber.length, secondNumber.length + 1);
      return result;
    }

    function calculateResult() {
      if (!memory.value) return;

      let chars = memory.value.replace(/\s/g, "").split("");
      // Remove from chars if last digit is a operator
      if (isOperator(chars[chars.length - 1])) {
        chars.splice(chars.length - 1, 1);
      }
      if (chars.findIndex((char) => isOperator(char)) === -1) {
        return;
      }

      let result = 0;

      while (chars.length !== 0) {
        if (result) chars = [...result.toString().split(""), ...chars];
        console.log(chars);

        result = calculateOperation(chars);
        console.log(result);
      }
      console.log(chars);
      // console.log(chars);
      // result = calculateOperation(chars);
      // console.log(chars);

      memory.value = result.toString();
    }

    function eraseLastDigit() {
      if (!memory.value.length) return;

      const chars = memory.value.split("");
      // When last char is a operator, remove spaces too
      if (chars[chars.length - 1] === " ") chars.splice(chars.length - 3, 3);
      else chars.splice(chars.length - 1, 1);

      memory.value = chars.join("");
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
