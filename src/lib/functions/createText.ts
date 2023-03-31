import type { LetterInterface } from "../../types/interfaces";

export const createText = (lines: string[]): LetterInterface[][][] => {
  const result: LetterInterface[][][] = [];

  lines.forEach((line) => {
    const lineStorage: LetterInterface[][] = [];
    const words: string[] = line.split(" ");

    words.forEach((word) => {
      const wordStorage: LetterInterface[] = [];

      for (let letter = 0; letter < word.length; letter++) {
        const letterObj: LetterInterface = { letter: word[letter] };
        wordStorage.push(letterObj);
      }

      if (wordStorage.length > 0) {
        lineStorage.push(wordStorage);
      }
    });

    if (lineStorage.length > 0) {
      result.push(lineStorage);
    }
  });

  return result.filter(
    (line) => line.length > 0 && line.some((word) => word.length > 1)
  );
};
