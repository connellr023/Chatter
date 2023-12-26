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
        <div class="select-room-prompt">My rooms</div>
        <div id="empty-rooms" class="empty" v-if="rooms.length == 0">&lt;empty&gt;</div>
        <div id="room-list" v-else>
          <button v-for="room in rooms" :class="{'selected': selectedRoomId == room.id}" class="room-option bubble" @click="selectedRoomId = room.id">
            {{room.name}}
            <span><br />{{room.isGlobal ? "Public" : "Private"}}</span>
          </button>
        </div>
      </div>
      <div id="user-info">
        <button id="return-arrow" @click="router.push('/')">&lt;&minus;</button>
        <span id="username">{{userStore.username}}</span>
      </div>
    </div>
    <div id="chat-panel" class="panel">
      <div id="messages-container" class="content-container">
        <div id="empty-messages" class="empty" v-if="messages.size == 0 || !messages.get(selectedRoomId)">Empty</div>
        <div id="messages-list" v-else>
          <div v-for="message in messages.get(selectedRoomId)" class="message-element lighter-shadow">
            <div class="message-sender">{{message.sender}}</div>
            <div class="message-body">{{message.body}}</div>
          </div>
        </div>
      </div>
      <div id="message-input-container">
        <button id="send-button" class="regular" @click="message">&minus;&gt;</button>
        <input id="chat-input" class="regular" placeholder="Send chat..." v-model="messageBody" @keyup.enter="message"/>
      </div>
    </div>
    <div id="members-panel" class="panel">
      <div>Members: {{members.get(selectedRoomId)?.length || 0}}</div>
      <div v-for="member in members.get(selectedRoomId)">{{member.username}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables";

div#chat-view-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 100vh;
  width: 100vw;

  div#user-options-panel, div#chat-panel, div#members-panel {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  $user-options-panel-width: min(max(25%, 220px), 270px);
  $members-panel-width: min(max(12%, 110px), 130px);

  div#user-options-panel {
    background-color: $main-bg-color;
    width: $user-options-panel-width;
    display: block;

    div#select-rooms-container {
      padding: 15px;

      div.select-room-prompt {
        font-size: 15px;
        color: $invert-bg-color;
        text-align: left;
        margin-bottom: 10px;
        margin-left: 7px;
        opacity: 0.4;
        user-select: none;
      }

      button.room-option {
        width: calc(100%);
        margin-bottom: 10px;

        span {
          font-size: 13px;
          opacity: 0.4;
          transition: opacity 0.15s ease-in-out;
        }

        &.selected span {
          opacity: 0.7;
        }
      }
    }

    div#user-info {

    }
  }

  div#chat-panel {
    background-color: $secondary-bg-color;
    width: calc(100% - $user-options-panel-width - $members-panel-width);
  }

  div#members-panel {
    background-color: $main-bg-color;
    width: $members-panel-width;
  }
}

div.empty {
  color: $invert-highlight-color;
  user-select: none;
  font-size: 35px;
  margin-top: 10px;
}

input#chat-input {
  border-radius: 8px;
  padding: 10px;
}

</style>