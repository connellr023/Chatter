<script setup lang="ts">
import { RouterView } from "vue-router";
import NameLabel from "@/components/NameLabel.vue";
import FadeIn from "@/components/FadeIn.vue";
import BackgroundEffect from "@/components/BackgroundEffect.vue";
</script>

<template>
  <main>
    <FadeIn />
    <BackgroundEffect />
    <RouterView />
    <NameLabel />
  </main>
</template>