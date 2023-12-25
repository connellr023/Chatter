<script setup lang="ts">
import LoadingButton from "@/components/LoadingButton.vue";
import {useConnection} from "@/hooks/useConnection";
import {onMounted} from "vue";
import NameLabel from "@/components/NameLabel.vue";

const {connect, disconnect, enteredName, attemptingConnection} = useConnection();

onMounted((): void => {
  disconnect();
});
</script>

<template>
  <div id="start-view-container">
    <img id="logo" alt="Chatter logo" src="@/assets/logo_white.png" />
    <div id="start-connect-window">
      <div id="start-connect-title">Welcome back.</div>
      <input v-model="enteredName" id="username-input" class="regular" placeholder="Enter name..." /><br />
      <LoadingButton id="connect-button" text="connect" @pressed="connect" :is-loading="attemptingConnection" />
      <div id="prompt" class="regular">Please enter a username above</div>
    </div>
    <NameLabel />
  </div>
</template>

<style scoped lang="scss">

img#logo {
  $distance: 20px;

  position: absolute;
  width: 180px;

  left: $distance;
  top: $distance - 2px;
}

div#start-view-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

div#start-connect-window {
  text-align: center;
}

div#start-connect-title {
  font-weight: bolder;
  font-size: 30px;
  margin-bottom: 10px;
}

input#username-input {
  margin-bottom: 15px;
  margin-top: 17px;
}

div#prompt {
  margin-top: 10px;
}

button#connect-button {
  margin-bottom: 7px;
}

button#connect-button:hover:enabled {
  color: #13ba58;
}

</style>