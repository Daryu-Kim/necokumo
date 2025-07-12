<template>
  <DesktopView v-if="isDesktop" />
  <MobileView v-else />
</template>

<script setup lang="js">
import DesktopView from "@/views/desktop/consumer/mypage/ConsumerMypageOrderDetailView.vue";
import MobileView from "@/views/mobile/consumer/mypage/ConsumerMypageOrderDetailView.vue";
import { useMediaQuery } from "@vueuse/core";

const isDesktop = useMediaQuery('(min-width: 1200px)');
</script>
