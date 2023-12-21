<script setup lang="ts">
import {RouterView} from "vue-router";
import {useUserStore} from "@/stores/userStore";

import NameLabel from "@/components/NameLabel.vue";
import FadeIn from "@/components/FadeIn.vue";
import BackgroundEffect from "@/components/BackgroundEffect.vue";
import socket from "@/socket";

const userStore = useUserStore();

socket.once("connect", (): void => {
  userStore.connected = true;
});

socket.once("disconnect", (): void => {
  userStore.connected = false;
});
</script>

<template>
  <main>
    <FadeIn />
    <BackgroundEffect />
    <RouterView />
    <NameLabel />
  </main>
</template>