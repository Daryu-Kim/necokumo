<template>
  <div class="admin-summary-box">
    <div class="admin-summary-item">
      <div class="admin-summary-overlay primary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title primary">결제전</p>
          <p class="admin-summary-value">
            {{ beforeDepositCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay primary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title primary">결제완료</p>
          <p class="admin-summary-value">
            {{ paymentCompletedCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay primary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title primary">상품 준비중</p>
          <p class="admin-summary-value">
            {{ preparingProductCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay primary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title primary">배송 준비중</p>
          <p class="admin-summary-value">
            {{ preparingDeliveryCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay green"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title green">배송 중</p>
          <p class="admin-summary-value">
            {{ shippingProgressCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay yellow"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title yellow">배송완료</p>
          <p class="admin-summary-value">
            {{ deliveryCompleted.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay red"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title red">취소 요청</p>
          <p class="admin-summary-value">
            {{ requestCancelCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay red"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title red">교환 요청</p>
          <p class="admin-summary-value">
            {{ requestExchangeCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay red"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title red">반품 요청</p>
          <p class="admin-summary-value">
            {{ requestReturnCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay info"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title info">취소 처리중</p>
          <p class="admin-summary-value">
            {{ processingCancelCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay info"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title info">교환 처리중</p>
          <p class="admin-summary-value">
            {{ processingExchangeCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay info"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title info">반품 처리중</p>
          <p class="admin-summary-value">
            {{ processingReturnCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay secondary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title secondary">취소 보류</p>
          <p class="admin-summary-value">
            {{ holdCancelCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay secondary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title secondary">교환 보류</p>
          <p class="admin-summary-value">
            {{ holdExchangeCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay secondary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title secondary">반품 보류</p>
          <p class="admin-summary-value">
            {{ holdReturnCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay green"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title green">취소 승인</p>
          <p class="admin-summary-value">
            {{ approvedCancelCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay green"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title green">교환 승인</p>
          <p class="admin-summary-value">
            {{ approvedExchangeCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay green"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title green">반품 승인</p>
          <p class="admin-summary-value">
            {{ approvedReturnCount.toLocaleString() }} 개
          </p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
  </div>
  <div class="admin-sales-box">
    <div class="admin-sales-header">
      <h3>일자별 매출</h3>
    </div>
    <hr />
    <div class="admin-sales-body">
      <Line :data="salesChartData" :options="salesChartOptions" />
    </div>
  </div>
  <div class="admin-calculate-box">
    <div class="admin-calculate-header">
      <h3>매출 / 정산</h3>
    </div>
    <hr />
    <div class="admin-calculate-body">
      <div>
        <p>오늘 매출</p>
        <p>1,234,567 원</p>
      </div>
      <div>
        <p>이번 주 매출</p>
        <p>1,234,567 원</p>
      </div>
      <div>
        <p>이번 달 매출</p>
        <p>1,234,567 원</p>
      </div>
      <div>
        <p>이번 달 정산 예정액</p>
        <p>1,234,567 원</p>
      </div>
      <div>
        <p>이번 달 차감 예정액</p>
        <p>1,234,567 원</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Colors,
} from "chart.js";
import { onMounted, ref } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const beforeDepositCount = ref(0);
const paymentCompletedCount = ref(0);
const preparingProductCount = ref(0);
const preparingDeliveryCount = ref(0);
const shippingProgressCount = ref(0);
const deliveryCompleted = ref(0);

const requestCancelCount = ref(0);
const processingCancelCount = ref(0);
const holdCancelCount = ref(0);
const approvedCancelCount = ref(0);

const requestExchangeCount = ref(0);
const processingExchangeCount = ref(0);
const holdExchangeCount = ref(0);
const approvedExchangeCount = ref(0);

const requestReturnCount = ref(0);
const processingReturnCount = ref(0);
const holdReturnCount = ref(0);
const approvedReturnCount = ref(0);

const salesChartOptions = {
  responsive: true,
};
const salesChartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      data: [1327000, 1235678, 800000, 430000, 1640000, 340000, 240000],
    },
  ],
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Colors
);

onMounted(async () => {
  // 주문 내역 카운트
  const productOrderRefs = await getDocs(collection(db, "productOrder"));
  const productOrderDatas = productOrderRefs.docs.map((doc) => doc.data());

  beforeDepositCount.value = productOrderDatas.filter(
    (order) => order.status === "BEFORE_PAYMENT"
  ).length;

  paymentCompletedCount.value = productOrderDatas.filter(
    (order) => order.status === "PAYMENT_COMPLETED"
  ).length;

  preparingProductCount.value = productOrderDatas.filter(
    (order) => order.status === "PREPARING_PRODUCT"
  ).length;

  preparingDeliveryCount.value = productOrderDatas.filter(
    (order) => order.status === "PREPARING_DELIVERY"
  ).length;

  shippingProgressCount.value = productOrderDatas.filter(
    (order) => order.status === "SHIPPING_PROGRESS"
  ).length;

  deliveryCompleted.value = productOrderDatas.filter(
    (order) => order.status === "DELIVERY_COMPLETED"
  ).length;

  requestCancelCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "CANCELLED" && order.claimStatus === "REQUEST_CANCEL"
  ).length;

  processingCancelCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "CANCELLED" && order.claimStatus === "PROCESSING_CANCEL"
  ).length;

  holdCancelCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "CANCELLED" && order.claimStatus === "HOLD_CANCEL"
  ).length;

  approvedCancelCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "CANCELLED" && order.claimStatus === "APPROVED_CANCEL"
  ).length;

  requestExchangeCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "EXCHANGE" && order.claimStatus === "REQUEST_EXCHANGE"
  ).length;

  processingExchangeCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "EXCHANGE" && order.claimStatus === "PROCESSING_EXCHANGE"
  ).length;

  holdExchangeCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "EXCHANGE" && order.claimStatus === "HOLD_EXCHANGE"
  ).length;

  approvedExchangeCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "EXCHANGE" && order.claimStatus === "APPROVED_EXCHANGE"
  ).length;

  requestReturnCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "RETURNED" && order.claimStatus === "REQUEST_RETURN"
  ).length;

  processingReturnCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "RETURNED" && order.claimStatus === "PROCESSING_RETURN"
  ).length;

  holdReturnCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "RETURNED" && order.claimStatus === "HOLD_RETURN"
  ).length;

  approvedReturnCount.value = productOrderDatas.filter(
    (order) =>
      order.status === "RETURNED" && order.claimStatus === "APPROVED_RETURN"
  ).length;
});
</script>

<style lang="scss" scoped>
.admin-summary-box {
  margin-top: 36px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  > .admin-summary-item {
    height: 120px;
    width: 304px;
    position: relative;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.2);
    border-radius: 8px;

    > .admin-summary-overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      border-radius: 8px;

      &.primary {
        background-color: #007bff;
      }

      &.green {
        background-color: #28a745;
      }

      &.yellow {
        background-color: #ffc107;
      }

      &.red {
        background-color: #dc3545;
      }

      &.secondary {
        background-color: #333;
      }

      &.info {
        background-color: #17a2b8;
      }
    }

    > .admin-summary-content {
      background-color: #fff;
      position: absolute;
      width: calc(100% - 4px);
      right: 0;
      height: 100%;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      gap: 8px;

      > div {
        > .admin-summary-title {
          font-weight: 700;
          font-size: 24px;
        }

        > .admin-summary-value {
          margin-top: 8px;
          font-size: 18px;
        }
      }

      > span {
        font-size: 64px;
        color: rgba(0, 0, 0, 0.25);
      }

      .primary {
        color: #007bff;
      }

      .green {
        color: #28a745;
      }

      .yellow {
        color: #ffc107;
      }

      .red {
        color: #dc3545;
      }

      .secondary {
        color: #333;
      }

      .info {
        color: #17a2b8;
      }
    }
  }
}

.admin-sales-box,
.admin-calculate-box {
  border-radius: 8px;
  margin-top: 36px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);

  > .admin-sales-header,
  .admin-calculate-header {
    padding: 16px 24px;

    > h3 {
      font-weight: 700;
      font-size: 18px;
      color: #dc3545;
    }
  }

  > hr {
    border: none;
    border-top: solid rgba(0, 0, 0, 0.15);
  }

  > .admin-sales-body,
  .admin-calculate-body {
    padding: 16px 24px;

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
    }
  }
}
</style>
