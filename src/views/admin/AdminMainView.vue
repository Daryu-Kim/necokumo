<template>
  <div class="content">
    <div class="admin-nav">
      <div class="admin-title-box">
        <span class="material-icons-round">catching_pokemon</span>
        <p class="admin-title">냥이네구름가게<br />관리자 전용 페이지</p>
      </div>
      <hr />
      <router-link to="/admin">
        <div>
          <span class="material-icons-round">home</span>
          <p>메인</p>
        </div>
      </router-link>
      <hr />
      <p class="admin-subtitle">관리 목록</p>
      <div class="admin-menu-box">
        <button
          class="admin-menu-item"
          @click="isOpenedBankList = !isOpenedBankList"
        >
          <div>
            <span class="material-icons-round">pets</span>
            <p>계좌 관리</p>
          </div>
          <span class="material-icons-round" v-if="!isOpenedBankList">
            chevron_right
          </span>
          <span class="material-icons-round" v-else> expand_more </span>
        </button>
        <div v-if="isOpenedBankList" class="admin-menu-sub">
          <h3>현재 준비중입니다.</h3>
          <!-- <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>주문 대시보드</p>
            </div>
          </router-link>
          <router-link to="/admin/list/product" class="admin-menu-item">
            <div>
              <p>전체 주문 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>입금전 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>상품 준비중 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>배송 준비중 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>배송 대기 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>배송 중 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>배송 완료 조회하기</p>
            </div>
          </router-link> -->
        </div>
      </div>
      <div class="admin-menu-box">
        <button
          class="admin-menu-item"
          @click="isOpenedOrderList = !isOpenedOrderList"
        >
          <div>
            <span class="material-icons-round">pets</span>
            <p>주문 관리</p>
          </div>
          <span class="material-icons-round" v-if="!isOpenedOrderList">
            chevron_right
          </span>
          <span class="material-icons-round" v-else> expand_more </span>
        </button>
        <div v-if="isOpenedOrderList" class="admin-menu-sub">
          <h3>고객 주문 관련 메뉴</h3>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>주문 대시보드</p>
            </div>
          </router-link>
          <router-link to="/admin/list/product" class="admin-menu-item">
            <div>
              <p>전체 주문 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>입금전 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>상품 준비중 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>배송 준비중 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>배송 대기 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>배송 중 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>배송 완료 조회하기</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="admin-menu-box">
        <button
          class="admin-menu-item"
          @click="isOpenedClaimList = !isOpenedClaimList"
        >
          <div>
            <span class="material-icons-round">pets</span>
            <p>클레임 관리</p>
          </div>
          <span class="material-icons-round" v-if="!isOpenedClaimList">
            chevron_right
          </span>
          <span class="material-icons-round" v-else> expand_more </span>
        </button>
        <div v-if="isOpenedClaimList" class="admin-menu-sub">
          <h3>고객 클레임 관련 메뉴</h3>
          <router-link to="/admin/list/product" class="admin-menu-item">
            <div>
              <p>입금전 취소 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>취소 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>교환 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>반품 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>환불 관리하기</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="admin-menu-box">
        <button
          class="admin-menu-item"
          @click="isOpenedProductList = !isOpenedProductList"
        >
          <div>
            <span class="material-icons-round">pets</span>
            <p>상품 관리</p>
          </div>
          <span class="material-icons-round" v-if="!isOpenedProductList">
            chevron_right
          </span>
          <span class="material-icons-round" v-else> expand_more </span>
        </button>
        <div v-if="isOpenedProductList" class="admin-menu-sub">
          <h3>상품 정보 관련 메뉴</h3>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>상품 대시보드</p>
            </div>
          </router-link>
          <router-link to="/admin/list/product" class="admin-menu-item">
            <div>
              <p>상품 목록보기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>상품 등록하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>카테고리 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>진열 방식 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>진열 방식 설정하기</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="admin-menu-box">
        <button
          class="admin-menu-item"
          @click="isOpenedConsumerList = !isOpenedConsumerList"
        >
          <div>
            <span class="material-icons-round">pets</span>
            <p>고객 관리</p>
          </div>
          <span class="material-icons-round" v-if="!isOpenedConsumerList">
            chevron_right
          </span>
          <span class="material-icons-round" v-else> expand_more </span>
        </button>
        <div v-if="isOpenedConsumerList" class="admin-menu-sub">
          <h3>고객 관련 메뉴</h3>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>고객 대시보드</p>
            </div>
          </router-link>
          <router-link to="/admin/list/product" class="admin-menu-item">
            <div>
              <p>회원 정보 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>구매액 상위회원 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>회원 등급별 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>회원 적립금 관리하기</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="admin-menu-box">
        <button
          class="admin-menu-item"
          @click="isOpenedPromotionList = !isOpenedPromotionList"
        >
          <div>
            <span class="material-icons-round">pets</span>
            <p>프로모션 관리</p>
          </div>
          <span class="material-icons-round" v-if="!isOpenedPromotionList">
            chevron_right
          </span>
          <span class="material-icons-round" v-else> expand_more </span>
        </button>
        <div v-if="isOpenedPromotionList" class="admin-menu-sub">
          <h3>현재 준비중입니다.</h3>
          <!-- <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>고객 대시보드</p>
            </div>
          </router-link>
          <router-link to="/admin/list/product" class="admin-menu-item">
            <div>
              <p>회원 정보 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>구매액 상위회원 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>회원 등급별 관리하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>회원 적립금 관리하기</p>
            </div>
          </router-link> -->
        </div>
      </div>
      <div class="admin-menu-box">
        <button
          class="admin-menu-item"
          @click="isOpenedSalesList = !isOpenedSalesList"
        >
          <div>
            <span class="material-icons-round">pets</span>
            <p>매출 조회</p>
          </div>
          <span class="material-icons-round" v-if="!isOpenedSalesList">
            chevron_right
          </span>
          <span class="material-icons-round" v-else> expand_more </span>
        </button>
        <div v-if="isOpenedSalesList" class="admin-menu-sub">
          <h3>매출 조회 관련 메뉴</h3>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>일자별 매출 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/product" class="admin-menu-item">
            <div>
              <p>월별 매출 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>기간별 매출 조회하기</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="admin-menu-box">
        <button
          class="admin-menu-item"
          @click="isOpenedCalculateList = !isOpenedCalculateList"
        >
          <div>
            <span class="material-icons-round">pets</span>
            <p>정산 조회</p>
          </div>
          <span class="material-icons-round" v-if="!isOpenedCalculateList">
            chevron_right
          </span>
          <span class="material-icons-round" v-else> expand_more </span>
        </button>
        <div v-if="isOpenedCalculateList" class="admin-menu-sub">
          <h3>정산 조회 관련 메뉴</h3>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>정산 예정액 확인하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>차감 예정액 확인하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/product" class="admin-menu-item">
            <div>
              <p>일자별 정산 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>월별 정산 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>기간별 정산 조회하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>상세 정산 조회하기</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="admin-menu-box">
        <button
          class="admin-menu-item"
          @click="isOpenedStatisticsList = !isOpenedStatisticsList"
        >
          <div>
            <span class="material-icons-round">pets</span>
            <p>통계</p>
          </div>
          <span class="material-icons-round" v-if="!isOpenedStatisticsList">
            chevron_right
          </span>
          <span class="material-icons-round" v-else> expand_more </span>
        </button>
        <div v-if="isOpenedStatisticsList" class="admin-menu-sub">
          <h3>통계 관련 메뉴</h3>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>통계 대시보드</p>
            </div>
          </router-link>
          <router-link to="/admin/list/product" class="admin-menu-item">
            <div>
              <p>일별 매출 통계 보기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>주별 매출 통계 보기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>월별 매출 통계 보기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>판매 상품 순위 보기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>판매 분류 순위 보기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>요일별 그래프 분석하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>시간별 그래프 분석하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>등급별 그래프 분석하기</p>
            </div>
          </router-link>
          <router-link to="/admin/list/category" class="admin-menu-item">
            <div>
              <p>지역별 그래프 분석하기</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="admin-content">
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
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
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

const isOpenedBankList = ref(false);
const isOpenedOrderList = ref(false);
const isOpenedClaimList = ref(false);
const isOpenedProductList = ref(false);
const isOpenedConsumerList = ref(false);
const isOpenedPromotionList = ref(false);
const isOpenedSalesList = ref(false);
const isOpenedCalculateList = ref(false);
const isOpenedStatisticsList = ref(false);

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
.content {
  display: flex;
  > .admin-nav {
    background-color: #e74a3b;
    width: 240px;
    height: 100vh;
    padding: 16px;
    overflow-y: scroll;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    > hr {
      margin: 12px 0;
      border: none;
      border-top: 1px solid rgba($color: #ffffff, $alpha: 0.15);
    }

    > .admin-title-box {
      display: flex;
      align-items: center;

      > span {
        font-size: 48px;
        color: #fff;
      }

      > .admin-title {
        flex: 1;
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
      }
    }

    > p.admin-subtitle {
      font-weight: 700;
      font-size: 12px;
      color: #ffffff66;
      margin-bottom: 12px;
    }

    > .admin-menu-box {
      display: flex;
      gap: 8px;
      flex-direction: column;

      > .admin-menu-sub {
        background-color: #fff;
        padding: 8px 16px;
        border-radius: 8px;

        a {
          border-radius: 8px;
          padding: 8px 12px;

          &:hover {
            background-color: #efefef;
          }
        }

        > h3 {
          font-size: 12px;
          margin-top: 8px;
          padding: 0 12px;
          margin-bottom: 12px;
          color: #808080;
        }

        p {
          font-weight: 500;
          color: black;
        }
      }
    }

    a,
    button {
      background: none;
      border: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      cursor: pointer;

      &:hover {
        span,
        p {
          color: #fff;
        }
      }

      > div {
        display: flex;
        align-items: center;
        gap: 8px;

        > span {
          color: rgba(255, 255, 255, 0.3);
          font-size: 20px;
        }

        > p {
          color: #ffffffaa;
          font-size: 14px;
          font-weight: 700;
        }
      }

      > span {
        font-size: 24px;
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }

  > .admin-content {
    flex: 1;
    padding: 16px 24px;
    overflow-y: scroll;
    height: 100vh;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
    > .admin-shortcut-box {
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

    > .admin-summary-box {
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

    > .admin-sales-box,
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
  }
}
</style>
