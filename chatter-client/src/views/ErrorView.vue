<script setup lang="ts">
import {useRouter} from "vue-router";

import CornerLogo from "@/components/CornerLogo.vue";
import NameLabel from "@/components/NameLabel.vue";

const router = useRouter();

const props = defineProps({
  code: String,
  message: String
});
</script>

<template>
  <div id="error-view-container" class="flex-container">
    <CornerLogo />
    <div class="error-header">
      <div id="error-code">&lt;{{props.code}}&gt;</div>
      <div id="error-message">{{props.message}}</div>
      <button id="return-button" class="bubble" @click="router.push('/')">Return</button>
    </div>
    <NameLabel />
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";
@import "@/styles/utility.scss";

div.error-header {
  font-size: 65px;

  div#error-code {
    @include gradient-text($main-gradient-hue-start, $main-gradient-hue-end);

    font-family: $monospace-font;
    font-weight: bold;
    user-select: none;
  }

  div#error-message {
    color: $invert-bg-color;
    font-weight: normal;
    font-family: $sans-serif-font;
    margin-top: 3px;
    margin-bottom: 4px;
    font-size: 30px;
  }

  button#return-button {
    font-size: 0.32em;
    padding: 12px;

    &:hover {
      color: $light-text-color;
    }
  }
}

</style>