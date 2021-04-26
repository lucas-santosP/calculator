import { useKeyboard } from "../../../src/compositions/useKeyboard";

function pressKeyOnWindow(key: string) {
  const event = new KeyboardEvent("keydown", { key });
  window.dispatchEvent(event);
}

describe("useKeyboard", () => {
  it("should add a event listener to the windows", () => {
    const keyboard = useKeyboard();
    let expectedValue = false;
    const keyToPress = "5";

    keyboard.addListener((e) => {
      if (e.key === keyToPress) expectedValue = true;
    });
    pressKeyOnWindow(keyToPress);
    expect(expectedValue).toEqual(true);
  });

  it("should ignore invalid index received to remove a listener", () => {
    const keyboard = useKeyboard();
    let expectedValue = false;

    keyboard.addListener((e) => {
      if (e.key === "1") expectedValue = true;
    });

    keyboard.removeListener(-1);
    keyboard.removeListener(500);
    keyboard.removeListener(1);
    pressKeyOnWindow("1");
    expect(expectedValue).toEqual(true);
  });

  it("should remove the event listener based on the index received", () => {
    const keyboard = useKeyboard();
    const firstListener = {
      expectedValue: 0,
      index: -1,
    };
    const secondListener = {
      expectedValue: 0,
      index: -1,
    };

    firstListener.index = keyboard.addListener((e) => {
      if (e.key === "1") firstListener.expectedValue++;
    });
    secondListener.index = keyboard.addListener((e) => {
      if (e.key === "2") secondListener.expectedValue--;
    });

    pressKeyOnWindow("1");
    pressKeyOnWindow("2");
    expect(firstListener.expectedValue).toEqual(1);
    expect(secondListener.expectedValue).toEqual(-1);

    keyboard.removeListener(firstListener.index);
    pressKeyOnWindow("1");
    pressKeyOnWindow("2");
    expect(firstListener.expectedValue).toEqual(1);
    expect(secondListener.expectedValue).toEqual(-2);
  });

  it("should remove all event listener", () => {
    const keyboard = useKeyboard();
    let firstListenerExpectedValue = 0;
    let secondListenerExpectedValue = 0;

    keyboard.addListener((e) => {
      if (e.key === "1") firstListenerExpectedValue++;
    });
    keyboard.addListener((e) => {
      if (e.key === "2") secondListenerExpectedValue--;
    });

    pressKeyOnWindow("1");
    pressKeyOnWindow("2");
    expect(firstListenerExpectedValue).toEqual(1);
    expect(secondListenerExpectedValue).toEqual(-1);

    keyboard.removeAllListeners();
    pressKeyOnWindow("1");
    pressKeyOnWindow("2");
    expect(firstListenerExpectedValue).toEqual(1);
    expect(secondListenerExpectedValue).toEqual(-1);
  });
});
