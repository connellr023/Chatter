<script setup lang="ts">
import {config} from "@/lib/utility";
import {useUserStore} from "@/hooks/useUserStore";
import {useChat} from "@/hooks/useChat";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useMembers} from "@/hooks/useMembers";
import {useNotifications} from "@/hooks/useNotifications";

const router = useRouter();
const userStore = useUserStore();
const {rooms, messages, selectedRoomId, sendMessage, queryRooms} = useChat();
const {members} = useMembers();
const {pushNotification} = useNotifications();

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
        <div class="dim-title">My connections</div>
        <div id="room-list">
          <button v-for="room in rooms" :class="{'selected': selectedRoomId == room.id}" class="room-option bubble" @click="selectedRoomId = room.id">
            {{room.name}}
            <span><br />{{room.isGlobal ? "Public" : "Private"}}</span>
          </button>
        </div>
      </div>
      <div id="user-info" class="bubble" @click="router.push('/')">
        <div id="username-green-circle"></div>
        <span id="username">{{userStore.username}}</span>
        <img id="return-home" alt="Arrow icon" src="@/assets/arrow.svg" />
      </div>
    </div>
    <div id="chat-panel" class="panel">
      <div id="messages-container" class="content-container">
        <img id="empty-messages" alt="Chatter logo small" v-if="messages.size == 0 || !messages.get(selectedRoomId)" src="@/assets/logo_white_small.png" />
        <div id="messages-list" v-else>
          <div v-for="message in messages.get(selectedRoomId)" class="message-element">
            <div class="message-sender">{{message.sender}}</div>
            <div class="message-body">{{message.body}}</div>
          </div>
        </div>
      </div>
      <div id="message-input-container">
        <a id="send-button" class="regular" @click="message">
          <img alt="Send icon" src="@/assets/arrow.svg" />
        </a>
        <input id="chat-input" class="regular" placeholder="Send chat..." v-model="messageBody" @keyup.enter="message"/>
      </div>
    </div>
    <div id="members-panel" class="panel">
      <div id="members-container">
        <div class="dim-title"><b>{{members.get(selectedRoomId)?.length || 0}}</b> Online</div>
        <div id="members-list">
          <div class="member-element bubble" v-for="member in members.get(selectedRoomId)">
            <div class="member-green-circle"></div>
            {{member.username}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/scoped/chatview";
</style>