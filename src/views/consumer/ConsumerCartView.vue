<template>
  <div class="consumer-cart">
    <h1>장바구니</h1>
    <div class="main-container" v-if="cartDatas">
      <div class="product-list-container">
        <div v-for="(item, index) in productDatas" :key="index">
          <hr v-if="index !== 0" />
          <div>
            <img />
            <div>
              <p>{{ item.productName }}</p>
              <p>{{ item.productSellPrice.toLocaleString() }}원</p>
            </div>
            <button @click="removeCart(index)">X</button>
          </div>
          <div>
            <p>옵션 관련 추가 필요</p>
          </div>
          <div>
            <p>수량</p>
            <div>
              <input type="number" min="1" />
              <button>변경</button>
            </div>
          </div>
          <hr />
          <div>
            <p>주문금액</p>
            <strong>0<span>원</span></strong>
          </div>
        </div>
      </div>
      <div class="checkout-container">
        <div>
          <div>
            <p>총 상품금액</p>
            <p>0<span>원</span></p>
          </div>
          <div>
            <p>총 배송비</p>
            <p>결제 시 확인</p>
          </div>
          <hr />
          <div>
            <strong>결제 예정금액</strong>
            <strong>0<span>원</span></strong>
          </div>
        </div>
        <button>상품 주문하기</button>
        <p>배송비는 배송 방법에 따라 상이하여 주문서에서 확인 가능합니다.</p>
      </div>
    </div>
    <div class="empty-container" v-else>
      <span class="material-icons-outlined"> error_outline </span>
      <p>장바구니가 비어있습니다.</p>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref } from 'vue';
import { auth, db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { fetchExchangeRate } from '@/lib/paypal';

const usdPrice = ref(0);
const cartDatas = ref([]);
const productDatas = ref([]);

async function fetchProductData() {
  try {
    console.log("Fetching Product Data...");
    cartDatas.value.forEach(async (product) => {
      const productDoc = await getDoc(doc(db, "product", product.productCode));
      productDatas.value.push({ selectedOptionCode: product.productOptionCode, count: product.count, ...productDoc.data() });
    })
    console.log("Product Data Fetched Successfully!: ", productDatas.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

async function fetchUSDPrice() {
  try {
    console.log("Fetching USD Price...");
    usdPrice.value = await fetchExchangeRate();
    console.log("USD Price Fetched Successfully!: ", usdPrice.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

async function fetchCartData() {
  try {
    console.log("Fetching Cart Data...");
    const userData = await getDoc(doc(db, "users", auth.currentUser.uid));
    cartDatas.value = userData.data().userProductCartList;
    console.log("Cart Data Fetched Successfully!: ", cartDatas.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

onMounted(async () => {
    try {
      await fetchCartData();
      await fetchProductData();
      await fetchUSDPrice();
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});
</script>

<style lang="scss" scoped>
.consumer-cart {
  padding: 16px 24px;
  margin: auto;
  max-width: 1200px;
  min-height: 70vh;

  > h1 {
    text-align: center;
  }

  > .main-container {
    display: flex;
    gap: 48px;
    margin-top: 48px;

    > .product-list-container {
      flex: 1;
    }

    > .checkout-container {
      width: 360px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      > div {
        border: 1px solid black;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        > div {
          display: flex;
          align-items: center;
          justify-content: space-between;

          > p,
          strong {
            font-size: 18px;
            > span {
              margin-left: 4px;
              font-size: 16px;
            }
          }
        }
      }

      > button {
        border: none;
        background: black;
        color: white;
        font-weight: 700;
        font-size: 18px;
        height: 48px;
        border-radius: 4px;
      }

      > p {
        font-size: 14px;
        color: #666;
      }
    }
  }

  > .empty-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
    height: 480px;
    border-bottom: 1px solid #efefef;

    > span {
      font-size: 96px;
      color: #999;
    }

    > p {
      color: #999;
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>
