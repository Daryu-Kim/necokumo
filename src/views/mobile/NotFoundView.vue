<template>
  <div class="not-found">
    <div>
      <span class="material-icons-outlined"> error_outline </span>
      <h2>앗! 길을 잃었네요 😿</h2>
      <div class="text-group">
        <p>찾으시려던 페이지가 사라졌거나, 존재하지 않아요.</p>
        <p>링크가 잘못되었거나, 페이지가 이동되었을 수 있어요.</p>
      </div>
      <div class="button-group">
        <button class="outlined" @click="router.back">🔙 이전 페이지로</button>
        <router-link to="/" class="primary">🏠 홈으로 가기</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import router from '@/router';
</script>

<style lang="scss" scoped>
.not-found {
  padding: 0 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  span {
    font-size: 72px;
    color: #999;
  }

  h2 {
    margin-top: 24px;
    font-weight: 700;
    color: #333;
  }

  .text-group {
    margin-top: 16px;
    p {
      line-height: 24px;
      color: #666;
      word-break: keep-all;
    }
  }

  .button-group {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;

    button,
    a {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      background: none;
      font-weight: 700;

      &.outlined {
        border: 1px solid black;
      }

      &.primary {
        background: black;
        color: white;
      }
    }
  }
}
</style>
