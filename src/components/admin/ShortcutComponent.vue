<template>
  <div class="admin-shortcut-box">
    <a
      href="https://necokumo.shop/"
      target="_blank"
      class="admin-shortcut-item primary"
    >
      <span class="material-icons-round">shopping_cart</span>
      <p>폐쇄몰 1</p>
    </a>
    <a
      href="https://necokumo.co.kr/"
      target="_blank"
      class="admin-shortcut-item primary"
    >
      <span class="material-icons-round">shopping_cart</span>
      <p>폐쇄몰 2</p>
    </a>
    <a
      href="https://냥이네구름가게.shop/"
      target="_blank"
      class="admin-shortcut-item primary"
    >
      <span class="material-icons-round">shopping_cart</span>
      <p>폐쇄몰 3</p>
    </a>
    <a
      href="https://snsshop.kr/"
      target="_blank"
      class="admin-shortcut-item secondary"
    >
      <span class="material-icons-round">report_problem</span>
      <p>SNS 작업몰</p>
    </a>
    <a
      href="https://instagram.com/necokumo_"
      target="_blank"
      class="admin-shortcut-item secondary"
    >
      <span class="material-icons-round">report_problem</span>
      <p>인스타그램</p>
    </a>
    <a
      href="https://youtube.com/@necokumo"
      target="_blank"
      class="admin-shortcut-item secondary"
    >
      <span class="material-icons-round">report_problem</span>
      <p>유튜브</p>
    </a>
    <a
      href="https://chzzk.naver.com/"
      target="_blank"
      class="admin-shortcut-item secondary"
    >
      <span class="material-icons-round">report_problem</span>
      <p>Chzzk</p>
    </a>
    <a
      href="https://www.sooplive.co.kr/"
      target="_blank"
      class="admin-shortcut-item secondary"
    >
      <span class="material-icons-round">report_problem</span>
      <p>SOOP</p>
    </a>
    <a
      href="https://web.realsystem.co.kr/daelim/login.do"
      target="_blank"
      class="admin-shortcut-item secondary"
    >
      <span class="material-icons-round">report_problem</span>
      <p>대림통운</p>
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
