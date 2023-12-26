<script setup lang="ts">
import {useRouter} from "vue-router";
import CornerLogo from "@/components/CornerLogo.vue";

const router = useRouter();

const props = defineProps({
  code: String,
  message: String
});
</script>

<template>
  <div id="error-view-container">
    <CornerLogo />
    <div class="error-header">
      &lt;{{props.code}}&gt;
      <div>{{props.message}}</div>
      <button id="return-button" class="outline" @click="router.push('/')">Return</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/variables.scss";
@import "@/styles/utility.scss";

button#return-button {
  font-size: 18px;
  padding: 8px;
}

.error-header {
  color: $main-red-hue;
  font-family: $monospace-font;
  font-size: 65px;
  font-weight: bold;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  user-select: none;

  div {
    color: $invert-bg-color;
    font-weight: normal;
    font-family: $sans-serif-font;
    margin-top: 3px;
    margin-bottom: 4px;
    font-size: 30px;
  }
}

</style>