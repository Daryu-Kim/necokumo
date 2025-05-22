<template>
  <div class="admin-summary-box">
    <div class="admin-summary-item">
      <div class="admin-summary-overlay primary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title primary">입금전</p>
          <p class="admin-summary-value">1,234,567 개</p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay primary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title primary">상품 준비중</p>
          <p class="admin-summary-value">1,234,567 개</p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay primary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title primary">배송 준비중</p>
          <p class="admin-summary-value">1,234,567 개</p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay primary"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title primary">배송 대기</p>
          <p class="admin-summary-value">1,234,567 개</p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay green"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title green">배송 중</p>
          <p class="admin-summary-value">1,234,567 개</p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay yellow"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title yellow">7일 배송완료</p>
          <p class="admin-summary-value">1,234,567 개</p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay red"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title red">입금 전 취소 요청</p>
          <p class="admin-summary-value">1,234,567 개</p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay red"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title red">취소 요청</p>
          <p class="admin-summary-value">1,234,567 개</p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay red"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title red">반품 요청</p>
          <p class="admin-summary-value">1,234,567 개</p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay red"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title red">교환 요청</p>
          <p class="admin-summary-value">1,234,567 개</p>
        </div>
        <span class="material-icons-round">report_problem</span>
      </div>
    </div>
    <div class="admin-summary-item">
      <div class="admin-summary-overlay red"></div>
      <div class="admin-summary-content">
        <div>
          <p class="admin-summary-title red">환불 요청</p>
          <p class="admin-summary-value">1,234,567 개</p>
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
</script>

<style lang="scss" scoped>
.admin-summary-box {
  margin-top: 36px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  > .admin-summary-item {
    height: 120px;
    width: 280px;
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
