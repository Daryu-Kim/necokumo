<template>
  <div class="consumer-product-list">
    <div class="main-content-box">
      <div>
        <table>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed, onMounted, ref, watch } from 'vue';
import { db } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy, getDoc, doc } from "firebase/firestore";
import { useRoute } from 'vue-router';
import { fetchExchangeRate } from '@/lib/paypal';

const usdPrice = ref(0);
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

async function fetchUSDPrice() {
  try {
    console.log("Fetching USD Price...");
    usdPrice.value = await fetchExchangeRate();
    console.log("USD Price Fetched Successfully!: ", usdPrice.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
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

onMounted(async () => {
    try {
        console.log("Fetching Category Data...");
        const category = await getDocs(query(collection(db, "category"), where("categoryGrade", "==", 0), orderBy("categoryOrder", "asc")));
        categoryDatas.value = category.docs.filter(doc => doc.id !== '1').map(doc => ({ id: doc.id,title: doc.data().categoryName }));
        console.log("Category Data Fetched Successfully!: ", categoryDatas.value);

        await fetchChildCategoryData();
        await fetchProductData();
        await fetchFilteredData();
        await fetchUSDPrice();
        await fetchCurrentCategoryData();

        console.log("Fetching Top Banner Data...");
        const topBanner = await getDocs(query(collection(db, "banners"), where("category", "==", "MAIN_TOP_BANNER"), orderBy("order", "asc")));
        topBannerDatas.value = topBanner.docs.map(doc => ({ id: doc.id, url: doc.data().url, redirect: doc.data().redirect }));
        console.log("Top Banner Data Fetched Successfully!: ", topBannerDatas.value);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});

watch(() => route.query.category, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await fetchChildCategoryData();
    await fetchProductData();
    await fetchFilteredData();
    await fetchUSDPrice();
    await fetchCurrentCategoryData();
  }
});
</script>

<style lang="scss" scoped>
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
