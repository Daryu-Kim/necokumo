<template>
  <div class="content">
    <NavComponent />
    <div class="admin-content">
      <ShortcutComponent />
      <div class="content-container">
        <router-view />
      </div>
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

    > .content-container {
      max-width: 960px;
      margin: 0 auto;
    }
  }
}
</style>
