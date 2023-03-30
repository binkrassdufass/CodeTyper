<script lang="ts">
  import Footer from "../lib/components/footer/Footer.svelte";
  import Header from "../lib/components/header/Header.svelte";
  import { createText } from "../lib/functions/createText";
  import type { LetterInterface } from "../types/interfaces";
  let input: string = "";
  let text: string =
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
  let textArray: LetterInterface[][] = createText(text);
  console.log(textArray[0][0]);
  let currentWord: number = 0;

  function nextWord() {
    input = "";

    currentWord += 1;
  }

  $: {
    function checkLetter(input: string) {
      if (input === "") return;
      let currentLetter: string = input.slice(-1);
      let index: number = input.length - 1;
      let word: LetterInterface[] = textArray[currentWord];
      if (currentLetter === " " || index == word.length) {
        nextWord();
        return;
      }
      let element = textArray[currentWord][index].element;
      if (word[index].letter === currentLetter) {
        word[index].typedCorrectly = true;
        element.classList.add("correct-letter");
      } else {
        word[index].typedCorrectly = false;
        element.classList.add("falsy-letter");
      }
    }
    checkLetter(input);
  }
</script>

<main class="flex flex-col h-screen w-full justify-between">
  <Header />
  <div class="grow flex flex-col items-center justify-center">
    <input
      bind:value={input}
      autofocus
      on:blur={(e) => {
        let element = e.currentTarget;
        setTimeout(() => element.focus(), 0);
      }}
    />
    <div class="flex flex-wrap w-9/12">
      {#each textArray as word, wi (wi)}
        <div class="word flex">
          {#each word as letter, li (`${letter}${li}`)}
            <div
              class="letter"
              id={`${wi}-${li}`}
              bind:this={textArray[wi][li].element}
            >
              {letter.letter}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <Footer />
</main>

<style>
  .input {
    background-color: transparent;
    outline: none;
    width: 0px;
  }
  .letter {
    opacity: 0.4;
  }

  .word {
    margin: 10px 5px;
  }
</style>
