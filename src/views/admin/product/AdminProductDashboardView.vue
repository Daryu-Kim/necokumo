<template>
  <div class="admin-product-dashboard">
    <h2>상품 대시보드</h2>
    <div class="dashboard-box">
      <h3>상품 현황</h3>
      <div>
        <div>
          <p class="count-title">전체 등록 상품</p>
          <p class="count-text"><span class="count-number">0</span> 개</p>
        </div>
        <div>
          <p class="count-title">판매 중인 상품</p>
          <p class="count-text"><span class="count-number">0</span> 개</p>
        </div>
        <div>
          <p class="count-title">품절 상품</p>
          <p class="count-text"><span class="count-number">0</span> 개</p>
        </div>
        <div>
          <p class="count-title">삭제 상품</p>
          <p class="count-text"><span class="count-number">0</span> 개</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.admin-product-dashboard {
  margin-top: 36px;

  > .dashboard-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;

    > div {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 16px;

      > div {
        background-color: #efefef;
        border-radius: 8px;
        padding: 16px;

        > .count-title {
          font-size: 14px;
          font-weight: 500;
        }

        > .count-text {
          margin-top: 4px;
          display: flex;
          align-items: center;
          font-size: 14px;

          > .count-number {
            color: #007bff;
            font-size: 18px;
            font-weight: 700;
            margin-right: 4px;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
