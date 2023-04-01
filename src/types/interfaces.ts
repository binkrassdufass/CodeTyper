export interface LetterInterface {
  letter: string;
  element?: HTMLElement;
  typedCorrectly?: boolean;
}

interface FilterOptions {
  name: string;
  selected: boolean;
}

interface FilterSub {
  selected: boolean;
  options: Array<FilterOptions>;
}

export interface Filter {
  time: FilterSub;
  words: FilterSub;
  custom: FilterSub;
}
