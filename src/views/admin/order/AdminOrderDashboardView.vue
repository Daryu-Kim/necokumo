<template>
  <div class="admin-product-dashboard">
    <h2>주문 대시보드</h2>
    <div class="dashboard-box">
      <h3>한 달 매출 현황</h3>
      <div>
        <div>
          <p class="count-title">무통장입금 매출</p>
          <p class="count-text">
            <router-link to="/admin/order/list"
              ><span class="count-number">
                {{ orderBankPrice.toLocaleString() }}
              </span>
              원</router-link
            >
          </p>
        </div>
        <div>
          <p class="count-title">카드결제 매출</p>
          <p class="count-text">
            <router-link to="/admin/order/list"
              ><span class="count-number">{{ orderCardPrice }}</span>
              $</router-link
            >
          </p>
        </div>
        <div>
          <p class="count-title">환불 금액</p>
          <p class="count-text">
            <router-link to=""
              ><span class="count-number">{{ orderRefundPrice }}</span>
              원</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getDocs,
  collection,
  Timestamp,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { onMounted, ref } from "vue";
import { db } from "@/lib/firebase";

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);
oneMonthAgo.setHours(0, 0, 0, 0);

const startDate = Timestamp.fromDate(oneMonthAgo);
const endDate = Timestamp.fromDate(today);

const orderBankPrice = ref(0);
const orderCardPrice = ref(0);
const orderRefundPrice = ref(0);

onMounted(async () => {
  const q = query(
    collection(db, "productOrder"),
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate)
  );
  const data = await getDocs(q);

  // 무통장입금 금액 산정
  let bankTotal = 0;
  let cardTotal = 0;

  data.forEach(async (doc) => {
    const data = doc.data();
    const orderData = await (
      await getDoc(doc(db, "order", data.orderId))
    ).data();
    if (orderData.paymentMethod === "bank") {
      bankTotal += data.productPrice;
    } else {
      cardTotal += data.productPrice;
    }
  });
  orderBankPrice.value = bankTotal;
  orderCardPrice.value = cardTotal;

  // 환불승인 금액 산정
  let refundBankTotal = 0;
  data.forEach((doc) => {
    const data = doc.data();
    if (
      typeof data.productPrice === "number" &&
      ["APPROVED_CANCEL", "APPROVED_RETURN"].includes(data.claimStatus ?? "")
    ) {
      refundBankTotal += data.productPrice;
    }
  });
  orderRefundPrice.value = refundBankTotal;
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
