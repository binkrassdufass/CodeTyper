<script lang="ts">
  import Site from "./Site.svelte";

  let sites: Array<string> = ["Impressum", "Datenschuterklärung"];
</script>

<main class="flex justify-around">
  {#each sites as site (site)}
    <Site {site} />
  {/each}
</main>

<style>
  main {
    background-color: var(--second-color);
    padding: 1vw;
    font-size: 20px;
  }
</style>
