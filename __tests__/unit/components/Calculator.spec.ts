import { ComponentPublicInstance } from "@vue/runtime-core";
import { shallowMount, mount, VueWrapper } from "@vue/test-utils";
import Calculator from "../../../src/components/Calculator.vue";
import Screen from "../../../src/components/Screen.vue";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const OPERATORS = ["/", "*", "+", "-"];

async function addToMemory(wrapper: VueWrapper<ComponentPublicInstance>, expression: string) {
  const expressionNormalized = expression.replace(/\s/g, "");

  expressionNormalized.split("").forEach(async (expressionChar) => {
    const button = wrapper.findAll("button").find((button) => button.text() === expressionChar);
    await button?.trigger("click");
  });
}

async function clearMemory(wrapper: VueWrapper<ComponentPublicInstance>) {
  const buttonClear = wrapper.findAll("button").find((button) => button.text() === "Clear");
  await buttonClear?.trigger("click");
}

describe("Calculator", () => {
  it("is a vue instance", () => {
    const wrapper = shallowMount(Calculator);
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render Screen correctly", async () => {
    const wrapper = mount(Calculator);
    const screen = wrapper.findComponent(Screen);
    expect(screen.exists()).toBeTruthy();
  });

  it("should render all buttons correctly", () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");

    DIGITS.forEach((digit) => {
      const buttonDigit = buttons.find((button) => button.text() === digit);
      expect(buttonDigit?.exists()).toBeTruthy();
    });

    OPERATORS.forEach((operator) => {
      const buttonOperator = buttons.find((button) => button.text() === operator);
      expect(buttonOperator?.exists()).toBeTruthy();
    });

    const extraButtonsText = ["Clear", "Del", "="];
    extraButtonsText.forEach((extraButtonText) => {
      const buttonExtra = buttons.find((button) => button.text() === extraButtonText);
      expect(buttonExtra?.exists()).toBeTruthy();
    });
  });

  it("should initialize with empty text and no error", async () => {
    const wrapper = mount(Calculator);

    expect(wrapper.find("[data-test='text']").text()).toEqual("");
    expect(wrapper.find("[data-test='error']").exists()).toBeFalsy();
  });

  it("Should be able to add digits", async () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");

    const expectedDigits = "123.4567890";
    for (const digit of expectedDigits) {
      const buttonDigit = buttons.find((button) => button.text() === digit);
      await buttonDigit?.trigger("click");
    }

    expect(wrapper.find("[data-test='text']").text()).toEqual(expectedDigits);
  });

  it("Should be able to add one operators only after a digit", async () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");

    for (const operator of OPERATORS) {
      const buttonOperator = buttons.find((button) => button.text() === operator);
      await buttonOperator?.trigger("click");

      expect(wrapper.find("[data-test='text']").text()).toEqual("");
    }

    await addToMemory(wrapper, "5");

    for (const operator of OPERATORS) {
      const buttonOperator = buttons.find((button) => button.text() === operator);
      await buttonOperator?.trigger("click");

      expect(wrapper.find("[data-test='text']").text()).toEqual(`5 ${operator}`);
    }
  });

  it("Should add 0 before the dot when the dot button is clicked without any number before", async () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");

    const buttonDot = buttons.find((button) => button.text() === ".");
    await buttonDot?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("0.");

    await addToMemory(wrapper, "+");
    await buttonDot?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("0. + 0.");
  });

  it("Should clear the text and error when clicked on clear button", async () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");
    const buttonClear = buttons.find((button) => button.text() === "Clear");
    const buttonResult = buttons.find((button) => button.text() === "=");

    await addToMemory(wrapper, "5 + 9");
    await buttonClear?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("");
    expect(wrapper.find("[data-test='error']").exists()).toBeFalsy();

    await addToMemory(wrapper, "5.3.6 + 9"); // invalid expression
    await buttonResult?.trigger("click");

    await buttonClear?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("");
    expect(wrapper.find("[data-test='error']").exists()).toBeFalsy();
  });

  it("Should delete last value in the text when clicked on del button", async () => {
    const wrapper = mount(Calculator);
    const buttonDel = wrapper.findAll("button").find((button) => button.text() === "Del");

    await addToMemory(wrapper, "5 + 9");
    await buttonDel?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("5 +");

    await buttonDel?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("5");

    await buttonDel?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("");

    await buttonDel?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("");
  });

  it("Should set text as the calculated result when clicked on result button with a valid math expression", async () => {
    const wrapper = mount(Calculator);
    const buttonResult = wrapper.findAll("button").find((button) => button.text() === "=");

    await addToMemory(wrapper, "14 - 9");
    await buttonResult?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("5");

    await addToMemory(wrapper, "/ 2");
    await buttonResult?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("2.5");
  });

  it("Should keep the text digit when clicked on result button with a incomplete math expression", async () => {
    const wrapper = mount(Calculator);
    const buttonResult = wrapper.findAll("button").find((button) => button.text() === "=");

    await addToMemory(wrapper, "3 *");
    await buttonResult?.trigger("click");
    expect(wrapper.find("[data-test='text']").text()).toEqual("3");

    buttonResult?.trigger("click");
    expect(wrapper.vm.memory).toEqual("3");
  });

  it("Should display error when clicked on result button with a invalid math expression", async () => {
    const wrapper = mount(Calculator);
    const buttonResult = wrapper.findAll("button").find((button) => button.text() === "=");
    const invalidExpressions = ["5.5.5 + 9", "12 + 9.9.9"];

    for (const invalidExpression of invalidExpressions) {
      await addToMemory(wrapper, invalidExpression);
      await buttonResult?.trigger("click");

      expect(wrapper.find("[data-test='text']").exists()).toBeFalsy();
      expect(wrapper.find("[data-test='error']").text()).toEqual("Invalid expression");
      await clearMemory(wrapper);
    }
  });
});
