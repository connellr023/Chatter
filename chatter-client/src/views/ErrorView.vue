<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();

const props = defineProps({
  code: String,
  message: String
});

function navigateToStart(): void {
  router.push("/");
}
</script>

<template>
  <main>
    <div class="error-header">
      &lt;{{props.code}}&gt;
      <div>{{props.message}}</div>
      <button id="return-button" class="regular invert" @click="navigateToStart">&lt;return&gt;</button>
    </div>
  </main>
</template>

<style scoped>

button#return-button {
  padding: 11px;
  font-size: 18px;
}

.error-header {
  color: var(--main-theme-color);
  font-weight: bolder;
  font-size: max(3.3vw, 50px);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  user-select: none;

  div {
    font-weight: normal;
    margin-top: 7px;
    margin-bottom: -2px;
    font-size: max(1.4vw, 30px);
  }
}

</style>