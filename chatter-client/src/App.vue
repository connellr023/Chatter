<script setup lang="ts">
import {RouterView} from "vue-router";
import {useUserStore} from "@/stores/userStore";

import NameLabel from "@/components/NameLabel.vue";
import FadeInEffect from "@/components/FadeInEffect.vue";
import BackgroundEffect from "@/components/BackgroundEffect.vue";
import Notifications from "@/components/Notifications.vue";
import stream from "@/lib/stream";


const userStore = useUserStore();

stream.once("connect", (): void => {
  userStore.connected = true;
});

stream.once("disconnect", (): void => {
  userStore.connected = false;
});
</script>

<template>
  <main>
    <FadeInEffect />
    <BackgroundEffect />
    <Notifications />
    <RouterView />
    <NameLabel />
  </main>
</template>