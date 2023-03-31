<script lang="ts">
  import { onMount } from "svelte";
  import { text } from "svelte/internal";
  import Footer from "../lib/components/footer/Footer.svelte";
  import Header from "../lib/components/header/Header.svelte";
  import getRandomSourceCode from "../lib/functions/getCode";
  import type { LetterInterface } from "../types/interfaces";

  let input = "";
  let textArray: LetterInterface[][][] = [];

  let currentWord = 0;
  let currentLine = 0;
  let cursor: HTMLDivElement;
  let cursorContainer: HTMLDivElement;

  getRandomSourceCode().then((result) => {
    textArray = result;
  });

  function nextWord() {
    input = "";
    currentWord++;
    if (currentWord == textArray[currentLine].length) {
      currentWord = 0;
      currentLine++;
    }
    let letter = textArray[currentLine][currentWord][0].element;
    let posContainer = cursorContainer.getBoundingClientRect();
    let pos = letter.getBoundingClientRect();
    cursor.style.left = `${pos.left - posContainer.left}px`;
    cursor.style.top = `${letter.offsetTop}px`;
  }

  $: {
    function checkLetter() {
      if (textArray.length === 0) return;

      const word = textArray[currentLine][currentWord];
      if (!word || !word[0]?.element) return;

      for (let letter = input.length; letter < word.length; letter++) {
        const isCorrect = word[letter].typedCorrectly;
        word[letter].element.classList.remove(
          isCorrect ? "correct-letter" : "falsy-letter"
        );
        delete word[letter].typedCorrectly;
      }

      if (input === "") return;

      const currentLetter = input.slice(-1);
      const index = input.length - 1;

      if (currentLetter === " " && index === 0) {
        input = "";
        return;
      }

      if (currentLetter === " " || index === word.length) {
        nextWord();
        return;
      }

      const element = word[index].element;

      if (
        word[index].letter === currentLetter ||
        (word[index].letter == "↵" && currentLetter == "\n")
      ) {
        word[index].typedCorrectly = true;
        element.classList.add("correct-letter");
      } else {
        word[index].typedCorrectly = false;
        element.classList.add("falsy-letter");
      }

      if (
        word.length - 1 == index &&
        textArray[currentLine].length - 1 == currentWord
      ) {
        nextWord();
        return;
      }
    }

    function setCursor() {
      if (input === "" || textArray.length === 0) return;

      const letter =
        textArray[currentLine][currentWord][input.length - 1]?.element;
      if (!letter) return;

      const posContainer = cursorContainer.getBoundingClientRect();
      const pos = letter.getBoundingClientRect();

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

    if (textArray.length != 0) {
      void input;
      checkLetter();
      setCursor();
      scrollContent();
    }
  }
</script>

<div
  class="flex flex-col h-screen w-full justify-between"
  on:focus={() => {
    let input = document.getElementById("input");
    input.focus();
  }}
>
  <div class="h-2/12">
    <Header />
  </div>
  <div
    class="h-8/12 overflow-y-scroll pointer-events-none flex flex-col items-center justify-start"
  >
    <textarea
      bind:value={input}
      id="input"
      autofocus
      on:blur={(e) => {
        let element = e.currentTarget;
        setTimeout(() => element.focus(), 0);
      }}
    />
    <div
      class="flex flex-col my-2 overflow-y-hidden scrollbar-hide relative w-11/12"
      bind:this={cursorContainer}
    >
      <div class="absolute cursor" bind:this={cursor} />

      {#if textArray.length == 0}
        <p>Bitte gedulden Sie sich, der text wird geladen...</p>
      {:else}
        {#each textArray as line, i (i)}
          <div class="flex flex-wrap">
            {#each line as word, wi (wi)}
              <div class="word flex">
                {#each word as letter, li (`${letter}${li}`)}
                  <div
                    class="letter"
                    id={`${wi}-${li}`}
                    bind:this={textArray[i][wi][li].element}
                  >
                    {letter.letter}
                  </div>
                {/each}
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
</div>

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

  textarea {
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
