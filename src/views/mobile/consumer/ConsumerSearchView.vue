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
                  {{ (item.productSellPrice * 0.95).toLocaleString() }}원 ({{
                    (
                      Math.ceil(
                        ((item.productSellPrice * 0.97) / usdPrice) * 100
                      ) / 100
                    ).toLocaleString()
                  }}$)
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
                관심 <span>{{ item.productLikeCount.toLocaleString() }}</span>
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
import { getDocs, query, collection, where, orderBy } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router';
import { fetchExchangeRate } from '@/lib/paypal';

const usdPrice = ref(0);
const productDatas = ref([]);
const viewFilterData = ref("list");
const searchKeyword = ref("");

const router = useRouter();
const route = useRoute();

function formatTimestampToYearMonth(timestamp) {
  const date = timestamp.toDate(); // Firestore Timestamp → JS Date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based → 1-based
  return `${year}.${month}`;
}

async function fetchFilteredData() {
  try {
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
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

async function fetchProductData() {
  try {
    console.log("Fetching Product Data...");
    const keywordQuery = route.query.keyword || "";
    const keywordList = keywordQuery
      .toLowerCase()
      .replace(/[[]]/g, "")          // [ ] 제거
      .split(" ")
      .map((kw) => kw.trim())
      .filter(Boolean)
      .slice(0, 10);                 // Firestore array-contains-any는 최대 10개까지 지원

    // 2. Firestore 쿼리 작성
    const q = query(
      collection(db, "product"),
      where("isActive", "==", true),
      where("productNameKeywords", "array-contains-any", keywordList),
      orderBy("productLikeCount", "desc")
    );
    const product = await getDocs(q);
    productDatas.value = product.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

const handleSearch = () => {
  if (searchKeyword.value.trim() === "") {
    alert("검색어를 입력하세요.");
    return;
  } else {
    const encodedKeyword = encodeURIComponent(searchKeyword.value);
    router.push(`/search?keyword=${encodedKeyword}`);
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

watch(() => route.query.keyword, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await fetchProductData();
    await fetchFilteredData();
    await fetchUSDPrice();
  }
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
