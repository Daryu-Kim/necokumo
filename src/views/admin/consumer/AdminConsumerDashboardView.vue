<template>
  <div class="admin-product-dashboard">
    <h2>고객 대시보드</h2>
    <div class="dashboard-box">
      <h3>상품 현황</h3>
      <div>
        <div>
          <p class="count-title">신규 회원수</p>
          <p class="count-text">
            <span class="count-number">{{
              consumerNewCount.toLocaleString()
            }}</span>
            명
          </p>
        </div>
        <div>
          <p class="count-title">방문 회원수</p>
          <p class="count-text">
            <span class="count-number">{{
              consumerVisitCount.toLocaleString()
            }}</span>
            명
          </p>
        </div>
        <div>
          <p class="count-title">TOTAL</p>
          <p class="count-text">
            <span class="count-number">{{
              consumerAllCount.toLocaleString()
            }}</span>
            명
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

const consumerAllCount = ref(0);
const consumerVisitCount = ref(0);
const consumerNewCount = ref(0);

const now = new Date();
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 오늘 00:00
const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // 내일 00:00
const sevenDaysAgo = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 7
); // 7일 전 00:00

onMounted(async () => {
  const data = await getDocs(collection(db, "users"));
  consumerAllCount.value = data.docs.length;
  consumerVisitCount.value = data.docs.filter((doc) => {
    const d = doc.data();
    const visitedAt = d.visitedAt; // Firestore Timestamp
    return (
      visitedAt &&
      visitedAt.toMillis() >= todayStart.getTime() &&
      visitedAt.toMillis() < todayEnd.getTime()
    );
  }).length;
  consumerNewCount.value = data.docs.filter((doc) => {
    const d = doc.data();
    const createdAt = d.createdAt; // Firestore Timestamp
    return (
      createdAt &&
      createdAt.toMillis() >= sevenDaysAgo.getTime() &&
      createdAt.toMillis() < todayEnd.getTime()
    );
  }).length;
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
      grid-template-columns: repeat(3, 1fr);
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
