<script setup lang="ts">

import {onBeforeUnmount, onMounted, type Ref, ref} from "vue";

const scroll = ref(0);
let interval: number;

onMounted(() => {
  interval = window.setInterval(() => {
    scroll.value += 0.35;
  }, 1);
});

onBeforeUnmount(() => {
  if (interval != null) {
    window.clearInterval(interval);
  }
});

</script>

<template>
  <div id="start-view-wrapper" class="background-effect" :style="{'--scroll': `${scroll}px`}">
    <div id="start-connect-window">
      <img id="start-connect-logo" alt="Chatter logo" src="../assets/logo_white.png" />
    </div>
  </div>
</template>

<style scoped>

.background-effect {
  --pattern-size: 60px;
  --scroll: 0;

  width: 100vw;
  height: 100vh;
  image-rendering: high-quality;
  background-image: linear-gradient(45deg, var(--foreground-bg-color) 25%, transparent 25%), linear-gradient(-45deg, var(--foreground-bg-color) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--foreground-bg-color) 75%), linear-gradient(-45deg, transparent 75%, var(--foreground-bg-color) 75%);
  background-size: var(--pattern-size) var(--pattern-size);
  background-position: 1 0, 0 calc(var(--pattern-size) / 2), calc(var(--pattern-size) / 2) calc(calc(var(--pattern-size) / 2) * -1), calc(calc(var(--pattern-size) / 2) * -1) 0;
  background-position-x: var(--scroll);
  background-position-y: var(--scroll);
  transition: background-position 2s ease;
}

div#start-connect-window {
  background-color: var(--modal-bg-color);
  padding: 12px;
  position: absolute;
  width: fit-content;
  height: fit-content;
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
}

img#start-connect-logo {
  width: 150px;
}

</style>