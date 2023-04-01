import { countdown, counter, wpm } from "../stores/stores";

export function resetEverything() {
  wpm.set("0");
  counter.reset();
  countdown.reset();
}
