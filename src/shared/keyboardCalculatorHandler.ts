type EventName = "pressDigit" | "pressOperator" | "pressResult" | "pressClear" | "pressErase";

type CallbackEvent = {
  [K in EventName]: (key: string) => void;
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "."];
const OPERATORS = ["/", "*", "+", "-"];
const RESULT_KEYS = ["=", "Enter"];
const CLEAR_KEYS = ["Escape"];
const ERASE_KEYS = ["Backspace"];

export default class KeyboardCalculatorHandler {
  events = {
    pressDigit: () => console.warn("PressDigit callback was not defined"),
    pressOperator: () => console.warn("PressOperator callback was not defined"),
    pressResult: () => console.warn("PressResult callback was not defined"),
    pressClear: () => console.warn("PressClear callback was not defined"),
    pressErase: () => console.warn("PressErase callback was not defined"),
  } as CallbackEvent;

  constructor() {
    if (!window || !window?.addEventListener) throw new Error("Windows element not found");

    window.addEventListener("keydown", (e) => {
      for (const digit of DIGITS) {
        if (e.key === `${digit}`) {
          this.events.pressDigit(e.key);
          return;
        }
      }

      for (const operator of OPERATORS) {
        if (e.key === operator) {
          this.events.pressOperator(e.key);
          return;
        }
      }

      if (RESULT_KEYS.includes(e.key)) this.events.pressResult(e.key);
      else if (CLEAR_KEYS.includes(e.key)) this.events.pressClear(e.key);
      else if (ERASE_KEYS.includes(e.key)) this.events.pressErase(e.key);
    });
  }

  on(event: EventName, callback: (key: string) => unknown) {
    this.events[event] = (key) => callback(key);
  }
}
