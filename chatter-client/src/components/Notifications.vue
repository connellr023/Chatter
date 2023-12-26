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
@import "@/styles/variables";
@import "@/styles/utility";

div#notifications-container {
  display: block;
  position: absolute;
  right: 3px;
  top: 7px;
  width: min(50%, 500px);
  min-width: 300px;
  z-index: 15;
}


div.notification-element {
  @extend %base-main;

  background-color: $invert-bg-color;
  border: none;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 14px 0 rgba(0, 0, 0, 0.6);
  cursor: pointer;
  padding-left: 17px;
  font-size: 16px;
  margin: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  user-select: none;
  float: right;

  animation: fade-in 0.15s ease-in-out both;

  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  &:hover {
    background-color: $invert-highlight-color;
    transition: all 0.15s ease-in-out;
  }

  $base-font-size: 16px;

  div.notification-body {
    display: inline;
    color: $dark-text-color;
    font-size: $base-font-size;
    text-align: right;
    margin-right: 10px;
  }

  div.notification-alert {
    background-color: $main-bg-color;
    border-radius: inherit;
    color: $main-red-hue;
    font-family: $monospace-font;
    display: inline;
    font-size: $base-font-size + 5px;
    font-weight: bold;
    margin-right: 12px;
    margin-left: -10px;
    padding: 5px 7px 5px 6px;
  }
}

</style>