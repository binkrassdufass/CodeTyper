<script lang="ts">
  import Footer from "../lib/components/footer/Footer.svelte";
  import Header from "../lib/components/header/Header.svelte";
  import { navigate } from "svelte-routing";
  import { countdown, wpm, counter } from "../lib/stores/stores";
  import { resetEverything } from "../lib/functions/resetEverything";
</script>

<div class="h-screen flex flex-col w-full">
  <Header />
  <main class="grow flex flex-col justify-center items-center">
    <button
      on:click={() => {
        resetEverything();
        navigate("/game");
      }}>Play</button
    >
    {#if $wpm !== "0"}
      <div class="flex flex-col pl-8 mt-3">
        <div class="flex justify-between ">
          Time: <div class="px-8">{countdown.defaultValue}s</div>
        </div>
        <div class="flex justify-between">
          WPM: <div class="px-8">{$wpm}</div>
        </div>
      </div>
    {/if}
  </main>
  <Footer />
</div>
