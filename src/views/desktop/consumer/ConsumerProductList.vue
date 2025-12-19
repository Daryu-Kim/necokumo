<template>
  <div class="consumer-product-list">
    <h1 v-if="currentCategoryData">
      {{ currentCategoryData.categoryName }}
      <span>({{ productDatas.length.toLocaleString() }}개 상품)</span>
    </h1>
    <div class="product-list-box">
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
      <div class="product-list-container" :class="viewFilterData">
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
    </div>
  </div>
</template>

<script setup lang="js">
import { nextTick, onMounted, ref, watch } from 'vue';
import { db } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy, getDoc, doc, startAfter, limit } from "firebase/firestore";
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { getUserId } from '@/lib/auth';
import { onUnmounted } from 'vue';

const productDatas = ref([]);
const orderFilterData = ref("popular");
const viewFilterData = ref("list");
const currentCategoryData = ref(null);

const lastDoc = ref(null);
const isLoading = ref(false);
const isEnd = ref(false);

const PAGE_LIMIT = 30;

const observerTarget = ref(null);
let observer = null;

const route = useRoute();
const router = useRouter();

const allowedGrades = ["N5", "N6", "N7", "N8", "N9", "N10"];
const restrictedCategories = Array.from({ length: 17 }, (_, i) => 200 + i);

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

    let q = query(
      collection(db, "product"),
      where("isActive", "==", true),
      where(
        "productCategory",
        "array-contains-any",
        [route.query.category]
      ),
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

async function fetchCurrentCategoryData() {
  const snap = await getDoc(
    doc(db, "category", route.query.category)
  );
  currentCategoryData.value = snap.data();
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
  () => [route.query.category, route.query.filter],
  async () => {
    orderFilterData.value = route.query.filter || "popular";

    if (observer) observer.disconnect();

    await fetchProducts({ reset: true });
    await fetchCurrentCategoryData();

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

onBeforeRouteUpdate(async (to, from, next) => {
  const category = Number(to.query.category);
  const uid = await getUserId();

  if (!uid) {
    alert("로그인 후 이용 가능합니다!");
    return next("/login");
  }

  const userSnap = await getDoc(doc(db, "users", uid));
  const userGrade = userSnap.data()?.userGrade;

  if (
    restrictedCategories.includes(category) &&
    !allowedGrades.includes(userGrade)
  ) {
    alert("접근할 수 없는 등급입니다.");
    return next(false);
  }

  next();
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

.consumer-product-list {
  padding: 16px 24px;
  margin: auto;
  max-width: 1200px;
  min-height: 70vh;

  > h1 {
    margin-top: 24px;
    margin-bottom: 24px;
    text-align: center;

    > span {
      font-size: 20px;
    }
  }

  > .product-list-box {
    margin-top: 8px;
    > .filter-container {
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid #000;
      padding: 8px 0;

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
              width: 720px;
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
  }
}
</style>
