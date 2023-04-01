import type { Filter } from "../../types/interfaces";

export const menu: Filter = {
  time: {
    selected: true,
    options: [
      {
        name: "30",
        selected: false,
      },
      {
        name: "60",
        selected: true,
      },
    ],
  },
  words: {
    selected: false,
    options: [
      {
        name: "100",
        selected: true,
      },
      {
        name: "200",
        selected: false,
      },
    ],
  },
  custom: {
    selected: false,
    options: [
      {
        name: "customidk",
        selected: true,
      },
    ],
  },
};
