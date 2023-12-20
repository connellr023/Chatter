<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();

function navigateToChat() {
  router.push("/chat");
}

</script>

<template>
  <button id="connect-button" class="regular" @click="navigateToChat">&lt;connect&gt;</button>
</template>

<style scoped>

button#connect-button {
  width: calc(90% + 12px);
  margin-bottom: 7px;
}

button#connect-button:hover {
  color: #13ba58;
}

</style>