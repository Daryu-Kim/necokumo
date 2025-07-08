<template>
  <div class="consumer-cart">
    <h1>장바구니</h1>
    <div class="main-container" v-if="cartDatas.length > 0">
      <div class="product-list-container">
        <div v-for="(item, index) in productDatas" :key="index">
          <hr class="section" v-if="index !== 0" />
          <div class="desc-container">
            <img :src="item.productThumbnailUrl.originalUrl" />
            <div>
              <p class="name">{{ item.productName }}</p>
              <p class="sell-price">
                <span>계좌이체가</span>
                {{ (item.productSellPrice * 0.95).toLocaleString() }}원
              </p>
              <p class="sell-price">
                <span>카드결제가</span>
                {{
                  (
                    Math.ceil(
                      ((item.productSellPrice * 0.97) / usdPrice) * 100
                    ) / 100
                  ).toLocaleString()
                }}$
              </p>
            </div>
            <button @click="removeCart(index)">
              <span class="material-icons-outlined"> close </span>
            </button>
          </div>
          <div class="option-container">
            <p>
              └ [옵션:
              <span>
                {{
                  item.optionList.find(
                    (option) =>
                      option.optionCodeCafe24 === item.selectedOptionCode
                  )?.optionName || "옵션 없음"
                }} </span
              >]
            </p>
          </div>
          <div class="count-container">
            <p>수량</p>
            <div>
              <input
                type="number"
                min="1"
                v-model="item.count"
                @change="changeOptionCount(index)"
              />
            </div>
          </div>
          <hr />
          <div class="option-price-container">
            <p>주문금액</p>
            <strong>
              {{ (item.productSellPrice * item.count * 0.95).toLocaleString()
              }}<span>원</span> ({{
                (
                  Math.ceil(
                    ((item.productSellPrice * item.count * 0.97) / usdPrice) *
                      100
                  ) / 100
                ).toLocaleString()
              }}<span>$</span>)
            </strong>
          </div>
        </div>
      </div>
      <div class="checkout-container">
        <div>
          <div>
            <p>총 상품금액</p>
            <p>
              {{ totalBankSellPrice.toLocaleString() }}<span>원</span><br />({{
                totalCardSellPrice.toLocaleString()
              }}<span>$</span>)
            </p>
          </div>
          <div>
            <p>총 배송비</p>
            <p>결제 시 확인</p>
          </div>
          <hr />
          <div>
            <strong>결제 예정금액</strong>
            <strong>
              {{ totalBankSellPrice.toLocaleString() }}<span>원</span><br />({{
                totalCardSellPrice.toLocaleString()
              }}<span>$</span>)
            </strong>
          </div>
        </div>
        <button @click="buyNow">상품 주문하기</button>
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
import { onMounted, ref, computed } from 'vue';
import { auth, db } from "@/lib/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { fetchExchangeRate } from '@/lib/paypal';
import { useRouter } from 'vue-router';

const usdPrice = ref(0);
const cartDatas = ref([]);
const productDatas = ref([]);

const router = useRouter();

const totalBankSellPrice = computed(() => {
  return productDatas.value.reduce((acc, curr) => acc + (curr.productSellPrice * curr.count * 0.95), 0);
});

const totalCardSellPrice = computed(() => {
  return productDatas.value.reduce((acc, curr) => acc + (Math.ceil(
    ((curr.productSellPrice * curr.count * 0.97) / usdPrice.value) *
      100
  ) / 100), 0);
});

async function buyNow() {
  try {
    console.log("Buying now...");
    const itemsToBuy = [];

    for (const selected of cartDatas.value) {
      const product = await (await getDoc(doc(db, "product", selected.productCode))).data();
      itemsToBuy.push({
        productCode: selected.productCode,
        optionName: selected.optionName,
        price: product.productSellPrice,
        count: selected.count,
      });
    }

    if (itemsToBuy.length === 0) {
      alert("구매할 옵션이 없습니다.");
      return;
    }

    console.log("Items to buy:", itemsToBuy);
    console.log("Cart Data:", cartDatas.value);

    router.push({
      path: "/checkout",
      state: {
        orderItems: itemsToBuy,
        query: "cart",
      },
    });
  } catch (error) {
    console.error("Error buying now:", error);
    alert("구매 실패하였습니다. 다시 시도해주세요.");
  }
}

async function changeOptionCount(index) {
  try {
    const updatedItem = productDatas.value[index];

    const cartItem = cartDatas.value.find(
      (c) =>
        c.productCode === updatedItem.productId &&
        c.productOptionCode === updatedItem.selectedOptionCode
    );

    if (cartItem) {
      cartItem.count = updatedItem.count;
    }

    await updateCartData();
    console.log("Cart updated for item:", updatedItem.productName);
  } catch (error) {
    console.error("Error updating cart:", error);
  }
}

async function removeCart(index) {
  if (confirm("해당 품목을 삭제하시겠습니까?")) {
    cartDatas.value.splice(index, 1);
    await updateCartData();
    alert("해당 품목이 삭제되었습니다!");
    window.location.reload();
  } else {
    return;
  }
}

async function updateCartData() {
  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    userProductCartList: cartDatas.value,
  });
};

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

      > div {
        > hr {
          margin: 16px 0;
          border: none;
          border-top: 1px solid #efefef;
          &.section {
            margin: 24px 0;
            border-top: 1px solid #999;
          }
        }
        > .desc-container {
          display: flex;
          gap: 16px;

          > img {
            width: 144px;
            height: 144px;
            border-radius: 8px;
            object-fit: cover;
            border: 1px solid #efefef;
            padding: 4px;
          }

          > div {
            flex: 1;

            > .name {
              font-weight: 700;
              font-size: 18px;
              margin-bottom: 8px;
            }

            > .sell-price {
              line-height: 24px;

              > span {
                font-weight: 700;
                font-size: 16px;
                color: #007bff;
              }
            }
          }

          > button {
            width: 24px;
            height: 24px;
            border: none;
            background: none;
            font-size: 18px;
            cursor: pointer;
          }
        }

        > .option-container {
          background: #efefef;
          margin-top: 16px;
          padding: 12px;

          > p {
            font-size: 14px;
            > span {
              font-weight: 700;
              color: #007bff;
            }
          }
        }

        > .count-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 16px;

          > div {
            display: flex;
            align-items: center;
            gap: 8px;
            > input {
              width: 64px;
              padding: 8px;
              font-size: 14px;
              text-align: center;
              border: 1px solid #999;
            }
          }
        }

        > .option-price-container {
          display: flex;
          align-items: center;
          justify-content: space-between;

          > strong {
            > span {
              font-weight: 400;
              margin-left: 2px;
            }
          }
        }
      }
    }

    > .checkout-container {
      width: 326x;
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
            text-align: end;
            line-height: 24px;
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
        cursor: pointer;
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
