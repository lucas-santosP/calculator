import { ref, readonly } from "vue";

const OPERATORS = ["/", "*", "+", "-"];

export function useCalculate() {
  let memory = ref("");
  let error = ref(false);
  let clearOnNextDigit = ref(false);

  function isOperator(string: string) {
    return OPERATORS.includes(string);
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
    memory.value += `${operator}`;
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

    memory.value = memory.value.slice(0, memory.value.length - 1);
    clearOnNextDigit.value = false;
  }

  function clear() {
    memory.value = "";
    error.value = false;
  }

  return {
    memory: readonly(memory),
    error: readonly(error),
    addDigit,
    addOperator,
    calculateResult,
    eraseLast,
    clear,
  };
}
