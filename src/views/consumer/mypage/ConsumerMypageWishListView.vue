<template>
  <div class="consumer-mypage-wishlist">
    <div class="menu-container">
      <div>
        <h3>나의 쇼핑 정보</h3>
        <ul>
          <li>
            <router-link to="/mypage/order">주문내역 조회</router-link>
          </li>
        </ul>
      </div>
      <div>
        <h3>활동 정보</h3>
        <ul>
          <li>
            <router-link to="/mypage/wishlist">나의 찜</router-link>
          </li>
        </ul>
      </div>
      <div>
        <h3>나의 정보</h3>
        <ul>
          <li>
            <router-link to="/mypage/profile/edit">
              회원 정보 수정
            </router-link>
          </li>
          <li>
            <button @click="logout">로그아웃</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="product-list-box">
      <h1>나의 찜</h1>
      <hr />
      <div class="filter-container">
        <div class="order-filter-container">
          <div>
            <input
              type="radio"
              name="orderFilter"
              id="popular"
              value="popular"
              style="display: none"
              v-model="orderFilterData"
            />
            <label
              for="popular"
              :style="`color: ${
                orderFilterData == 'popular' ? '#000000' : '#999'
              }`"
              >{{
                orderFilterData == "popular" ? "✅인기상품순" : "인기상품순"
              }}</label
            >
          </div>
          <hr />
          <div>
            <input
              type="radio"
              name="orderFilter"
              id="ascPrice"
              value="ascPrice"
              style="display: none"
              v-model="orderFilterData"
            />
            <label
              for="ascPrice"
              :style="`color: ${
                orderFilterData == 'ascPrice' ? '#000000' : '#999'
              }`"
              >{{
                orderFilterData == "ascPrice" ? "✅낮은가격순" : "낮은가격순"
              }}</label
            >
          </div>
          <hr />
          <div>
            <input
              type="radio"
              name="orderFilter"
              id="descPrice"
              value="descPrice"
              style="display: none"
              v-model="orderFilterData"
            />
            <label
              for="descPrice"
              :style="`color: ${
                orderFilterData == 'descPrice' ? '#000000' : '#999'
              }`"
              >{{
                orderFilterData == "descPrice" ? "✅높은가격순" : "높은가격순"
              }}</label
            >
          </div>
          <hr />
          <div>
            <input
              type="radio"
              name="orderFilter"
              id="newest"
              value="newest"
              style="display: none"
              v-model="orderFilterData"
            />
            <label
              for="newest"
              :style="`color: ${
                orderFilterData == 'newest' ? '#000000' : '#999'
              }`"
              >{{
                orderFilterData == "newest" ? "✅신상품순" : "신상품순"
              }}</label
            >
          </div>
          <hr />
          <div>
            <input
              type="radio"
              name="orderFilter"
              id="review"
              value="review"
              style="display: none"
              v-model="orderFilterData"
            />
            <label
              for="review"
              :style="`color: ${
                orderFilterData == 'review' ? '#000000' : '#999'
              }`"
              >{{
                orderFilterData == "review"
                  ? "✅상품평 많은 순"
                  : "상품평 많은 순"
              }}</label
            >
          </div>
        </div>
        <div class="view-filter-container">
          <div class="view-container">
            <div>
              <input
                type="radio"
                name="viewFilter"
                id="list"
                value="list"
                style="display: none"
                v-model="viewFilterData"
              />
              <label for="list">
                <span
                  class="material-icons-outlined"
                  :style="`color: ${
                    viewFilterData == 'list' ? '#007bff' : '#000000'
                  }`"
                >
                  format_list_bulleted
                </span>
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="viewFilter"
                id="grid"
                value="grid"
                style="display: none"
                v-model="viewFilterData"
              />
              <label for="grid">
                <span
                  class="material-icons-outlined"
                  :style="`color: ${
                    viewFilterData == 'grid' ? '#007bff' : '#000000'
                  }`"
                >
                  grid_view
                </span>
              </label>
            </div>
          </div>
          <div class="pagenation-container"></div>
        </div>
      </div>
      <div
        class="product-list-container"
        :class="viewFilterData"
        v-if="productDatas.length > 0"
      >
        <div class="product" v-for="(item, index) in productDatas" :key="index">
          <router-link :to="`/product?id=${item.id}`">
            <img :src="item.productThumbnailUrl.originalUrl" />
          </router-link>
          <div class="desc-container">
            <div class="name-container">
              <p :style="`background-color: ${index < 3 ? '#007bff' : '#aaa'}`">
                {{ index + 1 }}
              </p>
              <router-link :to="`/product?id=${item.id}`">
                {{ item.productName }}
              </router-link>
            </div>
            <div class="description-container">
              <p class="option">
                {{ item.option2List.join(" / ") }}
              </p>
            </div>
            <div class="footer-container">
              <p>
                등록월
                <span>{{ formatTimestampToYearMonth(item.createdAt) }}</span>
              </p>
              <hr v-if="viewFilterData == 'list'" />
              <p>
                상품리뷰 <span>{{ item.productReviews.length }}</span>
              </p>
              <hr v-if="viewFilterData == 'list'" />
              <hr v-if="viewFilterData == 'grid'" />
              <p>관심</p>
            </div>
          </div>
          <div class="price-container">
            <p class="origin-price">
              {{ item.productSellPrice.toLocaleString() }}원
            </p>
            <div class="sell-price-container">
              <router-link :to="`/product?id=${item.id}`" class="sell-price">
                <span>계좌이체가</span>
                {{ (item.productSellPrice * 0.95).toLocaleString() }}원
              </router-link>
              <router-link :to="`/product?id=${item.id}`" class="sell-price">
                <span>카드결제가</span>
                {{
                  (
                    Math.ceil(
                      ((item.productSellPrice * 0.97) / usdPrice) * 100
                    ) / 100
                  ).toLocaleString()
                }}$
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="order-empty-container" v-else>
        <span class="material-icons-outlined"> error_outline </span>
        <p>관심상품 내역이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref, watch } from 'vue';
import { db, auth } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy, getDoc, doc } from "firebase/firestore";
import { fetchExchangeRate } from '@/lib/paypal';

const usdPrice = ref(0);
const productDatas = ref([]);
const orderFilterData = ref("popular");
const viewFilterData = ref("list");

function formatTimestampToYearMonth(timestamp) {
  const date = timestamp.toDate(); // Firestore Timestamp → JS Date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based → 1-based
  return `${year}.${month}`;
}

async function fetchFilteredData() {
  try {
    switch (orderFilterData.value) {
      case "popular":
        console.log("Fetching Popular Data...");
        productDatas.value.sort((a, b) => {
          // 1️⃣ 우선 productLikeCount 기준 내림차순
          if (b.productLikeCount !== a.productLikeCount) {
            return b.productLikeCount - a.productLikeCount;
          }

          // 2️⃣ 둘 다 0이면 createdAt 기준 최신순
          if (a.productLikeCount === 0 && b.productLikeCount === 0) {
            return b.createdAt - a.createdAt;
          }

          return 0; // 같으면 순서 그대로
        });
        break;
      case "ascPrice":
        console.log("Fetching Ascending Price Data...");
        productDatas.value.sort((a, b) => a.productSellPrice - b.productSellPrice);
        break;
      case "descPrice":
        console.log("Fetching Descending Price Data...");
        productDatas.value.sort((a, b) => b.productSellPrice - a.productSellPrice);
        break;
      case "newest":
        console.log("Fetching Newest Data...");
        productDatas.value.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "review":
        console.log("Fetching Review Data...");
        productDatas.value.sort((a, b) => {
          // 1️⃣ 우선 productLikeCount 기준 내림차순
          if (b.productReviews.length !== a.productReviews.length) {
            return b.productReviews.length - a.productReviews.length;
          }

          // 2️⃣ 둘 다 0이면 createdAt 기준 최신순
          if (a.productReviews.length === 0 && b.productReviews.length === 0) {
            return b.createdAt - a.createdAt;
          }

          return 0; // 같으면 순서 그대로
        });
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

async function fetchProductData() {
  try {
    console.log("Fetching Product Data...");
    const userData = (await getDoc(doc(db, "users", auth.currentUser.uid))).data();
    console.log("User Data: ", userData);
    if (userData && userData.userProductWishList && userData.userProductWishList.length > 0) {
      const product = await getDocs(query(collection(db, "product"), where("isActive", "==", true), where("productId", "in", userData.userProductWishList), orderBy("productLikeCount", "desc")));
      productDatas.value = product.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      productDatas.value = [];
    }
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

onMounted(async () => {
    try {
        await fetchProductData();
        await fetchFilteredData();
        await fetchUSDPrice();
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});

watch(() => orderFilterData.value, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await fetchFilteredData();
    await fetchUSDPrice();
  }
});
</script>

<style lang="scss" scoped>
.consumer-mypage-wishlist {
  padding: 16px 24px;
  margin: auto;
  max-width: 1200px;
  display: flex;
  gap: 24px;

  > .menu-container {
    width: 256px;
    > div {
      &:not(:first-child) {
        margin-top: 36px;
      }
      > ul {
        margin-top: 16px;
        > li {
          color: #666;
          &:not(:first-child) {
            margin-top: 8px;
          }

          > button {
            border: none;
            background: none;
            color: #666;
            font-size: 16px;
            cursor: pointer;
          }
        }
      }
    }
  }

  > .product-list-box {
    flex: 1;
    > hr {
      margin: 16px 0 8px 0;
      border: none;
      border-top: 2px solid black;
    }

    > .filter-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid #000;
      padding: 0 0 8px 0;

      label {
        cursor: pointer;
      }

      > .order-filter-container {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        gap: 8px;

        > hr {
          height: 12px;
        }
      }

      > .view-filter-container {
        display: flex;
        align-items: center;
        gap: 8px;

        > .view-container {
          display: flex;
          > div {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            border: 1px solid #ccc;
            > label {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }

    > .product-list-container {
      margin-top: 8px;
      &.list {
        > .product {
          padding: 8px;
          display: flex;
          gap: 16px;

          &:not(:last-child) {
            border-bottom: 1px solid #efefef;
          }

          > a {
            > img {
              width: 112px;
              height: 112px;
              border-radius: 8px;
              object-fit: cover;
              border: 1px solid #efefef;
              padding: 4px;
            }
          }

          > .desc-container {
            flex: 1;
            align-self: center;
            > .name-container {
              display: flex;
              align-items: center;
              gap: 8px;
              > p {
                color: white;
                font-size: 14px;
                width: 28px;
                height: 28px;
                text-align: center;
                line-height: 28px;
                font-weight: 700;
              }

              > a {
                font-weight: 700;
                font-size: 18px;
              }
            }

            > .description-container {
              margin-top: 20px;
              width: 456px;
              > p {
                font-size: 16px;
                font-weight: 500;
                word-break: keep-all;
              }
            }

            > .footer-container {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-top: 12px;
              > p,
              button {
                color: #999;
                font-size: 12px;
                font-weight: 500;

                > span {
                  color: #007bff;
                }
              }
              > hr {
                width: 1px;
                height: 12px;
              }
            }
          }

          > .price-container {
            align-self: center;
            width: 180px;
            > .origin-price {
              color: #999;
              font-size: 14px;
              font-weight: 500;
              text-decoration: line-through;
              text-align: end;
            }

            > .sell-price-container {
              display: flex;
              flex-direction: column;
              text-align: end;
              > .sell-price {
                font-size: 18px;
                font-weight: 700;
                margin-top: 2px;

                > span {
                  font-size: 14px;
                  color: #007bff;
                  margin-right: 2px;
                }
              }
            }

            > .fee-price {
              font-size: 14px;
              font-weight: 500;
              color: #666;
              text-align: end;
              margin-top: 8px;
            }
          }
        }
      }

      &.grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        > .product {
          padding: 8px;
          border: 1px solid #efefef;

          > a {
            > img {
              width: 100%;
              aspect-ratio: 1 / 1;
              border-radius: 8px;
              object-fit: cover;
              border: 1px solid #efefef;
              padding: 4px;
            }
          }

          > .desc-container {
            margin-top: 8px;
            > .name-container {
              display: flex;
              gap: 8px;
              > p {
                color: white;
                font-size: 12px;
                min-width: 24px !important;
                width: 24px !important;
                height: 24px !important;
                text-align: center;
                line-height: 24px;
                font-weight: 700;
              }

              > a {
                font-weight: 700;
                font-size: 16px;
              }
            }

            > .description-container {
              margin-top: 16px;
              > p {
                font-size: 14px;
                font-weight: 500;
                word-break: keep-all;
              }
            }

            > .footer-container {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-top: 12px;
              > p,
              button {
                color: #999;
                font-size: 12px;
                font-weight: 500;

                > span {
                  color: #007bff;
                }
              }
              > hr {
                width: 1px;
                height: 12px;
              }
            }
          }

          > .price-container {
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            > .origin-price {
              display: none;
            }

            > .sell-price-container {
              display: flex;
              flex-direction: column;
              > .sell-price {
                font-size: 18px;
                font-weight: 700;
                margin-top: 2px;

                > span {
                  font-size: 14px;
                  color: #007bff;
                  margin-right: 2px;
                }
              }
            }
          }
        }
      }
    }

    > .order-empty-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 16px;
      height: 280px;
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
}
</style>
