<template>
  <DesktopView v-if="isDesktop" />
  <MobileView v-else />
</template>

<script setup lang="js">
import DesktopView from "@/views/desktop/consumer/ConsumerOrderCompleteView.vue";
import MobileView from "@/views/mobile/consumer/ConsumerOrderCompleteView.vue";
import { useMediaQuery } from "@vueuse/core";

const isDesktop = useMediaQuery('(min-width: 1200px)');
</script>
