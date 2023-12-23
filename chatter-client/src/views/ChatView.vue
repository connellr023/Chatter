<script setup lang="ts">
import {useUserStore} from "@/hooks/useUserStore";
import {onMounted} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const userStore = useUserStore();

onMounted((): void => {
  if (!userStore.connected) {
    router.push({name: "error", params: {code: "405", "message": "Not Allowed"}});
  }
});
</script>

<template>
  <div id="chat-view-container">
    <div id="user-options-panel" class="panel">
      <div id="user-info">
        <span id="arrow">&minus;&gt;</span>
        <span id="username">{{userStore.username}}</span>
        <button id="disconnect" class="regular" @click="router.push('/')">&lt;return&gt;</button>
      </div>
    </div>
    <div id="chat-panel" class="panel"></div>
  </div>
</template>

<style scoped>

div#chat-view-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  text-align: center;
  width: fit-content;
  display: flex;
  justify-content: center;

  --user-panel-width: min(25vw, 300px);
  --chat-panel-width: min(55vw, 850px);

  div#user-options-panel {
    width: var(--user-panel-width);

    div#user-info {
      position: absolute;
      background-color: var(--main-bg-color);
      border-radius: 5px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 14px 0 rgba(0, 0, 0, 0.25);
      bottom: 7px;
      margin: 0 1px;
      padding: 3px 0;
      width: calc(100% - var(--chat-panel-width) - 127px);
      overflow: hidden;

      * {
        font-size: 16px;
      }

      span#username {
        color: var(--light-text-color);
        margin-left: 8px;
        font-style: italic;
      }

      span#arrow {
        user-select: none;
        color: var(--main-green-color);
        margin-left: 3px;
      }

      button#disconnect {
        background: none;
        border: none;
        box-shadow: none;
        color: var(--light-text-color);
      }

      button#disconnect:hover {
        color: var(--main-theme-color);
      }
    }
  }

  div#chat-panel {
    width: var(--chat-panel-width);
  }
}

div.panel {
  background-color: var(--invert-bg-color);
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 14px 0 rgba(0, 0, 0, 0.70);
  color: var(--dark-text-color);
  display: inline-block;
  margin: 0 25px;
  padding: 6px;
  text-align: center;
  height: min(60vh, 485px);
}

</style>