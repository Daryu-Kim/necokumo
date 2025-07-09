<template>
  <div class="not-found">
    <div>
      <span class="material-icons-outlined"> error_outline </span>
      <h1>앗! 길을 잃었네요 😿</h1>
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
  padding: 36px 24px;
  margin: auto;
  max-width: 1200px;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  span {
    font-size: 96px;
    color: #999;
  }

  h1 {
    margin-top: 24px;
    font-weight: 700;
    color: #333;
  }

  .text-group {
    margin-top: 16px;
    p {
      line-height: 24px;
      color: #666;
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
      font-size: 16px;
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
