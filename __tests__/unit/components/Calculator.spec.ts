import { shallowMount, mount } from "@vue/test-utils";
import Calculator from "../../../src/components/Calculator.vue";
import Screen from "../../../src/components/Screen.vue";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const OPERATORS = ["/", "*", "+", "-"];

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

  it("Should be able to add digits in the memory ", () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");

    // each digit
    DIGITS.forEach((digit) => {
      const buttonDigit = buttons.find((button) => button.text() === digit);
      buttonDigit?.trigger("click");

      if (digit === ".") {
        expect(wrapper.vm.memory).toEqual("0.");
      } else {
        expect(wrapper.vm.memory).toEqual(digit);
      }
      wrapper.vm.memory = "";
    });

    // multiples digit
    const expectedDigits = "123.4567890";
    expectedDigits.split("").forEach((digit) => {
      const buttonDigit = buttons.find((button) => button.text() === digit);
      buttonDigit?.trigger("click");
    });

    expect(wrapper.vm.memory).toEqual(expectedDigits);
  });

  it("Should be able to add operators in the memory only after a digit", () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");
    wrapper.vm.memory = "";

    OPERATORS.forEach((operator) => {
      const buttonOperator = buttons.find((button) => button.text() === operator);
      buttonOperator?.trigger("click");

      expect(wrapper.vm.memory).toEqual("");
    });

    wrapper.vm.memory = "5";

    OPERATORS.forEach((operator) => {
      const buttonOperator = buttons.find((button) => button.text() === operator);
      buttonOperator?.trigger("click");

      expect(wrapper.vm.memory).toEqual(`5 ${operator} `);
    });
  });

  it("Should add 0 before the dot when the dot button is clicked without any number before", () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");
    wrapper.vm.memory = "";

    const buttonDot = buttons.find((button) => button.text() === ".");
    buttonDot?.trigger("click");
    expect(wrapper.vm.memory).toEqual("0.");

    const buttonPlus = buttons.find((button) => button.text() === "+");
    buttonPlus?.trigger("click");
    buttonDot?.trigger("click");

    expect(wrapper.vm.memory).toEqual("0. + 0.");
  });

  it("Should clear the memory and error when clicked on clear button", () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");
    wrapper.vm.memory = "5 + 9";
    wrapper.vm.error = true;

    const buttonClear = buttons.find((button) => button.text() === "Clear");
    buttonClear?.trigger("click");

    expect(wrapper.vm.memory).toEqual("");
    expect(wrapper.vm.error).toBeFalsy();
  });

  it("Should delete last digit or operator in memory when clicked on del button", () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");
    wrapper.vm.memory = "5 + 9";

    const buttonDel = buttons.find((button) => button.text() === "Del");
    buttonDel?.trigger("click");
    expect(wrapper.vm.memory).toEqual("5 + ");

    buttonDel?.trigger("click");
    expect(wrapper.vm.memory).toEqual("5");

    buttonDel?.trigger("click");
    expect(wrapper.vm.memory).toEqual("");

    buttonDel?.trigger("click");
    expect(wrapper.vm.memory).toEqual("");
  });

  it("Should set memory as the calculated result when clicked on result button with a valid math expression in memory", () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");
    wrapper.vm.memory = "5 + 9";

    const buttonResult = buttons.find((button) => button.text() === "=");
    buttonResult?.trigger("click");

    expect(wrapper.vm.memory).toEqual("14");
  });

  it("Should keep the memory digit when clicked on result button with a incomplete math expression in memory", () => {
    const wrapper = mount(Calculator);
    wrapper.vm.memory = "5 + ";
    const buttonResult = wrapper.findAll("button").find((button) => button.text() === "=");

    buttonResult?.trigger("click");
    expect(wrapper.vm.memory).toEqual("5");

    wrapper.vm.memory = "9";
    buttonResult?.trigger("click");
    expect(wrapper.vm.memory).toEqual("9");
  });

  it("Should set error to true and clear the memory when clicked on result button with a invalid math expression in memory", () => {
    const wrapper = mount(Calculator);
    const buttons = wrapper.findAll("button");
    const buttonResult = buttons.find((button) => button.text() === "=");
    const invalidExpressions = ["5.5.5 + 9", "asd asdasd", "+++---/"];

    invalidExpressions.forEach((invalidExpression) => {
      wrapper.vm.memory = invalidExpression;
      buttonResult?.trigger("click");

      expect(wrapper.vm.memory).toEqual("");
      expect(wrapper.vm.error).toBeTruthy();
      wrapper.vm.clear();
    });
  });
});
