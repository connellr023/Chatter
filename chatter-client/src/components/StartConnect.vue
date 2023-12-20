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
  <div id="start-view-wrapper" class="background-effect" :style="{ '--scroll': `${scroll}px` }">
    <div id="start-connect-window">
      <div id="start-connect-title">Welcome to <i>Chatter</i>,</div>
      <div class="regular">Please enter a username below</div>
      <input id="username-input" class="regular" placeholder="<username>" />
      <button id="connect-button" class="regular">&lt;connect&gt;</button>
    </div>
  </div>
</template>

<style scoped>

div#start-connect-window {
  background-color: var(--modal-bg-color);
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 4px 14px 0 rgba(0, 0, 0, 0.8);
  padding: 12px 50px;
  position: absolute;
  width: fit-content;
  height: fit-content;
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

div#start-connect-title, div#start-connect-title i {
  color: var(--dark-text-color);
  font-weight: bolder;
  font-size: 23px;
  margin-bottom: 10px;
}

input#username-input {
  margin-bottom: 15px;
  margin-top: 17px;
  width: 90%;
}

button#connect-button {
  width: calc(90% + 12px);
  margin-bottom: 7px;
}

button#connect-button:hover {
  color: #13ba58;
}

.background-effect {
  --pattern-size: 60px;
  --scroll: 0;

  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(45deg, var(--foreground-bg-color) 25%, transparent 25%), linear-gradient(-45deg, var(--foreground-bg-color) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--foreground-bg-color) 75%), linear-gradient(-45deg, transparent 75%, var(--foreground-bg-color) 75%);
  background-size: var(--pattern-size) var(--pattern-size);
  background-position: 1 0, 0 calc(var(--pattern-size) / 2), calc(var(--pattern-size) / 2) calc(calc(var(--pattern-size) / 2) * -1), calc(calc(var(--pattern-size) / 2) * -1) 0;
  background-position-x: var(--scroll);
  background-position-y: var(--scroll);
}

</style>