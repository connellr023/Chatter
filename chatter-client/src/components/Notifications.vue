<script setup lang="ts">
import {provide, ref} from "vue";
import {type NotificationObject} from "@/utility";

const notifications = ref(new Set<NotificationObject>);
let counter: number = 0;

function push(body: string, sender="", symbol="!", color="red"): void {
  console.log(body);
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
  }, notification.body.length * 100);

  notifications.value.add(notification)
}

provide("notifications", {push});
</script>

<template>
  <div v-for="notification in [...notifications]" id="notifications-wrapper" @pushNotification="(notification: any): void => console.log(notification)">
    <div>{{notification.body}}</div>
  </div>
</template>

<style scoped>

</style>