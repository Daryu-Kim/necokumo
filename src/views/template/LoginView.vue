<template>
  <DesktopView v-if="isDesktop" />
  <MobileView v-else />
</template>

<script setup lang="js">
import { onMounted, ref } from 'vue';
import DesktopView from "@/views/desktop/LoginView.vue";
import MobileView from "@/views/mobile/LoginView.vue";

const isDesktop = ref(false);

onMounted(() => {
	isDesktop.value = window.innerWidth >= 1200;
	window.addEventListener('resize', () => {
    isDesktop.value = window.innerWidth >= 1200;
  });
});
</script>
