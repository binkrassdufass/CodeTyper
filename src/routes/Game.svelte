<script lang="ts">
  import Filter from "../lib/components/filter/Filter.svelte";
  import Footer from "../lib/components/footer/Footer.svelte";
  import Header from "../lib/components/header/Header.svelte";
  import LifeStats from "../lib/components/stats/LifeStats.svelte";
  import getRandomSourceCode from "../lib/functions/getCode";
  import type { LetterInterface } from "../types/interfaces";
  import { countdown, counter } from "../lib/stores/stores";
  import { navigate } from "svelte-routing";

  let input = "";
  let inputElement: HTMLTextAreaElement;
  let textArray: LetterInterface[][][] = [];

  let currentWord = 0;
  let currentLine = 0;
  let cursor: HTMLDivElement;
  let cursorContainer: HTMLDivElement;
  let resetText = false;

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
        if (isCorrect) counter.sub();
        word[letter].element.classList.remove(
          isCorrect ? "correct-letter" : "falsy-letter"
        );
        delete word[letter].typedCorrectly;
      }

      if (input === "") return;

      countdown.start();

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
        counter.add();
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

  $: {
    if ($countdown <= 0) {
      navigate("/");
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
  <div>
    <Header />

    <div class="flex justify-center">
      <LifeStats />
    </div>
  </div>
  <button
    on:click={() => inputElement.focus()}
    class=" writing-part overflow-y-scroll flex flex-col items-center justify-start"
  >
    <textarea
      bind:this={inputElement}
      bind:value={input}
      id="input"
      autofocus
      on:blur={(e) => {
        let element = e.currentTarget;
        setTimeout(() => element.focus(), 0);
      }}
    />

    <div
      class="flex flex-col my-2  overflow-y-hidden  scrollbar-hide relative w-11/12"
      bind:this={cursorContainer}
    >
      <div class="absolute cursor" bind:this={cursor} />

      {#if textArray.length == 0 || resetText}
        <p>Bitte gedulden Sie sich, der text wird geladen...</p>
      {:else}
        {#each textArray as line, i (i)}
          <div class="flex  flex-wrap">
            {#each line as word, wi (wi)}
              <div class="word flex flex-wrap ">
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
  </button>
  <div>
    <div class="w-full flex justify-center items-center">
      <Filter
        on:reset={() => {
          resetText = true;
          getRandomSourceCode().then((result) => {
            textArray = result;
            resetText = false;
          });
        }}
      />
    </div>
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

  .writing-part {
    cursor: default;
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
