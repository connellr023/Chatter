<script setup lang="ts">
import BackgroundEffect from "@/components/BackgroundEffect.vue";
</script>

<template>
  <main>
    <BackgroundEffect />
    <div class="error-header">&lt;404&gt;<div>Route Not Found</div></div>
  </main>
</template>

<style scoped>

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
    font-size: max(1.4vw, 30px);
  }
}

</style>