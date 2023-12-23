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
      <div id="select-rooms-container" class="content-container"></div>
      <div id="user-info">
        <button id="return-arrow" @click="router.push('/')">&lt;&minus;</button>
        <span id="username">{{userStore.username}}</span>
      </div>
    </div>
    <div id="chat-panel" class="panel">
      <div id="messages-container" class="content-container"></div>
      <div id="message-input-container">
        <button id="send-button" class="regular">&minus;&gt;</button>
        <input id="chat-input" class="regular" placeholder="<message>" />
      </div>
    </div>
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

    div#select-rooms-container {
      width: calc(100% - var(--chat-panel-width) - 135px);
    }

    div#user-info {
      position: absolute;
      background-color: var(--main-bg-color);
      border-radius: 5px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 14px 0 rgba(0, 0, 0, 0.65);
      bottom: 7px;
      margin: 0 1px;
      padding: 5px 0;
      width: calc(100% - var(--chat-panel-width) - 127px);
      overflow: hidden;
      text-align: left;
      transition: background-color 0.2s ease-in-out;

      span#username {
        color: var(--light-text-color);
        margin-left: 8px;
        font-style: italic;
      }

      button#return-arrow {
        background: none;
        border: none;
        color: var(--main-theme-color);
        cursor: pointer;
        margin-left: 7px;
      }

      button#return-arrow:hover {
        text-decoration: underline;
      }
    }

    div#user-info:hover {
      background-color: var(--dark-highlight-color);
    }
  }

  div#chat-panel {
    width: var(--chat-panel-width);

    --chat-input-right-padding: 40px;

    div#messages-container {
      width: calc(100% - var(--user-panel-width) - var(--chat-input-right-padding) - 96px);
    }

    div#message-input-container {
      position: absolute;
      bottom: 8px;
      margin-left: 2px;
      width: calc(100% - var(--user-panel-width) - var(--chat-input-right-padding) - 134px);

      input#chat-input {
        padding-right: var(--chat-input-right-padding);
        width: 100%;
      }

      button#send-button {
        background: none;
        box-shadow: none;
        bottom: 0;
        right: calc(-1 * var(--chat-input-right-padding) + 5px);
        font-size: 18px;
        color: var(--main-green-color);
        margin-left: 10px;
        padding: 6px 0;
        position: absolute;
      }
    }
  }

  div#messages-container, div#select-rooms-container {
    height: calc(100% - 65px);
  }
}

div.panel {
  background-color: var(--invert-bg-color);
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 14px 0 rgba(0, 0, 0, 0.7);
  color: var(--dark-text-color);
  display: inline-block;
  margin: 0 25px;
  padding: 6px;
  text-align: center;
  height: min(70vh, 500px);
}

div.content-container {
  background: #cbcbcb;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 14px 0 rgba(0, 0, 0, 0.1);
  padding: 4px;
  position: absolute;
  width: 50px;
  height: 100px;
  top: 8px;
  margin-left: 2px;
}

</style>