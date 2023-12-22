<script setup lang="ts">
import {onUnmounted, ref} from "vue";
import {useEventBus} from "@/lib/eventBus";
import {GlobalEvents, type NotificationObject} from "@/lib/utility";

const eventBus = useEventBus();
const notifications = ref(new Set<NotificationObject>);
let counter: number = 0;

function handlePushNotification(body: string, sender="", symbol="!", color="red"): void {
  const notification: NotificationObject = {
    id: counter++,
    sender: sender,
    body: body,
    alert: {
      symbol: symbol,
      color: color
    },
    onClear: (): void => {
      notifications.value.delete(notification);
    }
  };

  window.setTimeout((): void => {
    notifications.value.delete(notification);
  }, notification.body.length * 200);

  notifications.value.add(notification)
}

const off = eventBus.on(GlobalEvents.NOTIFICATION, (notification): void => {
  handlePushNotification(notification.body);
});

onUnmounted((): void => {
  off();
});
</script>

<template>
  <div id="notifications-wrapper">
    <div v-for="notification in [...notifications]" id="notifications-container">
      <div class="notification-element" @click="notification.onClear()">
        <div :style="`color: ${notification.alert.color}`" class="notification-alert">
          {{notification.alert.symbol}}
        </div>
        {{notification.body}}
      </div>
    </div>
  </div>

</template>

<style scoped>

div#notifications-wrapper {
  position: absolute;
  right: 0;
  top: 4px;
  z-index: 15;

  div#notifications-container {
    display: block;
  }
}

div.notification-element {
  background-color: var(--invert-bg-color);
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 14px 0 rgba(0, 0, 0, 0.65);
  color: var(--dark-text-color);
  cursor: pointer;
  font-size: 17px;
  padding: 6px 17px;
  margin: 20px;
  user-select: none;
  transition: all 0.15s ease-in-out;

  div.notification-alert {
    display: inline;
    font-size: 20px;
    margin-right: 15px;
  }
}

div.notification-element:hover {
  background-color: var(--invert-highlight-color);
  transition: all 0.15s ease-in-out;
}

</style>