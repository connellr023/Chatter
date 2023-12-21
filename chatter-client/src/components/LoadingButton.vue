<script setup lang="ts">
import {ref} from "vue";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  id: String,
  text: String
});

const frames: string[] = ["—", "\\", "|", "/"];
const frame = ref(frames[frames.length - 2]);

function animate() {
  let i: number = 0;

  const interval = window.setInterval((): void => {
    if (props.isLoading) {
      frame.value = frames[i];

      if (i >= frames.length - 1) {
        i = 0;
      }
      else {
        i++;
      }
    }
    else {
      window.clearInterval(interval);
    }
  }, 200);
}
</script>

<template>
  <button :disabled="isLoading" :id="id" class="regular loading" @click="$emit('pressed'); animate();">
    {{isLoading ? frame : ("&lt;" + text + "&gt;")}}
  </button>
</template>

<style scoped>

button.loading:disabled {
  color: var(--light-text-color);
  transition: none;
}

</style>