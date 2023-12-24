<script setup lang="ts">
import {useNotifications} from "@/hooks/useNotifications";

const {notifications} = useNotifications();
</script>

<template>
  <div id="notifications-container">
    <div v-for="notification in [...notifications]" class="notification-element" @click="notification.clear()">
      <div :style="`color: ${notification.color}`" class="notification-alert">{{notification.symbol}}</div>
      <div class="notification-body">{{notification.body}}</div>
    </div>
  </div>
</template>

<style scoped>

div#notifications-container {
  display: block;
  position: absolute;
  right: 3px;
  top: 7px;
  width: min(50%, 500px);
  z-index: 15;
}

div.notification-element {
  background-color: var(--invert-bg-color);
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 14px 0 rgba(0, 0, 0, 0.75);
  cursor: pointer;
  padding-left: 17px;
  font-size: 16px;
  margin: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  user-select: none;
  width: fit-content;
  float: right;
  transition: all 0.15s ease-in-out;

  animation: fade-in 0.15s ease-in-out both;

  div.notification-body {
    display: inline;
    color: var(--dark-text-color);
    font-size: 17px;
    text-align: right;
    margin-right: 10px;
  }

  div.notification-alert {
    background-color: var(--main-bg-color);
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 14px 0 rgba(0, 0, 0, 0.32);
    display: inline;
    font-size: 20px;
    font-weight: bolder;
    margin-right: 12px;
    margin-left: -11px;
    padding: 5px 4px;
  }
}

div.notification-element:hover {
  background-color: var(--invert-highlight-color);
  transition: all 0.15s ease-in-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

</style>