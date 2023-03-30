import type { LetterInterface } from "../../types/interfaces";
export let createText = (text: string): LetterInterface[][] => {
  let result: LetterInterface[][] = [];
  let words: string[] = text.split(" ");
  words.forEach((word) => {
    let wordStorage: LetterInterface[] = [];
    for (let letter = 0; letter < word.length; letter++) {
      let letterObj: LetterInterface = {
        letter: word[letter],
      };
      wordStorage.push(letterObj);
    }
    result.push(wordStorage);
  });
  return result;
};
