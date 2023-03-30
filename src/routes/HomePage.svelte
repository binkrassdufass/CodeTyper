<script>
  import Footer from "../lib/components/footer/Footer.svelte";
  import Header from "../lib/components/header/Header.svelte";
  import { navigate } from "svelte-routing";
</script>

<div class="h-screen flex flex-col w-full">
  <Header />
  <main class="grow flex justify-center items-center">
    <button on:click={() => navigate("/game")}>Play</button>
  </main>
  <Footer />
</div>
