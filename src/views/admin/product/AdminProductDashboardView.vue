<template>
  <div class="admin-product-dashboard">
    <h2>상품 대시보드</h2>
    <div class="dashboard-box">
      <h3>상품 현황</h3>
      <div>
        <div>
          <p class="count-title">전체 등록 상품</p>
          <p class="count-text">
            <router-link to="/admin/product/list"
              ><span class="count-number">{{ productAllCount }}</span>
              개</router-link
            >
          </p>
        </div>
        <div>
          <p class="count-title">판매 중인 상품</p>
          <p class="count-text">
            <router-link to="/admin/product/list"
              ><span class="count-number">{{ productActiveCount }}</span>
              개</router-link
            >
          </p>
        </div>
        <div>
          <p class="count-title">품절 상품</p>
          <p class="count-text">
            <router-link to=""
              ><span class="count-number">0</span> 개</router-link
            >
          </p>
        </div>
        <div>
          <p class="count-title">삭제 상품</p>
          <p class="count-text">
            <router-link to="/admin/product/deleted-list"
              ><span class="count-number">{{ productInactiveCount }}</span>
              개</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getDocs, collection } from "firebase/firestore";
import { onMounted, ref } from "vue";
import { db } from "@/lib/firebase";

const productAllCount = ref(0);
const productActiveCount = ref(0);
const productInactiveCount = ref(0);

onMounted(async () => {
  const data = await getDocs(collection(db, "product"));
  productAllCount.value = data.docs.length;
  productActiveCount.value = data.docs.filter(
    (doc) => doc.data().isActive === true
  ).length;
  productInactiveCount.value = data.docs.filter(
    (doc) => doc.data().isActive === false
  ).length;
});
</script>

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

          > a {
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
}
</style>
