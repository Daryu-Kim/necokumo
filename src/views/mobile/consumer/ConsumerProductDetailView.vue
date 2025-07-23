<template>
  <div class="consumer-product-detail" v-if="productData">
    <div class="product-info-container">
      <img :src="productData.productThumbnailUrl.originalUrl" />
      <div>
        <h2>{{ productData.productName }}</h2>
        <hr />
        <div>
          <div>
            <p class="info-title grey">정상판매가</p>
            <p class="info-content grey">
              {{ productData.productSellPrice.toLocaleString() }}원
            </p>
          </div>
          <div>
            <p class="info-title bold">계좌이체가</p>
            <p class="info-content bold">
              {{ (productData.productSellPrice * 0.95).toLocaleString() }}원
            </p>
          </div>
          <div>
            <p class="info-title bold">카드결제가</p>
            <p class="info-content bold">
              {{
                (
                  Math.ceil(
                    ((productData.productSellPrice * 0.97) / usdPrice) * 100
                  ) / 100
                ).toLocaleString()
              }}$
            </p>
          </div>
          <div>
            <p class="info-title">배송비</p>
            <p class="info-content">
              <span class="blue bold">
                50,000원 ({{
                  (Math.ceil((50000 / usdPrice) * 100) / 100).toLocaleString()
                }}$)
              </span>
              이상 결제 시 배송비 무료
            </p>
          </div>
          <hr />
          <div>
            <p class="info-title">옵션</p>
            <select class="info-content" v-model="option">
              <option value="">- [필수] 옵션을 선택해 주세요 -</option>
              <option disabled>--------------------</option>
              <option
                v-for="(item, index) in productData.option2List"
                :key="index"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </div>
          <div
            class="selected-option-container"
            v-if="selectedOptions.length > 0"
          >
            <div v-for="(item, index) in selectedOptions" :key="index">
              <hr />
              <div class="option-container">
                <div class="option-info-container">
                  <div class="option-name-container">
                    <p class="product-name">{{ productData.productName }}</p>
                    <p class="option-name" style="color: #999">
                      - {{ item.optionName }}
                    </p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    max="99"
                    v-model.number="item.count"
                    @blur="updateCount(index)"
                  />
                  <button type="button" @click="removeOption(index)">
                    <span class="material-icons-outlined">clear</span>
                  </button>
                </div>
                <p>
                  {{
                    (
                      productData.productSellPrice *
                      item.count *
                      0.95
                    ).toLocaleString()
                  }}원<br />({{
                    (
                      Math.ceil(
                        ((productData.productSellPrice * item.count * 0.97) /
                          usdPrice) *
                          100
                      ) / 100
                    ).toLocaleString()
                  }}$)
                </p>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <p class="info-title>">TOTAL</p>
            <p class="info-content" style="text-align: end; font-weight: 700">
              {{ totalBankPrice.toLocaleString() }}원 ({{
                totalCardDollar.toLocaleString()
              }}$)
              <span style="color: #007bff">
                [{{ totalCount.toLocaleString() }}개]
              </span>
            </p>
          </div>
          <div>
            <button type="button" class="black" style="flex: 2" @click="buyNow">
              BUY IT NOW
            </button>
            <button class="white" style="flex: 1" @click="addCart">CART</button>
            <button
              class="white"
              style="flex: 1"
              @click="addWishList"
              v-if="!isWishList"
              type="button"
            >
              <span class="material-icons-outlined">favorite_border</span>
            </button>
            <button
              class="white"
              style="flex: 1"
              @click="removeWishList"
              v-else
              type="button"
            >
              <span class="material-icons-outlined">favorite</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr v-if="!productData.isSellCafe24" />
    <h3
      v-if="!productData.isSellCafe24"
      style="text-align: center; word-break: keep-all"
    >
      본 상품은 [온라인 판매금지] 상품으로 공식몰에서는 구매가 불가하며, 이
      쇼핑몰에서만 구매 가능한 상품입니다!
    </h3>
    <hr />
    <div class="product-detail-container">
      <img
        :src="item.imageOriginUrl"
        v-for="(item, index) in productData.productDetailUrl"
        :key="index"
      />
    </div>
  </div>
</template>

<script setup lang="js">
import { nextTick, onMounted, ref, watch, computed } from 'vue';
import { auth, db } from "@/lib/firebase";
import { getDoc, doc, setDoc, arrayUnion, increment, arrayRemove } from "firebase/firestore";
import { useRoute } from 'vue-router';
import { fetchExchangeRate } from '@/lib/paypal';
import router from '@/router';

const usdPrice = ref(0);
const productData = ref(null);
const option = ref("");
const selectedOptions = ref([]);
const userData = ref(null);
const isWishList = ref(false);

const totalCount = computed(() =>
  selectedOptions.value.reduce((sum, item) => sum + item.count, 0)
);

const totalBankPrice = computed(() =>
  selectedOptions.value.reduce(
    (sum, item) => sum + productData.value.productSellPrice * item.count * 0.95,
    0
  )
);

const totalCardDollar = computed(() => {
  const total = selectedOptions.value.reduce(
    (sum, item) => sum + productData.value.productSellPrice * item.count * 0.97,
    0
  );
  return Math.ceil((total / usdPrice.value) * 100) / 100;
});

const route = useRoute();

async function fetchWishListData() {
  try {
    if (userData.value) {
      console.log("Fetching wishlist data...");
      isWishList.value = userData.value.userProductWishList.includes(route.query.id);
      console.log("Wishlist data fetched successfully.", isWishList.value);
    }
  } catch (error) {
    console.error("Error fetching wishlist data:", error);
    alert("위시리스트 로딩 실패하였습니다. 다시 시도해주세요.");
  }
}

async function buyNow() {
  try {
    console.log("Buying now...");
    const itemsToBuy = [];

    for (const selected of selectedOptions.value) {
      itemsToBuy.push({
        productCode: route.query.id,
        optionName: selected.optionName,
        count: selected.count,
      });
    }

    if (itemsToBuy.length === 0) {
      alert("구매할 옵션이 없습니다.");
      return;
    }

    router.push({
      path: "/checkout",
      state: {
        orderItems: itemsToBuy,
        query: "now",
      },
    });
  } catch (error) {
    console.error("Error buying now:", error);
    alert("구매 실패하였습니다. 다시 시도해주세요.");
  }
}

async function addCart() {
  try {
    console.log("Adding to Cart...");
    if (selectedOptions.value.length === 0) {
      alert("구매할 옵션이 없습니다.");
      return;
    }
    const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const userData = userSnap.data();
    const cartList = userData.userProductCartList || [];

    selectedOptions.value.forEach((selected) => {
      console.log("Adding to cart:", selected);

      const existingItem = cartList.find(
        (item) =>
          item.productCode === route.query.id &&
          item.optionName === selected.optionName
      );

      if (existingItem) {
        existingItem.count += selected.count;
      } else {
        cartList.push({
          productCode: route.query.id,
          optionName: selected.optionName,
          count: selected.count,
        });
      }
    });

    await setDoc(userSnap.ref, {
      userProductCartList: cartList,
    }, { merge: true });

    if (confirm("장바구니에 상품을 추가했습니다.\n장바구니로 이동하시겠습니까?")) {
      router.push("/cart");
    }

    selectedOptions.value = [];
    console.log("Added to Cart Successfully!");
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
}

async function addWishList() {
  try {
    console.log("Adding to Wish List...");
    const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const userData = userSnap.data();
    const wishList = userData.userProductWishList || [];

    if (wishList.includes(route.query.id)) {
      console.log("Product already in Wish List!");
      alert("이미 찜한 상품입니다.");
      return;
    } else {
      await setDoc(userSnap.ref, {
        userProductWishList: arrayUnion(route.query.id),
      }, { merge: true });
      await setDoc(doc(db, "product", route.query.id), {
        productLikeCount: increment(1),
      }, { merge: true });
      alert("찜한 상품으로 추가했습니다.");
      await fetchWishListData();
      window.location.reload();
    }

    console.log("Added to Wish List Successfully!");
  } catch (error) {
    console.error('Failed to add to wish list:', error);
  }
}

async function removeWishList() {
  try {
    console.log("Removing to Wish List...");
    const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const userData = userSnap.data();
    const wishList = userData.userProductWishList || [];

    if (!wishList.includes(route.query.id)) {
      console.log("Product already in Wish List!");
      alert("이미 찜 취소한 상품입니다.");
      return;
    } else {
      await setDoc(userSnap.ref, {
        userProductWishList: arrayRemove(route.query.id),
      }, { merge: true });
      await setDoc(doc(db, "product", route.query.id), {
        productLikeCount: increment(-1),
      }, { merge: true });
      alert("상품 찜을 취소하였습니다.");
      await fetchWishListData();
      window.location.reload();
    }

    console.log("Removed to Wish List Successfully!");
  } catch (error) {
    console.error('Failed to add to wish list:', error);
  }
}

function updateCount(index) {
  const updatedItem = selectedOptions.value[index];

  const count = Number(updatedItem.count);
  if (!Number.isInteger(count) || count <= 0) {
    console.warn("수량은 1 이상의 정수여야 합니다.");
    updatedItem.count = 1; // 기본값으로 되돌림
  }
  if (count > 99) {
    console.warn("수량은 99개 이하여야 합니다.");
    updatedItem.count = 99; // 99 이하로 제한
  }
}

function removeOption(index) {
  selectedOptions.value.splice(index, 1);
}

async function fetchProductData() {
  try {
    console.log("Fetching Product Data...");
    const product = await getDoc(doc(db, "product", route.query.id));
    productData.value = { id: product.id, ...product.data() };
    console.log("Product Data Fetched Successfully!: ", productData.value);
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

async function fetchUserData() {
  try {
    console.log("Fetching User Data...");
    const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
    userData.value = userSnap.data();
    console.log("User Data Fetched Successfully!: ", userData.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

onMounted(async () => {
  try {
    await fetchProductData();
    await fetchUSDPrice();
    await fetchUserData();
    await fetchWishListData();
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

watch(() => option.value, async (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== "") {
    console.log("Option Selected: ", newVal);
    const existingOption = selectedOptions.value.find(
      (item) => item.optionName === newVal
    );

    if (existingOption) {
      alert("이미 선택된 옵션이 있습니다!");
    } else {
      selectedOptions.value.push({
        optionName: newVal,
        count: 1,
      });
    }
  }
  await nextTick();
  option.value = "";
});
</script>

<style lang="scss" scoped>
.consumer-product-detail {
  padding: 16px 24px;

  > .product-info-container {
    > img {
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 8px;
      object-fit: cover;
      border: 1.5px solid #efefef;
      padding: 4px;
    }

    > div {
      margin-top: 24px;
      hr {
        margin: 12px 0;
        border: none;
        border-bottom: 1px solid #efefef;
      }

      > div {
        > div {
          padding: 12px 0;
          display: flex;
          align-items: center;
          width: 100%;
          gap: 8px;

          .bold {
            font-weight: 700;
          }

          .grey {
            color: #999;
          }

          .blue {
            color: #007bff;
          }

          > .info-title {
            flex: 1;
            font-size: 16px;
          }

          > .info-content {
            flex: 3;
            font-size: 18px;
          }

          > select {
            height: 44px;
            padding: 0 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
            appearance: none;
            background: url("data:image/svg+xml;charset=UTF-8,%3Csvg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")
              no-repeat right 12px center;
            background-size: 24px 24px;
          }

          > button {
            width: 100%;
            height: 48px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            &.black {
              background-color: black;
              color: white;
            }
            &.white {
              background-color: white;
              color: black;
              border: 1px solid #ccc;
            }
          }
        }

        > .selected-option-container {
          display: block;
          padding: 0;

          > div {
            > .option-container {
              margin-top: 12px;
              display: flex;
              align-items: center;

              > .option-info-container {
                flex: 3;
                display: flex;
                align-items: center;
                gap: 8px;

                > div {
                  > p {
                    font-size: 16px;
                  }

                  > .option-name {
                    margin-top: 4px;
                  }
                }

                input {
                  width: 72px;
                  height: 36px;
                  text-align: center;
                  font-size: 16px;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                }

                > button {
                  padding: 4px;
                  border: none;
                  background: none;
                  cursor: pointer;
                }
              }

              > p {
                font-weight: 700;
                flex: 1;
                text-align: end;
                font-size: 16px;
                line-height: 24px;
              }
            }
          }
        }
      }
    }
  }

  > hr {
    margin: 48px 0;
    border: none;
    border-bottom: 1px solid #efefef;
  }

  > .product-detail-container {
    display: flex;
    flex-direction: column;
    > img {
      width: 100%;
    }
  }
}
</style>
