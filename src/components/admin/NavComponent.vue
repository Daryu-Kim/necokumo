<template>
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
        <router-link to="/admin/order/dashboard" class="admin-menu-item">
          <div>
            <p>주문 대시보드</p>
          </div>
        </router-link>
        <router-link to="/admin/order/list" class="admin-menu-item">
          <div>
            <p>전체 주문 조회하기</p>
          </div>
        </router-link>
        <router-link
          to="/admin/order/list/before-deposit"
          class="admin-menu-item"
        >
          <div>
            <p>입금전 관리하기</p>
          </div>
        </router-link>
        <router-link
          to="/admin/order/list/payment-completed"
          class="admin-menu-item"
        >
          <div>
            <p>결제완료 관리하기</p>
          </div>
        </router-link>
        <router-link
          to="/admin/order/list/preparing-product"
          class="admin-menu-item"
        >
          <div>
            <p>상품 준비중 관리하기</p>
          </div>
        </router-link>
        <router-link
          to="/admin/order/list/preparing-delivery"
          class="admin-menu-item"
        >
          <div>
            <p>배송 준비중 관리하기</p>
          </div>
        </router-link>
        <router-link
          to="/admin/order/list/shipping-progress"
          class="admin-menu-item"
        >
          <div>
            <p>배송 중 관리하기</p>
          </div>
        </router-link>
        <router-link
          to="/admin/order/list/delivery-completed"
          class="admin-menu-item"
        >
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
        <router-link to="/admin/claim/before-deposit" class="admin-menu-item">
          <div>
            <p>입금전 취소 관리하기</p>
          </div>
        </router-link>
        <router-link to="/admin/claim/cancelled" class="admin-menu-item">
          <div>
            <p>취소 관리하기</p>
          </div>
        </router-link>
        <router-link to="/admin/claim/exchange" class="admin-menu-item">
          <div>
            <p>교환 관리하기</p>
          </div>
        </router-link>
        <router-link to="/admin/claim/returned" class="admin-menu-item">
          <div>
            <p>반품 관리하기</p>
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
        <router-link to="/admin/product/dashboard" class="admin-menu-item">
          <div>
            <p>상품 대시보드</p>
          </div>
        </router-link>
        <router-link to="/admin/product/list" class="admin-menu-item">
          <div>
            <p>상품 목록보기</p>
          </div>
        </router-link>
        <router-link to="/admin/product/add" class="admin-menu-item">
          <div>
            <p>상품 등록하기</p>
          </div>
        </router-link>
        <router-link to="/admin/product/category" class="admin-menu-item">
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
        <router-link to="/admin/product/deleted-list" class="admin-menu-item">
          <div>
            <p>삭제 상품 목록보기</p>
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
        <router-link to="/admin/consumer/dashboard" class="admin-menu-item">
          <div>
            <p>고객 대시보드</p>
          </div>
        </router-link>
        <router-link to="/admin/consumer/list" class="admin-menu-item">
          <div>
            <p>회원 정보 조회하기</p>
          </div>
        </router-link>
        <router-link to="/admin/consumer/add" class="admin-menu-item">
          <div>
            <p>회원 정보 등록하기</p>
          </div>
        </router-link>
        <router-link to="/admin/consumer/point" class="admin-menu-item">
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
</template>

<script setup lang="js">
import { ref } from "vue";

const isOpenedBankList = ref(false);
const isOpenedOrderList = ref(false);
const isOpenedClaimList = ref(false);
const isOpenedProductList = ref(false);
const isOpenedConsumerList = ref(false);
const isOpenedPromotionList = ref(false);
const isOpenedSalesList = ref(false);
const isOpenedCalculateList = ref(false);
const isOpenedStatisticsList = ref(false);
</script>

<style lang="scss" scoped>
.admin-nav {
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
</style>
