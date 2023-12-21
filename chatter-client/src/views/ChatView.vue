<script setup lang="ts">
import {useUserStore} from "@/stores/userStore";
import {onMounted} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const userStore = useUserStore();

onMounted((): void => {
  // if (!userStore.getUserState.connected) {
  //   router.push({name: "error", params: {code: "405", "message": "Not Allowed"}});
  // }
});
</script>

<template>
  <main>
    <div>chat view</div>
  </main>
</template>

<style scoped>

</style>