import { useCalculate } from "../../../src/compositions/useCalculate";

function addMultiplesDigits(string: string, addDigit: (s: string) => void) {
  const digits = string.split("");
  digits.forEach((digit) => addDigit(digit));
}

describe("useCalculate", () => {
  it("should add digits to the memory", () => {
    const { addDigit, memory } = useCalculate();
    const expectedDigit = "1.234567890";

    addMultiplesDigits(expectedDigit, addDigit);
    expect(memory.value).toEqual("1.234567890");
  });

  it("should prevent to add octal numeric", () => {
    const { addDigit, memory } = useCalculate();
    addMultiplesDigits("01", addDigit);
    expect(memory.value).toEqual("1");
  });

  it("should add 0 before the dot when the dot is added without any number before", () => {
    const { addDigit, memory } = useCalculate();
    addDigit(".");
    expect(memory.value).toEqual("0.");
  });

  it("should prevent to add multiples dot in sequence", () => {
    const { addDigit, memory } = useCalculate();
    addMultiplesDigits("...", addDigit);
    expect(memory.value).toEqual("0.");
  });

  it("should prevent to add operators before number, expect minus operator", () => {
    const { addOperator, memory } = useCalculate();
    addOperator("+");
    addOperator("*");
    addOperator("/");
    expect(memory.value).toEqual("");

    addOperator("-");
    expect(memory.value).toEqual("-");
  });

  it("should prevent to add multiples operators in sequence", () => {
    const { addOperator, addDigit, memory } = useCalculate();
    addDigit("5");
    addOperator("+");
    expect(memory.value).toEqual("5+");

    addOperator("-");
    expect(memory.value).toEqual("5-");

    addOperator("*");
    expect(memory.value).toEqual("5*");

    addOperator("/");
    expect(memory.value).toEqual("5/");
  });

  it("should throws a error when calls addDigit passing a non digit", () => {
    const { addDigit } = useCalculate();
    expect(() => addDigit("a")).toThrowError();
    expect(() => addDigit("+")).toThrowError();
    expect(() => addDigit("-")).toThrowError();
    expect(() => addDigit(" ")).toThrowError();
    expect(() => addDigit("o")).toThrowError();
  });

  it("should throws a error when calls addOperator passing a non operator", () => {
    const { addOperator } = useCalculate();
    expect(() => addOperator("a")).toThrowError();
    expect(() => addOperator("5")).toThrowError();
    expect(() => addOperator(" ")).toThrowError();
    expect(() => addOperator(".")).toThrowError();
  });

  it("should calculate valid math expressions", () => {
    const { addOperator, addDigit, calculateResult, memory } = useCalculate();
    addDigit("5");
    addOperator("+");
    addDigit("9");
    calculateResult();
    expect(memory.value).toEqual("14");

    addOperator("-");
    addDigit("4");
    calculateResult();
    expect(memory.value).toEqual("10");

    addOperator("/");
    addDigit("2");
    calculateResult();
    expect(memory.value).toEqual("5");

    addOperator("*");
    addDigit("3");
    calculateResult();
    expect(memory.value).toEqual("15");
  });

  it("should calculate valid math expressions with multiples operators", () => {
    const { addOperator, addDigit, calculateResult, memory } = useCalculate();
    addDigit("5");
    addOperator("+");
    addDigit("9");
    addOperator("-");
    addDigit("4");
    addOperator("/");
    addDigit("2");
    addOperator("*");
    addDigit("3");
    calculateResult();
    expect(memory.value).toEqual("8");
  });

  it("should keep the value when call calculate result without a math expression", () => {
    const { calculateResult, addDigit, addOperator, memory } = useCalculate();
    calculateResult();
    expect(memory.value).toEqual("");
    addDigit("7");
    calculateResult();
    expect(memory.value).toEqual("7");

    addOperator("+");
    calculateResult();
    expect(memory.value).toEqual("7");
  });

  it("should clear memory when add digit after a calculated result", () => {
    const { addOperator, addDigit, calculateResult, memory } = useCalculate();
    addDigit("5");
    addOperator("+");
    addDigit("9");
    calculateResult();
    expect(memory.value).toEqual("14");

    addDigit("4");
    expect(memory.value).toEqual("4");
  });

  it("should clear memory", () => {
    const { addOperator, addDigit, clear, memory } = useCalculate();
    addDigit("5");
    addOperator("+");
    addDigit("9");
    clear();
    expect(memory.value).toEqual("");
  });

  it("should delete last digit or operator", () => {
    const { addOperator, addDigit, eraseLast, memory } = useCalculate();
    addDigit("5");
    addOperator("+");
    addDigit("9");
    eraseLast();
    expect(memory.value).toEqual("5+");

    eraseLast();
    expect(memory.value).toEqual("5");

    eraseLast();
    expect(memory.value).toEqual("");
    eraseLast();
    expect(memory.value).toEqual("");
  });

  it("should set error to true when calls calculate result with invalid math expression", () => {
    const { calculateResult, addDigit, memory, error } = useCalculate();
    addMultiplesDigits("5.5.", addDigit);
    calculateResult();
    expect(memory.value).toBe("");
    expect(error.value).toBe(true);
  });
});
