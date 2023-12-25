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
      <div id="start-connect-title">Welcome back!</div>
      <input v-model="enteredName" id="username-input" class="regular" placeholder="Enter name..." /><br />
      <LoadingButton id="connect-button" classes="regular" text="Connect" @pressed="connect" :is-loading="attemptingConnection" />
      <div id="prompt" class="regular">Please enter a username above.</div>
    </div>
    <NameLabel />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/styles/variables";

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
  width: 100vw;
  text-align: center;
}

div#start-connect-window {
  $size: 30vw;
  $max-size: 350px;
  $min-size: 250px;

  display: block;
  align-items: center;
  text-align: center;
  width: 50%;
  min-width: $min-size + 10px;

  $c1: #5e00ff;
  $c2: #7b00ff;
  $darken-amount: 15%;

  button#connect-button {
    background: linear-gradient(to top, $c1, $c2);
    width: $size;
    min-width: $min-size;
    max-width: $max-size;

    &:active:enabled, &:disabled {
      background: linear-gradient(to top, darken($c1, $darken-amount), darken($c2, $darken-amount));
    }
  }

  input {
    $offset: 20px;

    width: calc($size - $offset);
    min-width: $min-size - $offset;
    max-width: $max-size - $offset;
  }
}

div#start-connect-title {
  font-weight: bolder;
  font-size: 30px;
  margin-bottom: 10px;
  user-select: none;
}

input#username-input {
  margin-bottom: 15px;
  margin-top: 17px;
}

div#prompt {
  font-size: 17px;
  margin-top: 27px;
  user-select: none;
}

</style>