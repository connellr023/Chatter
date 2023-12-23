<script setup lang="ts">
import {ref, watch} from "vue";
import {useAnimate} from "@/hooks/useAnimate";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  id: String,
  text: String
});

const shouldContinue = ref(props.isLoading);
const frames: string[] = ["—", "\\", "|", "/"];

watch((): boolean => props.isLoading, (value: boolean): void => {
  shouldContinue.value = value;
});

const {frame, animate} = useAnimate(frames, shouldContinue, 200);
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