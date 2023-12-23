<script setup lang="ts">
import LoadingButton from "@/components/LoadingButton.vue";
import {useConnection} from "@/hooks/useConnection";
import {onMounted} from "vue";

const {connect, disconnect, enteredName, attemptingConnection} = useConnection();

onMounted((): void => {
  disconnect();
});
</script>

<template>
  <div id="start-view-wrapper">
    <div id="start-connect-window">
      <div id="start-connect-title">Welcome to <i>Chatter</i>,</div>
      <div class="regular">Please enter a username below</div>
      <input v-model="enteredName" id="username-input" class="regular" placeholder="<username>" /><br />
      <LoadingButton id="connect-button" text="connect" @pressed="connect" :is-loading="attemptingConnection" />
    </div>
  </div>
</template>

<style scoped>

div#start-connect-window {
  background-color: var(--invert-bg-color);
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 4px 14px 0 rgba(0, 0, 0, 0.8);
  padding: 12px 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

div#start-connect-title, div#start-connect-title i {
  color: var(--dark-text-color);
  font-weight: bolder;
  font-size: 23px;
  margin-bottom: 10px;
}

input#username-input {
  margin-bottom: 15px;
  margin-top: 17px;
  width: var(--base-button-width-start-view);
}

button#connect-button {
  width: calc(var(--base-button-width-start-view) + 12px);
  margin-bottom: 7px;
}

button#connect-button:hover:enabled {
  color: #13ba58;
}

</style>