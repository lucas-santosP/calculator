const EVENT_NAME = "keydown";

export function useKeyboard() {
  const listeners = [] as ((e: KeyboardEvent) => void)[];

  function addListener(callback: (e: KeyboardEvent) => void): number {
    const listenerIndex = listeners.length;
    const listener = (e: KeyboardEvent) => {
      callback(e);
    };

    listeners.push(listener);
    window.addEventListener(EVENT_NAME, listener);
    return listenerIndex;
  }

  function removeListener(listenerIndex: number) {
    if (!listeners[listenerIndex]) return;

    window.removeEventListener(EVENT_NAME, listeners[listenerIndex]);
    listeners.splice(listenerIndex, 1);
  }

  function removeAllListeners() {
    listeners.forEach((listener) => {
      window.removeEventListener(EVENT_NAME, listener);
    });
  }

  return { addListener, removeListener, removeAllListeners };
}
