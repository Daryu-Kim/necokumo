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
            <router-link to="/mypage/edit">회원 정보 수정</router-link>
          </li>
          <li>
            <button @click="resetPassword">비밀번호 재설정</button>
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
              id="descView"
              value="descView"
              style="display: none"
              v-model="orderFilterData"
            />
            <label
              for="descView"
              :style="`color: ${
                orderFilterData == 'descView' ? '#000000' : '#999'
              }`"
              >{{
                orderFilterData == "descView" ? "✅조회순" : "조회순"
              }}</label
            >
          </div>
          <hr />
          <div>
            <input
              type="radio"
              name="orderFilter"
              id="descLike"
              value="descLike"
              style="display: none"
              v-model="orderFilterData"
            />
            <label
              for="descLike"
              :style="`color: ${
                orderFilterData == 'descLike' ? '#000000' : '#999'
              }`"
              >{{
                orderFilterData == "descLike" ? "✅좋아요순" : "좋아요순"
              }}</label
            >
          </div>
          <hr />
          <div>
            <input
              type="radio"
              name="orderFilter"
              id="descPurchase"
              value="descPurchase"
              style="display: none"
              v-model="orderFilterData"
            />
            <label
              for="descPurchase"
              :style="`color: ${
                orderFilterData == 'descPurchase' ? '#000000' : '#999'
              }`"
              >{{
                orderFilterData == "descPurchase"
                  ? "✅최다구매순"
                  : "최다구매순"
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
                {{ item.optionList.map((opt) => opt.optionName).join(" / ") }}
              </p>
            </div>
            <div class="footer-container">
              <p>
                등록월
                <span>{{ formatTimestampToYearMonth(item.createdAt) }}</span>
              </p>
              <hr v-if="viewFilterData == 'list'" />
              <p>
                관심
                <span>{{ item.productLikeCount.toLocaleString() }}</span>
              </p>
              <hr v-if="viewFilterData == 'list'" />
              <hr v-if="viewFilterData == 'grid'" />
              <p>
                조회수
                <span>{{ item.productViewCount.toLocaleString() }}</span>
              </p>
            </div>
          </div>
          <div class="price-container">
            <p class="origin-price">
              {{ item.productOriginPrice.toLocaleString() }}원
            </p>
            <div class="sell-price-container">
              <router-link :to="`/product?id=${item.id}`" class="sell-price">
                <span>계좌이체가</span>
                {{ item.productBankSellPrice.toLocaleString() }}원
              </router-link>
              <router-link :to="`/product?id=${item.id}`" class="sell-price">
                <span>카드결제가</span>
                {{ item.productSellPrice.toLocaleString() }}원
              </router-link>
            </div>
          </div>
        </div>
        <div ref="observerTarget" class="observer-target"></div>

        <div v-if="isEnd" class="end-text">
          <p>더 이상 상품이 없습니다.</p>
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
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { db } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy, getDoc, doc, limit, startAfter } from "firebase/firestore";
import { getUserId, logoutProcess } from '@/lib/auth';
import router from '@/router';
import { useRoute } from 'vue-router';

const productDatas = ref([]);
const orderFilterData = ref("popular");
const viewFilterData = ref("list");
const userData = ref(null);

const lastDoc = ref(null);
const isLoading = ref(false);
const isEnd = ref(false);

const PAGE_LIMIT = 12;

const observerTarget = ref(null);
let observer = null;

const route = useRoute();

function formatTimestampToYearMonth(timestamp) {
  const date = timestamp.toDate(); // Firestore Timestamp → JS Date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based → 1-based
  return `${year}.${month}`;
}

function getOrderByByFilter(filter) {
  switch (filter) {
    case "popular":
      return ["popularScore", "desc"];
    case "ascPrice":
      return ["productSellPrice", "asc"];
    case "descPrice":
      return ["productSellPrice", "desc"];
    case "newest":
      return ["createdAt", "desc"];
    case "descView":
      return ["productViewCount", "desc"];
    case "descLike":
      return ["productLikeCount", "desc"];
    case "descPurchase":
      return ["purchaseCount", "desc"];
    default:
      return ["popularScore", "desc"];
  }
}

const resetPassword = async () => {
  router.push("/mypage/reset-password");
}

const logout = async () => {
  await logoutProcess();
  window.location.href = "/";
}

async function fetchProducts({ reset = false } = {}) {
  if (isLoading.value) return;

  if (reset) {
    productDatas.value = [];
    lastDoc.value = null;
    isEnd.value = false;
  }

  if (isEnd.value) return;

  isLoading.value = true;

  try {
    const [field, dir] =
      getOrderByByFilter(route.query.filter || "popular");

    const uid = await getUserId();
    const tempUserData = (await getDoc(doc(db, "users", uid))).data();

    let q = query(
      collection(db, "product"),
      where("isActive", "==", true),
      where("productId", "in", tempUserData.userProductWishList),
      orderBy(field, dir),
      limit(PAGE_LIMIT)
    );

    if (lastDoc.value) {
      q = query(q, startAfter(lastDoc.value));
    }

    const snap = await getDocs(q);

    if (snap.empty) {
      isEnd.value = true;
      return;
    }

    productDatas.value.push(
      ...snap.docs.map(d => ({ id: d.id, ...d.data() }))
    );

    lastDoc.value = snap.docs[snap.docs.length - 1];
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}

function initObserver() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver(
    entries => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      if (isLoading.value || isEnd.value) return;

      fetchProducts();
    },
    { rootMargin: "200px" } // 미리 로딩
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }
}

watch(orderFilterData, val => {
  router.push({
    query: {
      ...route.query,
      filter: val
    }
  });
});

watch(
  () => [route.query.filter],
  async () => {
    orderFilterData.value = route.query.filter || "popular";

    if (observer) observer.disconnect();

    await fetchProducts({ reset: true });

    await nextTick();
    initObserver();
  },
  { immediate: true }
);

onMounted(() => {
  initObserver();
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

onMounted(async () => {
    try {
        console.log("Fetch User Data...");
        const uid = getUserId();
        const data = (await getDoc(doc(db, "users", uid))).data();
        userData.value = data;
        console.log("User Data Fetched Successfully!: ", userData.value);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});
</script>

<style lang="scss" scoped>
.observer-target {
  height: 1px;
}

.end-text {
  text-align: center;
  padding: 24px;
  color: #999;
}

.consumer-mypage-wishlist {
  padding: 16px 24px;
  margin: auto;
  max-width: 1200px;
  display: flex;
  gap: 24px;
  min-height: 70vh;

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
