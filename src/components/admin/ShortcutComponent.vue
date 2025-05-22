<template>
  <div class="admin-shortcut-box">
    <a
      href="https://necokumo.shop/"
      target="_blank"
      class="admin-shortcut-item primary"
    >
      <span class="material-icons-round">shopping_cart</span>
      <p>자사몰</p>
    </a>
    <a
      href="https://necokumo.web.app/"
      target="_blank"
      class="admin-shortcut-item primary"
    >
      <span class="material-icons-round">report_problem</span>
      <p>계좌이체몰</p>
    </a>
    <a
      href="https://sell.smartstore.naver.com/"
      target="_blank"
      class="admin-shortcut-item secondary"
    >
      <span class="material-icons-round">report_problem</span>
      <p>스마트스토어</p>
    </a>
    <a
      href="https://www.cupost.co.kr/postbox/main.cupost"
      target="_blank"
      class="admin-shortcut-item secondary"
    >
      <span class="material-icons-round">report_problem</span>
      <p>택배사 사이트</p>
    </a>
  </div>
</template>

<script setup lang="js"></script>

<style lang="scss" scoped>
.admin-shortcut-box {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  > .admin-shortcut-item {
    display: flex;
    align-items: center;
    border-radius: 4px;
    gap: 8px;
    padding: 6px 12px;

    &.primary {
      background-color: #007bff;
      color: #ffffff;
    }
    &.secondary {
      background-color: #333;
      color: #fff;
    }

    > p {
      font-size: 14px;
    }
  }
}
</style>
