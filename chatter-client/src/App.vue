<script setup lang="ts">
import {RouterView} from "vue-router";

import NameLabel from "@/components/NameLabel.vue";
import FadeInEffect from "@/components/FadeInEffect.vue";
import Notifications from "@/components/Notifications.vue";
</script>

<template>
  <main>
    <FadeInEffect />
    <Notifications />
    <RouterView />
  </main>
</template>