<script setup lang="ts">
function openGithub(): void {
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
  bottom: 7px;
  left: 13px;
  opacity: 0.5;
  text-decoration: none;
  user-select: none;
  z-index: 10;
}

div#name-label:hover, div#name-label:hover #name-copy {
  color: var(--main-theme-color);
  cursor: pointer;
  text-decoration: underline;
}

div#name-label:hover #name-copy {
  text-decoration: none;
}

</style>