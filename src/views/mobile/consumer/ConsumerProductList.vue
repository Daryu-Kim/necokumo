<template>
  <div class="consumer-product-list">
    <div class="main-content-box">
      <div>
        <h3 v-if="currentCategoryData">
          {{ currentCategoryData.categoryName }}
          <span
            >({{ currentCategoryData.categoryProductCount.toLocaleString() }}개
            상품)</span
          >
        </h3>
        <table v-if="categoryRows.length > 0">
          <tr v-for="(row, rowIndex) in categoryRows" :key="rowIndex">
            <td v-for="(item, colIndex) in row" :key="colIndex">
              <router-link v-if="item" :to="`/list?category=${item.id}`">{{
                item.categoryName
              }}</router-link>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="product-list-box">
      <div class="filter-container">
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
            <div class="price-container">
              <div class="sell-price-container">
                <router-link :to="`/product?id=${item.id}`" class="sell-price">
                  {{ item.productBankSellPrice.toLocaleString() }}원 ({{
                    item.productSellPrice.toLocaleString()
                  }}원)
                </router-link>
              </div>
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
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { db } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy, getDoc, doc, startAfter, limit } from "firebase/firestore";
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { getUserId } from '@/lib/auth';
import { onUnmounted } from 'vue';

const categoryDatas = ref([]);
const childCategoryDatas = ref([]);
const productDatas = ref([]);
const topBannerDatas = ref([]);
const viewFilterData = ref("list");
const currentCategoryData = ref(null);
const parentCategoryData = ref(null);
const categoryRows = computed(() => {
  const result = []
  const chunkSize = 2
  const itemsCopy = [...childCategoryDatas.value]

  while (itemsCopy.length) {
    const chunk = itemsCopy.splice(0, chunkSize)
    while (chunk.length < chunkSize) {
      chunk.push(null) // 빈 칸 채우기
    }
    result.push(chunk)
  }

  return result;
});

const lastDoc = ref(null);
const isLoading = ref(false);
const isEnd = ref(false);

const PAGE_LIMIT = 30;

const observerTarget = ref(null);
let observer = null;

const route = useRoute();

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

async function fetchChildCategoryData() {
  try {
    console.log("Fetching Child Category Data...");
    const childCategory = await getDocs(query(collection(db, "category"), where("categoryParentId", "==", route.query.category), where("categoryGrade", "==", 1), orderBy("categoryOrder", "asc")));
    childCategoryDatas.value = childCategory.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Child Category Data Fetched Successfully!: ", childCategoryDatas.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
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
  try {
    console.log("Fetching Current Category Data...");
    const currentCategory = await getDoc(doc(db, "category", route.query.category));
    currentCategoryData.value = currentCategory.data();
    if (currentCategoryData.value.categoryParentId) {
      const parentCategory = await getDoc(doc(db, "category", currentCategoryData.value.categoryParentId));
      parentCategoryData.value = parentCategory.data();
    } else {
      parentCategoryData.value = null;
    }
    console.log("Current Category Data Fetched Successfully!: ", currentCategory.docs[0].id);
  } catch (error) {
    console.error('Failed to fetch data:', error);
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

watch(
  () => [route.query.category],
  async () => {

    if (observer) observer.disconnect();

    console.log("Fetching Category Data...");
    const category = await getDocs(query(collection(db, "category"), where("categoryGrade", "==", 0), orderBy("categoryOrder", "asc")));
    categoryDatas.value = category.docs.filter(doc => doc.id !== '1').map(doc => ({ id: doc.id,title: doc.data().categoryName }));
    console.log("Category Data Fetched Successfully!: ", categoryDatas.value);

    await fetchChildCategoryData();
    await fetchProducts({ reset: true });
    await fetchCurrentCategoryData();

    console.log("Fetching Top Banner Data...");
    const topBanner = await getDocs(query(collection(db, "banners"), where("category", "==", "MAIN_TOP_BANNER"), orderBy("order", "asc")));
    topBannerDatas.value = topBanner.docs.map(doc => ({ id: doc.id, url: doc.data().url, redirect: doc.data().redirect }));
    console.log("Top Banner Data Fetched Successfully!: ", topBannerDatas.value);

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

  > .main-content-box {
    display: flex;
    gap: 24px;

    > div {
      width: 100%;

      > a {
        > img {
          border-radius: 8px;
        }
      }

      > h3 {
        text-align: center;

        > span {
          font-size: 14px;
        }
      }

      > table {
        width: 100%;
        margin-top: 24px;
        border-top: 2px solid #ccc;
        border-collapse: collapse;
        > tr {
          > td {
            padding: 12px;
            border: 1px solid #efefef;
            font-size: 14px;
            text-align: center;
            width: 20%;

            > a {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }

  > .product-list-box {
    margin-top: 8px;
    > .filter-container {
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: end;
      gap: 24px;
      border-bottom: 1px solid #000;
      padding: 8px 0;

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
          display: flex;
          gap: 16px;

          &:not(:last-child) {
            border-bottom: 1px solid #efefef;
            margin-top: 4px;
          }

          > a {
            > img {
              width: 96px;
              height: 96px;
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
              gap: 8px;
              > p {
                color: white;
                font-size: 12px;
                min-width: 24px;
                max-width: 24px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                font-weight: 700;
              }

              > a {
                font-weight: 500;
                font-size: 14px;
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
                text-align: start;
                margin-top: 8px;
                > .sell-price {
                  font-size: 16px;
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
        }
      }

      &.grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
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
                font-weight: 500;
                font-size: 14px;
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

            > .price-container {
              margin-top: 8px;
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
                  font-size: 16px;
                  font-weight: 700;
                  margin-top: 2px;
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
