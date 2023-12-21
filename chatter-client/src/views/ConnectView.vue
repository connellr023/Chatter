<script setup lang="ts">
import ConnectButton from "@/components/ConnectButton.vue";
</script>

<template>
  <main>
    <div id="start-view-wrapper">
      <div id="start-connect-window">
        <div id="start-connect-title">Welcome to <i>Chatter</i>,</div>
        <div class="regular">Please enter a username below</div>
        <input id="username-input" class="regular" placeholder="<username>" />
        <ConnectButton />
      </div>
    </div>
  </main>
</template>

<style scoped>

div#start-connect-window {
  background-color: var(--modal-bg-color);
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 4px 14px 0 rgba(0, 0, 0, 0.8);
  padding: 12px 50px;
  position: absolute;
  width: fit-content;
  height: fit-content;
  left:50%;
  top:50%;
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
  width: 90%;
}

</style>