<template>
  <div class="consumer-mypage-wishlist">
    <div class="product-list-box">
      <h2>나의 찜</h2>
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

const productDatas = ref([]);
const orderFilterData = ref("popular");
const viewFilterData = ref("list");
const userData = ref(null);

function formatTimestampToYearMonth(timestamp) {
  const date = timestamp.toDate(); // Firestore Timestamp → JS Date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based → 1-based
  return `${year}.${month}`;
}

async function fetchFilteredData() {
  try {
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

onMounted(async () => {
    try {
        await fetchProductData();
        await fetchFilteredData();

        console.log("Fetch User Data...");
        const data = (await getDoc(doc(db, "users", auth.currentUser.uid))).data();
        userData.value = data;
        console.log("User Data Fetched Successfully!: ", userData.value);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});

watch(() => orderFilterData.value, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await fetchFilteredData();
  }
});
</script>

<style lang="scss" scoped>
.consumer-mypage-wishlist {
  padding: 16px 24px;

  h2 {
    margin-bottom: 8px;
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
