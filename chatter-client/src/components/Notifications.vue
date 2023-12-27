<script setup lang="ts">
import {useNotifications} from "@/hooks/useNotifications";

const {notifications} = useNotifications();
</script>

<template>
  <div id="notifications-container">
    <div v-for="notification in [...notifications]" class="notification-element" @click="notification.clear()">
      <div class="notification-alert"><span>&excl;</span></div>
      <div class="notification-body">{{notification.body}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/scoped/notifications";
</style>