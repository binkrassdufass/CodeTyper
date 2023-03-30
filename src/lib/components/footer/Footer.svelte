<script lang="ts">
  import Mode from "./Mode.svelte";

  let modes: Array<string> = ["time", "words"];
</script>

<main class="flex justify-around">
  {#each modes as mode (mode)}
    <Mode {mode} />
  {/each}
</main>

<style>
  main {
    background-color: var(--second-color);
    padding: 2vw;
  }
</style>
