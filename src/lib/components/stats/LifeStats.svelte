<script lang="ts">
  import { countdown, counter, wpm } from "../../stores/stores";
  $: {
    let words = $counter / 5;
    let timeInMin = (countdown.defaultValue - $countdown) / 60;
    $wpm = (words / timeInMin).toFixed(1);
    if ($wpm == "NaN") $wpm = "0";
  }
</script>

<div class="w-11/12 stats justify-around flex">
  <div>
    Countdown: {$countdown}s
  </div>
  <div>
    WPM: {$wpm}
  </div>
</div>

<style>
  .stats {
    background-color: black;
    opacity: 0.3;
    margin: 5vh 0;
    border-radius: 15px;
  }
</style>
