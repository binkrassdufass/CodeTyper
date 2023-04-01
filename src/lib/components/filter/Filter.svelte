<script lang="ts">
  import { menu } from "../../data/menu";
  import { resetEverything } from "../../functions/resetEverything";
  import { countdown } from "../../stores/stores";
  import { createEventDispatcher } from "svelte";

  let dispatcher = createEventDispatcher();

  function resetText() {
    dispatcher("reset");
  }
  function selectOption(filter: string) {
    resetText();
    resetEverything();
    Object.keys(menu).forEach((e) => {
      if (e == filter) {
        menu[filter].selected = true;
        return;
      }
      menu[e].selected = false;
    });
  }

  function selectSubOption(filter: string, subFilter: string) {
    resetText();
    resetEverything();
    menu[filter].options.forEach((e, i) => {
      if (e.name == subFilter) {
        menu[filter].options[i].selected = true;
        if (filter == "time") countdown.newDefault(parseInt(e.name));
        return;
      }
      menu[filter].options[i].selected = false;
    });
  }
</script>

<div class="flex p-2 w-11/12 justify-around menu">
  {#each Object.keys(menu) as filter, i (i)}
    <button
      class="menu-select-btn"
      on:click={() => selectOption(filter)}
      class:selected={menu[filter].selected}>{filter}</button
    >
  {/each}

  <div class="seperate" />

  {#each Object.entries(menu) as option, i (option)}
    {#if option[1].selected}
      {#each option[1].options as optionObj, i (optionObj)}
        <button
          on:click={() => selectSubOption(option[0], optionObj.name)}
          class:selected={optionObj.selected}>{optionObj.name}</button
        >
      {/each}
    {/if}
  {/each}
</div>

<style>
  .seperate {
    border: 1px solid rgba(172, 166, 166, 0.247);
  }
  .menu {
    background-color: rgb(0, 0, 0);
    margin: 5vh 0;
    border-radius: 15px;
    font-size: 20px;
    opacity: 0.3;
  }
  .selected {
    color: green;
  }
  .menu-select-btn {
    transition: color 250ms;
  }
  .menu-select-btn:hover {
    text-decoration: underline;
    color: rgb(14, 116, 233);
  }
</style>
