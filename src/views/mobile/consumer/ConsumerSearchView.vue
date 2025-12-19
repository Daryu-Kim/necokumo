<template>
  <div class="consumer-search">
    <div class="search-bar">
      <input
        type="text"
        placeholder="검색어를 입력해주세요."
        v-model="searchKeyword"
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">
        <span class="material-icons-outlined"> search </span>
      </button>
    </div>
    <h2>
      "{{
        route.query.keyword ? decodeURIComponent(route.query.keyword) : ""
      }}"에 대한 검색 결과: {{ productDatas.length.toLocaleString() }}건
    </h2>
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
      </div>
      <div class="empty-container" v-else>
        <span class="material-icons-outlined"> error_outline </span>
        <p>검색된 상품이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref, watch } from 'vue';
import { db } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy, limit, startAfter } from "firebase/firestore";
import { useRoute } from 'vue-router';
import { nextTick } from 'vue';
import { onUnmounted } from 'vue';

const productDatas = ref([]);
const viewFilterData = ref("list");
const searchKeyword = ref("");

const lastDoc = ref(null);
const isLoading = ref(false);
const isEnd = ref(false);

const PAGE_LIMIT = 30;

const observerTarget = ref(null);
let observer = null;

const route = useRoute();

function formatTimestampToYearMonth(timestamp) {
  const date = timestamp.toDate(); // Firestore Timestamp → JS Date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based → 1-based
  return `${year}.${month}`;
}

const handleSearch = () => {
  if (searchKeyword.value.trim() === "") {
    alert("검색어를 입력하세요.");
    return;
  } else {
    const encodedKeyword = encodeURIComponent(searchKeyword.value);
    window.location.href = `/search?keyword=${encodedKeyword}`;
  }
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

watch(() => route.query.keyword, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await fetchProducts();
  }
});

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

    const keywordQuery = route.query.keyword || "";
    const keywordList = keywordQuery
      .toLowerCase()
      .replace(/[[]]/g, "")          // [ ] 제거
      .split(" ")
      .map((kw) => kw.trim())
      .filter(Boolean)
      .slice(0, 10);

    console.log(keywordList);

    let q = query(
      collection(db, "product"),
      where("isActive", "==", true),
      where("productNameKeywords", "array-contains-any", keywordList),
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

      fetchProducts({ reset: true });
    },
    { rootMargin: "200px" } // 미리 로딩
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }
}

watch(
  () => [route.query.keyword],
  async () => {
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
</script>

<style lang="scss" scoped>
.consumer-search {
  padding: 16px 24px;

  > h2 {
    margin-top: 24px;
    margin-bottom: 16px;
  }

  > .search-bar {
    padding: 8px 16px;
    width: 100%;
    border-radius: 100rem;
    border: 1px solid black;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 44px;

    > input {
      flex: 1;
      height: 100%;
      font-size: 16px;
      border: none;

      &:focus {
        outline: none;
      }
    }

    > button {
      background: none;
      border: none;
      cursor: pointer;
    }
  }

  > .product-list-box {
    margin-top: 8px;
    > .filter-container {
      display: flex;
      align-items: center;
      justify-content: end;
      gap: 24px;
      border-bottom: 1px solid #000;
      padding: 8px 0;

      label {
        cursor: pointer;
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

    > .empty-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 16px;
      border-bottom: 1px solid #efefef;
      height: 100%;
      padding: 24px 0;

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
