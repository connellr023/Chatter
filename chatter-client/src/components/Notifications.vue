<script setup lang="ts">
import {useNotifications} from "@/hooks/useNotifications";

const {notifications} = useNotifications();
</script>

<template>
  <div id="notifications-container">
    <div v-for="notification in [...notifications]" class="notification-element" @click="notification.clear()">
      <div class="notification-alert">&excl;</div>
      <div class="notification-body">{{notification.body}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">

div#notifications-container {
  display: block;
  position: absolute;
  right: 3px;
  top: 7px;
  width: min(50%, 500px);
  min-width: 300px;
  z-index: 15;
}

</style>