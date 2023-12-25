<script setup lang="ts">
import {onMounted, ref} from "vue";

const hideYet = ref(false);
const disableYet = ref(false);

onMounted((): void => {
  window.setTimeout((): void => {
    hideYet.value = true;

    window.setTimeout((): void => {
      disableYet.value = true;
    }, 400);
  }, 100);
});
</script>

<template>
  <div id="overlay" :class="{'hide': hideYet, 'disable': disableYet}"></div>
</template>

<style scoped>

div#overlay {
  background-color: var(--main-bg-color);
  position: absolute;
  width: 100vw;
  height: 100vh;
  opacity: 1;
  transition: opacity 0.35s ease-in-out;
  z-index: 5;
}

.hide {
  opacity: 0 !important;
}

.disable {
  display: none;
}

</style>