<script lang="ts">
  import { onMount } from "svelte";
  import { text } from "svelte/internal";
  import Footer from "../lib/components/footer/Footer.svelte";
  import Header from "../lib/components/header/Header.svelte";
  import getRandomSourceCode from "../lib/functions/getCode";

  import type { LetterInterface } from "../types/interfaces";
  let input: string = "";

  let textArray: LetterInterface[][] = [];

  getRandomSourceCode().then((result) => {
    textArray = result;
  });
  let currentWord: number = 0;
  let cursor: HTMLDivElement;
  let cursorContainer: HTMLDivElement;

  function nextWord() {
    input = "";
    currentWord += 1;
    let letter = textArray[currentWord][0].element;
    let posContainer = cursorContainer.getBoundingClientRect();
    let pos = letter.getBoundingClientRect();
    cursor.style.left = `${pos.left - posContainer.left}px`;
    cursor.style.top = `${letter.offsetTop}px`;
  }

  $: {
    if (textArray.length != 0) {
      console.log(textArray);
      function checkLetter() {
        const word: LetterInterface[] = textArray[currentWord];
        if (word[0].element === undefined) return;
        for (let letter = input.length; letter < word.length; letter++) {
          word[letter].element.classList.remove(
            word[letter].typedCorrectly ? "correct-letter" : "falsy-letter"
          );
          delete word[letter].typedCorrectly;
        }

        if (input === "") return;

        const currentLetter: string = input.slice(-1);
        const index: number = input.length - 1;

        if (currentLetter === " " && index == 0) {
          input = "";
          return;
        }
        if (currentLetter === " " || index == word.length) {
          nextWord();
          return;
        }

        const element = word[index].element;

        if (word[index].letter === currentLetter) {
          word[index].typedCorrectly = true;
          element.classList.add("correct-letter");
        } else {
          word[index].typedCorrectly = false;
          element.classList.add("falsy-letter");
        }
      }

      function setCursor() {
        if (input === "") return;
        let letter = textArray[currentWord][input.length - 1].element;
        if (letter === undefined) return;
        let posContainer = cursorContainer.getBoundingClientRect();
        let pos = letter.getBoundingClientRect();
        cursor.style.left = `${pos.right - posContainer.left}px`;
        cursor.style.top = `${letter.offsetTop}px`;
      }

      function scrollContent() {
        if (cursorContainer === undefined) return;
        let posContainer = cursorContainer.getBoundingClientRect();
        let containerBottom = posContainer.top + cursorContainer.clientHeight;
        let pos = cursor.getBoundingClientRect();

        if (containerBottom <= pos.bottom + pos.height + 5) {
          cursorContainer.scrollTop += pos.height + 5;
        }
      }

      void input;
      checkLetter();
      setCursor();
      scrollContent();
    }
  }
</script>

<main class="flex flex-col h-screen w-full justify-between">
  <div class="h-2/12">
    <Header />
  </div>
  <div
    class="h-8/12 overflow-y-scroll pointer-events-none flex flex-col items-center justify-start"
  >
    <input
      bind:value={input}
      id="input"
      autofocus
      on:blur={(e) => {
        let element = e.currentTarget;
        setTimeout(() => element.focus(), 0);
      }}
    />
    <div
      class="flex my-2 flex-wrap overflow-y-scroll scrollbar-hide relative w-9/12"
      bind:this={cursorContainer}
    >
      <div class="absolute cursor" bind:this={cursor} />
      {#if textArray.length == 0}
        <p>Bitte gedulden Sie sich, der text wird geladen...</p>
      {:else}
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
      {/if}
    </div>
  </div>
  <div class="h-2/12">
    <Footer />
  </div>
</main>

<style>
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }

  .scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .cursor {
    height: calc(25px + 1vw);
    margin-top: 2.5px;
    width: 3px;
    background-color: rgb(235, 234, 186);
    animation: blink 1s linear infinite;
    transition: top 60ms, left 60ms;
  }

  input {
    background-color: transparent;
    outline: none;
    width: 0px;
    height: 0px;
  }
  .letter {
    opacity: 0.4;
    padding-right: 1px;
    line-height: calc(30px + 1vw);
  }

  .word {
    margin: 0px 10px;
  }
</style>
