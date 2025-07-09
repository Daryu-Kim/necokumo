<template>
  <DesktopView v-if="isDesktop" />
  <MobileView v-else />
</template>

<script setup lang="js">
import DesktopView from "@/layouts/desktop/ConsumerLayout.vue";
import MobileView from "@/layouts/mobile/ConsumerLayout.vue";
import { useMediaQuery } from '@vueuse/core';

const isDesktop = useMediaQuery('(min-width: 1200px)');
</script>
