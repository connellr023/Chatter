<script setup lang="ts">
import { RouterView } from "vue-router";
import NameLabel from "@/components/NameLabel.vue";
import FadeIn from "@/components/FadeIn.vue";
</script>

<template>
  <FadeIn />
  <div class="wrapper">
    <RouterView />
    <NameLabel />
  </div>
</template>