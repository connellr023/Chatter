<script setup lang="ts">
import {config} from "@/lib/utility";
import {useUserStore} from "@/hooks/useUserStore";
import {useChat} from "@/hooks/useChat";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {pushNotification} from "@/hooks/useNotifications";
import {useMembers} from "@/hooks/useMembers";

const router = useRouter();
const userStore = useUserStore();
const {rooms, messages, selectedRoomId, sendMessage, queryRooms} = useChat();
const {members} = useMembers();

const messageBody = ref("");

/**
 * Helper function for sending messages through Vue events
 */
function message() {
  if (messageBody.value.length <= config.MAX_MESSAGE_LENGTH) {
    if (messageBody.value.length >= config.MIN_MESSAGE_LENGTH) {
      sendMessage(messageBody.value);
      messageBody.value = "";
    }
  }
  else {
    pushNotification(`Message must be within ${config.MIN_MESSAGE_LENGTH} and ${config.MAX_MESSAGE_LENGTH} characters`);
  }
}

onMounted((): void => {
  if (!userStore.connected) {
    router.push({name: "error", params: {code: "405", "message": "Not Allowed"}});
  }

  queryRooms(true);
});
</script>

<template>
  <div id="chat-view-container">
    <div id="user-options-panel" class="panel">
      <div id="select-rooms-container" class="content-container">
        <div id="empty-rooms" class="empty" v-if="rooms.length == 0">&lt;empty&gt;</div>
        <div id="room-list" v-else>
          <button v-for="room in rooms" :class="{'selected': selectedRoomId == room.id}" class="room-option regular lighter-shadow" @click="selectedRoomId = room.id">{{selectedRoomId == room.id ? "&gt; "+ room.name : room.name}}</button>
        </div>
      </div>
      <div id="user-info">
        <button id="return-arrow" @click="router.push('/')">&lt;&minus;</button>
        <span id="username">{{userStore.username}}</span>
      </div>
    </div>
    <div id="chat-panel" class="panel">
      <div id="messages-container" class="content-container">
        <div id="empty-messages" class="empty" v-if="messages.size == 0 || !messages.get(selectedRoomId)">&lt;empty&gt;</div>
        <div id="messages-list" v-else>
          <div v-for="message in messages.get(selectedRoomId)" class="message-element lighter-shadow">
            <div class="message-sender">{{message.sender}}</div>
            <div class="message-body">{{message.body}}</div>
          </div>
        </div>
      </div>
      <div id="message-input-container">
        <button id="send-button" class="regular" @click="message">&minus;&gt;</button>
        <input id="chat-input" class="regular" placeholder="<message>" v-model="messageBody" @keyup.enter="message"/>
      </div>
    </div>
    <div id="members-panel" class="panel">
      <div>Members: {{members.get(selectedRoomId)?.length || 0}}</div>
      <div v-for="member in members.get(selectedRoomId)">{{member.username}}</div>
    </div>
  </div>
</template>

<style scoped>

div.empty {
  color: var(--invert-highlight-color);
  user-select: none;
  font-size: 35px;
  margin-top: 10px;
}

div#room-list {
  padding-top: 3px;

  button.room-option {
    font-weight: bolder;
    margin-bottom: 12px;
    padding: 15px;
    width: calc(100% - 4px);
    text-align: left;
  }

  button.room-option.selected {
    color: var(--main-green-color);
    transition: color 0.15s ease-in-out;
  }
}

div#messages-list {
  height: calc(100% + 10px);
  overflow-x: hidden;
  overflow-y: scroll;

  div.message-element {
    background-color: var(--main-bg-color);
    border-radius: 5px;
    text-align: left;
    margin: 3px 12px 7px 2px;
    padding: 7px 7px 7px 12px;

    div {
      width: fit-content;
    }

    div.message-sender {
      color: var(--main-red-color);
      font-style: italic;
      user-select: none;
      margin-bottom: 4px;
    }

    div.message-sender:hover {
      text-decoration: underline;
    }
  }

  div.message-element:hover {
    background-color: var(--dark-highlight-color);
  }
}

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
      width: calc(100% - var(--chat-panel-width) - 124px);
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
        color: var(--main-red-color);
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
      width: calc(100% - var(--user-panel-width) - var(--chat-input-right-padding) - 84px);
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
  position: absolute;
}

</style>