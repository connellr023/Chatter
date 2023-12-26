<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {useAnimate} from "@/hooks/useAnimate";

const shouldContinue = ref(true);
const frames = ["0", "1"];

const {frame, animate} = useAnimate(frames, shouldContinue, 400);

onMounted((): void => {
  shouldContinue.value = true;
  animate();
});

onUnmounted((): void => {
  shouldContinue.value = false;
});
</script>

<template>
  <div id="start-connect-title">Welcome back<span id="blink" :style="`opacity: ${frame}`">_</span></div>
</template>

<style scoped lang="scss">

div#start-connect-title {
  font-weight: bolder;
  font-size: 30px;
  margin-bottom: 10px;
  user-select: none;

  span#blink {
    margin-left: 3px;
  }
}

</style>