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
              {{ item.productSellPrice.toLocaleString() }}원
            </p>
            <div class="sell-price-container">
              <router-link :to="`/product?id=${item.id}`" class="sell-price">
                <span>계좌이체가</span>
                {{ (item.productSellPrice * 0.95).toLocaleString() }}원
              </router-link>
              <router-link :to="`/product?id=${item.id}`" class="sell-price">
                <span>카드결제가</span>
                {{ item.productSellPrice.toLocaleString() }}원
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref, watch } from 'vue';
import { db } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy, getDoc, doc } from "firebase/firestore";
import { useRoute } from 'vue-router';
const categoryDatas = ref([]);
const productDatas = ref([]);
const orderFilterData = ref("popular");
const viewFilterData = ref("list");
const currentCategoryData = ref(null);

const route = useRoute();

function formatTimestampToYearMonth(timestamp) {
  const date = timestamp.toDate(); // Firestore Timestamp → JS Date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based → 1-based
  return `${year}.${month}`;
}

async function fetchFilteredData() {
  try {
    switch (orderFilterData.value) {
      case "popular": {
        console.log("Fetching Popular Data...");

        // 1️⃣ 각 product에 구매수 조회 후 score 계산
        const productsWithScore = await Promise.all(
          productDatas.value.map(async (product) => {
            // productOrder 컬렉션에서 productId 일치하는 문서 수
            const ordersSnap = await getDocs(
              query(collection(db, "productOrder"), where("productId", "==", product.productId))
            );
            const purchaseCount = ordersSnap.size;

            // score 계산
            const score =
              (product.productLikeCount || 0) * 5 +
              purchaseCount * 10 +
              (product.productViewCount || 0) * 2;

            return {
              ...product,
              score,
            };
          })
        );

        // 2️⃣ score 내림차순 정렬 + score 같으면 createdAt 최신순
        productsWithScore.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return b.createdAt - a.createdAt;
        });

        // 3️⃣ productDatas.value에 반영
        productDatas.value = productsWithScore;

        break;
      }
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
    const product = await getDocs(query(collection(db, "product"), where("isActive", "==", true), where("productCategory", "array-contains-any", [route.query.category]), orderBy("productLikeCount", "desc")));
    productDatas.value = product.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Product Data Fetched Successfully!: ", productDatas.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

async function fetchCurrentCategoryData() {
  try {
    console.log("Fetching Current Category Data...");
    const currentCategory = await getDoc(doc(db, "category", route.query.category));
    currentCategoryData.value = currentCategory.data();
    console.log("Current Category Data Fetched Successfully!: ", currentCategory.docs[0].id);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

onMounted(async () => {
    try {
        console.log("Fetching Category Data...");
        const category = await getDocs(query(collection(db, "category"), where("categoryGrade", "==", 0), orderBy("categoryOrder", "asc")));
        categoryDatas.value = category.docs.filter(doc => doc.id !== '1').map(doc => ({ id: doc.id,title: doc.data().categoryName }));
        console.log("Category Data Fetched Successfully!: ", categoryDatas.value);

        await fetchProductData();
        await fetchFilteredData();
        await fetchCurrentCategoryData();
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});

watch(() => route.query.category, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await fetchProductData();
    await fetchFilteredData();
    await fetchCurrentCategoryData();
  }
});

watch(() => orderFilterData.value, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await fetchFilteredData();
  }
});
</script>

<style lang="scss" scoped>
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
