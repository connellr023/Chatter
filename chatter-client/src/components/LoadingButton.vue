<script setup lang="ts">
import {ref, watch} from "vue";
import {useAnimate} from "@/hooks/useAnimate";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  id: String,
  classes: String,
  text: String
});

const shouldContinue = ref(props.isLoading);
const frames: string[] = ["•", "••", "•••", "••••", "•••••", "••••", "•••", "••"];

watch((): boolean => props.isLoading, (value: boolean): void => {
  shouldContinue.value = value;
});

const {frame, animate} = useAnimate(frames, shouldContinue, 250);
</script>

<template>
  <button :disabled="isLoading" :id="id" :class="classes" class="regular loading" @click="$emit('pressed'); animate()">
    {{isLoading ? frame : text}}
  </button>
</template>