<script setup lang="ts">
import {useConnection} from "@/hooks/useConnection";
import {onMounted} from "vue";

import LoadingButton from "@/components/LoadingButton.vue";
import NameLabel from "@/components/NameLabel.vue";
import CornerLogo from "@/components/CornerLogo.vue";

const {connect, disconnect, enteredName, attemptingConnection} = useConnection();

onMounted((): void => {
  disconnect();
});
</script>

<template>
  <div id="start-view-container">
    <CornerLogo />
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
@import "@/styles/variables";
@import "@/styles/utility";

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

  button#connect-button {
    @include gradient-button(#5e00ff, #7b00ff);

    width: $size;
    min-width: $min-size;
    max-width: $max-size;
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