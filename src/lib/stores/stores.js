import { writable } from "svelte/store";

function createCountdown() {
  let intervalId;
  let defaultValue = 60;
  let isActive = false;
  let { subscribe, update, set } = writable(defaultValue);
  return {
    subscribe,
    start: () => {
      if (isActive) return;
      intervalId = setInterval(() => {
        update((t) => parseFloat((t - 0.1).toFixed(1)));
      }, 100);
      isActive = true;
    },
    stop: () => {
      isActive = false;
      clearInterval(intervalId);
    },
    reset: () => {
      isActive = false;
      clearInterval(intervalId);
      set(defaultValue);
    },
    newDefault: (def) => {
      isActive = false;
      defaultValue = def;
      set(def);
      clearInterval(intervalId);
    },
    isActive,
    defaultValue,
  };
}

export let countdown = createCountdown();

function createCounter() {
  let { subscribe, set, update } = writable(0);
  return {
    subscribe,
    reset: () => set(0),
    add: () => update((o) => o + 1),
    sub: () => update((o) => o - 1),
  };
}

export let counter = createCounter(0);

export let wpm = writable("0");
