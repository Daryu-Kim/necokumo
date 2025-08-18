<template>
  <div class="consumer-order-complete" v-if="orderData">
    <h1>주문완료</h1>
    <hr />
    <div class="complete-container">
      <h2>주문이 완료되었습니다.</h2>
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
      <h2>배송 정보</h2>
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
    <div class="order-email-container">
      <h2>결제정보 수신 이메일 주소</h2>
      <p>{{ orderData.email }}</p>
    </div>
    <hr />
    <div class="order-price-container">
      <h2>결제금액</h2>
      <h2>{{ orderData.totalPrice.toLocaleString() }}<span>원</span></h2>
    </div>
    <hr />
    <div class="payment-info-container">
      <h2>결제수단</h2>
      <div>
        <p>
          {{ orderData.paymentMethod === "bank" ? "무통장입금" : "신용카드" }}
        </p>
        <span>
          {{ orderData.totalPrice.toLocaleString() }}<span>원</span>
        </span>
      </div>
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
  padding: 36px 24px;
  margin: auto;
  max-width: 1200px;

  > h1 {
    text-align: center;
  }

  hr {
    margin: 48px 0;
    border: none;
    border-bottom: 1px solid #efefef;
  }

  > .complete-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    > p {
      margin-top: 8px;
      > span {
        color: #007bff;
        font-weight: 700;
      }
    }

    > div {
      margin-top: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      > a {
        width: 144px;
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
        align-items: center;

        > p {
          line-height: 32px;
        }

        > .title {
          width: 128px;
          color: #666;
        }
      }
    }
  }

  > .order-email-container {
    > p {
      margin-top: 24px;
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
