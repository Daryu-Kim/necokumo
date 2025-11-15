<template>
  <DesktopView v-if="isDesktop" />
  <MobileView v-else />
</template>

<script setup lang="js">
import DesktopView from "@/views/desktop/member/MemberJoinView.vue";
import MobileView from "@/views/mobile/member/MemberJoinView.vue";
import { useMediaQuery } from "@vueuse/core";

const isDesktop = useMediaQuery('(min-width: 1200px)');
</script>
