<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";

const scroll = ref(0);

let interval: number;

onMounted((): void => {
  interval = window.setInterval(() => {
    scroll.value += 0.35;
  }, 1);
});

onBeforeUnmount((): void => {
  if (interval != null) {
    window.clearInterval(interval);
  }
});
</script>

<template>
  <div class="background-effect" :style="{ '--scroll': `${scroll}px` }"></div>
</template>

<style scoped>

.background-effect {
  --pattern-size: 60px;
  --scroll: 0;

  position: absolute;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(45deg, var(--foreground-bg-color) 25%, transparent 25%), linear-gradient(-45deg, var(--foreground-bg-color) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--foreground-bg-color) 75%), linear-gradient(-45deg, transparent 75%, var(--foreground-bg-color) 75%);
  background-size: var(--pattern-size) var(--pattern-size);
  background-position: 1 0, 0 calc(var(--pattern-size) / 2), calc(var(--pattern-size) / 2) calc(calc(var(--pattern-size) / 2) * -1), calc(calc(var(--pattern-size) / 2) * -1) 0;
  background-position-x: var(--scroll);
  background-position-y: var(--scroll);

  z-index: -1;
}

</style>