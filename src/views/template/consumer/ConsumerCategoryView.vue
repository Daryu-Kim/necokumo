<template>
  <!-- <DesktopView v-if="isDesktop" /> -->
  <MobileView v-if="!isDesktop" />
</template>

<script setup lang="js">
// import DesktopView from "@/views/desktop/consumer/ConsumerCheckoutView.vue";
import MobileView from "@/views/mobile/consumer/ConsumerCategoryView.vue";
import { useMediaQuery } from "@vueuse/core";

const isDesktop = useMediaQuery('(min-width: 1200px)');
</script>
