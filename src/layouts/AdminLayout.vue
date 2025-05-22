<template>
  <div class="content">
    <NavComponent />
    <div class="admin-content">
      <ShortcutComponent />
      <router-view />
    </div>
  </div>
</template>

<script setup lang="js">
import NavComponent from '@/components/admin/NavComponent.vue';
import ShortcutComponent from '@/components/admin/ShortcutComponent.vue';
</script>

<style lang="scss" scoped>
.content {
  display: flex;

  > .admin-content {
    flex: 1;
    padding: 16px 24px;
    overflow-y: scroll;
    height: 100vh;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
