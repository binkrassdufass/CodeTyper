<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import HomePage from "./routes/HomePage.svelte";
  import Game from "./routes/Game.svelte";
</script>

<main>
  <Router>
    <Route path="/">
      <HomePage />
    </Route>
    <Route path="/game">
      <Game />
    </Route>
  </Router>
</main>

<style>
  @import "./tailwind.css";
</style>
