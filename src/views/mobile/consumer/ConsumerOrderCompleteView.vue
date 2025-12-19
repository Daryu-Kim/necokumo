<template>
  <div class="consumer-order-complete" v-if="orderData">
    <h2>주문완료</h2>
    <hr />
    <div class="complete-container">
      <h3>주문이 완료되었습니다.</h3>
      <p>
        주문번호: <span>{{ orderData.orderId }}</span>
      </p>
      <div>
        <router-link
          class="outlined"
          :to="`/mypage/order/detail?id=${orderData.orderId}`"
        >
          주문 상세보기
        </router-link>
        <router-link class="primary" to="/">계속 쇼핑하기</router-link>
      </div>
    </div>
    <hr />
    <div class="delivery-info-container">
      <h3>배송 정보</h3>
      <div>
        <div>
          <p class="title">받는 분</p>
          <p class="content">{{ orderData.name }} / {{ orderData.phone }}</p>
        </div>
        <div>
          <p class="title">배송지</p>
          <p class="content">
            ({{ orderData.postCode }}) {{ orderData.address1 }}
            {{ orderData.address2 }}
          </p>
        </div>
        <div>
          <p class="title">배송 메시지</p>
          <p class="content">
            {{
              orderData.deliveryMessage.length > 0
                ? orderData.deliveryMessage
                : "-"
            }}
          </p>
        </div>
      </div>
    </div>
    <hr />
    <div class="payment-info-container">
      <h3>결제수단</h3>
      <div>
        <p>
          {{ orderData.paymentMethod === "bank" ? "무통장입금" : "신용카드" }}
        </p>
        <span>
          {{ orderData.totalPrice.toLocaleString() }}<span>원</span>
        </span>
      </div>
    </div>
    <hr />
    <div class="order-price-container">
      <h3>결제금액</h3>
      <h3>{{ orderData.totalPrice.toLocaleString() }}<span>원</span></h3>
    </div>
  </div>
</template>

<script setup lang="js">
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';

const orderData = ref(null);

onMounted(async () => {
  const data = (await getDoc(doc(db, "order", history.state?.orderId))).data();
  orderData.value = data;
});
</script>

<style lang="scss" scoped>
.consumer-order-complete {
  padding: 16px 24px;

  > h2 {
    text-align: center;
  }

  hr {
    margin: 16px 0;
    border: none;
    border-bottom: 1px solid #efefef;
  }

  > .complete-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;

    > p {
      margin-top: 8px;
      font-size: 14px;
      > span {
        color: #007bff;
        font-weight: 700;
      }
    }

    > div {
      width: 100%;
      margin-top: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      > a {
        flex: 1;
        height: 42px;
        line-height: 42px;
        text-align: center;
        &.outlined {
          border: 1px solid #999;
          border-radius: 4px;
        }
        &.primary {
          background-color: #007bff;
          color: white;
          border-radius: 4px;
        }
      }
    }
  }

  > .delivery-info-container {
    > div {
      margin-top: 24px;
      > div {
        display: flex;
        &:not(:first-child) {
          margin-top: 8px;
        }

        > p {
          line-height: 24px;
          font-size: 14px;
        }

        > .title {
          min-width: 72px;
          color: #666;
        }
      }
    }
  }

  > .order-price-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > h2 {
      color: #007bff;

      > span {
        font-weight: 500;
        font-size: 16px;
        margin-left: 4px;
      }
    }
  }

  > .payment-info-container {
    > div {
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      > span {
        font-weight: 700;
        > span {
          font-weight: 500;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
