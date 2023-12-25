<script setup lang="ts">
function openGithub(): void {
  window.open("https://github.com/connellr023", "_blank");
}
</script>

<template>
  <div id="name-label" @click="openGithub"><span id="name-copy">&copy;</span> Connell Reffo</div>
</template>

<style scoped lang="scss">
@import "@/assets/styles/variables";

* {
  color: $invert-highlight-color;
  font-family: "Ubuntu Mono", monospace;
  transition: color 0.05s ease-in-out;
}

span#name-copy {
  font-size: 25px;
}

div#name-label {
  font-size: 17px;
  bottom: 15px;
  position: absolute;
  text-decoration: none;
  user-select: none;
}

div#name-label:hover, div#name-label:hover #name-copy {
  color: $main-red-hue;
  cursor: pointer;
  text-decoration: underline;
}

div#name-label:hover #name-copy {
  text-decoration: none;
}

</style>