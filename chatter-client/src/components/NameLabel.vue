<script setup lang="ts">
function openGithub(): void {
  window.open("https://github.com/connellr023", "_blank");
}
</script>

<template>
  <div id="name-label-container">
    <div id="name-label"><span id="name-copy">&copy;</span> Connell Reffo</div>
    <div id="separator">|</div>
    <a id="gh-logo-a" @click="openGithub">
      <img alt="GitHub logo" id="gh-logo" src="@/assets/github_logo.png">
    </a>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables";

* {
  color: $invert-highlight-color;
  display: inline-block;
  font-family: "Ubuntu Mono", monospace;
  transition: color 0.05s ease-in-out;
  user-select: none;
}

a#gh-logo-a {
  cursor: pointer;
  margin-left: 4px;

  img {
    filter: brightness(0.6);
    width: 30px;
    margin-bottom: -9px;
    transition: all 0.15s ease-in-out;
  }

  &:hover {
    img {
      filter: brightness(0.4);
    }
  }
}

div#separator {
  $side-margin: 10px;

  margin-left: $side-margin;
  margin-right: $side-margin;
  color: $invert-highlight-color;
  font-size: 18px;
}

div#name-label-container {
  bottom: 20px;
  position: absolute;
}

span#name-copy {
  font-size: 25px;
}

div#name-label {
  font-size: 17px;
}

</style>