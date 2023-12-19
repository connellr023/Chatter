<script setup lang="ts">

function openGithub() {
  window.open("https://github.com/connellr023", "_blank");
}

</script>

<template>
  <div id="name-label" @click="openGithub"><span id="name-copy">&copy;</span> Connell Reffo</div>
</template>

<style scoped>

span#name-copy {
  font-size: 25px;
}

div#name-label {
  font-size: 17px;
  position: absolute;
  bottom: 8px;
  left: 8px;
  opacity: 0.5;
  text-decoration: none;
  user-select: none;
}

div#name-label:hover {
  cursor: pointer;
  text-decoration: underline;
}

</style>