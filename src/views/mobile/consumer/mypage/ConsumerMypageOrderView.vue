<template>
  <div class="consumer-mypage-order" v-if="userData">
    <div class="main-container">
      <div class="order-container">
        <div>
          <h2>주문내역 조회</h2>
          <div class="order-filter-container">
            <select v-model="orderStatusFilter">
              <option value="">전체 주문처리상태</option>
              <option value="BEFORE_DEPOSIT">입금전</option>
              <option value="PAYMENT_COMPLETED">결제완료</option>
              <option value="PREPARING_PRODUCT">상품준비중</option>
              <option value="PREPARING_DELIVERY">배송준비중</option>
              <option value="SHIPPING_PROGRESS">배송중</option>
              <option value="DELIVERY_COMPLETED">배송완료</option>
              <option value="CANCELLED">취소</option>
              <option value="EXCHANGE">교환</option>
              <option value="RETURNED">반품</option>
            </select>
            <div class="date-button-container">
              <input
                type="radio"
                v-model="dateRangeButton"
                id="TODAY"
                value="TODAY"
                style="display: none"
              />
              <label for="TODAY">오늘</label>
              <input
                type="radio"
                v-model="dateRangeButton"
                id="1M"
                value="1M"
                style="display: none"
              />
              <label for="1M">1개월</label>
              <input
                type="radio"
                v-model="dateRangeButton"
                id="3M"
                value="3M"
                style="display: none"
              />
              <label for="3M">3개월</label>
              <input
                type="radio"
                v-model="dateRangeButton"
                id="6M"
                value="6M"
                style="display: none"
              />
              <label for="6M">6개월</label>
            </div>
            <div class="date-range-container">
              <input type="date" v-model="startDate" :max="endDate" />
              <p>~</p>
              <input type="date" v-model="endDate" disabled />
            </div>
            <button @click="applyFilters">조회</button>
          </div>
          <div class="order-list-container" v-if="orderData.length > 0">
            <div
              class="order-item"
              v-for="(order, index) in filteredOrderData"
              :key="order.id"
            >
              <div class="order-title-container">
                <div>
                  <strong>{{ formatDate(order.createdAt.toDate()) }}</strong>
                  <p>({{ order.orderId }})</p>
                </div>
                <router-link :to="`/mypage/order/detail?id=${order.orderId}`">
                  <p>상세보기</p>
                  <span class="material-icons-outlined"> chevron_right </span>
                </router-link>
              </div>
              <div
                class="order-product-container"
                v-for="(
                  productOrderItem, productOrderIndex
                ) in order.productOrderDatas"
                :key="productOrderIndex"
              >
                <div class="desc-container">
                  <img
                    :src="
                      productOrderItem.productData.productThumbnailUrl
                        .originalUrl
                    "
                  />
                  <div>
                    <p class="name">
                      {{ productOrderItem.productData.productName }}
                    </p>
                    <p class="price">
                      {{ productOrderItem.productPrice.toLocaleString()
                      }}{{
                        productOrderItem.currency === "KRW" ? "원" : "$"
                      }}
                      ({{ productOrderItem.count }}개)
                    </p>
                    <p class="option">
                      [옵션: {{ productOrderItem.optionName }}]
                    </p>
                  </div>
                </div>
                <hr />
                <div class="order-status-container">
                  <strong>{{
                    generateOrderStatusLabel(productOrderItem.status)
                  }}</strong>
                  <hr
                    v-if="
                      productOrderIndex !== order.productOrderDatas.length - 1
                    "
                  />
                  <div v-else class="order-total-container">
                    <p>
                      총 결제금액:
                      <span>
                        {{ order.totalPrice.toLocaleString()
                        }}{{ order.currency === "KRW" ? "원" : "$" }}
                      </span>
                    </p>
                    <strong
                      v-if="
                        order.deliveryFeePaymentRequired &&
                        !order.deliveryFeePaied
                      "
                    >
                      "상세보기"에서 배송비 추가 결제가 필요합니다!
                    </strong>
                  </div>
                </div>
                <hr v-if="index === orderData.length - 1" />
              </div>
            </div>
          </div>
          <div class="order-empty-container" v-else>
            <span class="material-icons-outlined"> error_outline </span>
            <p>주문 내역이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { db, auth } from '@/lib/firebase';
import { generateOrderStatusLabel } from '@/lib/utils';
import { doc, getDoc, getDocs, query, collection, where, orderBy, Timestamp } from 'firebase/firestore';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const userData = ref(null);
const orderData = ref([]);
const orderStatusFilter = ref("");
const dateRangeButton = ref("3M"); // 기본값
const startDate = ref("");
const endDate = ref("");

const filteredOrderData = computed(() => {
  return orderData.value.filter((order) => order.productOrderDatas?.length > 0);
});

const router = useRouter();
const route = useRoute();

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const toDateInputFormat = (date) => date.toISOString().split("T")[0];

const applyFilters = async () => {
  router.replace({
    query: {
      filter: orderStatusFilter.value,
      startDate: startDate.value,
      endDate: endDate.value,
    },
  });
};

const fetchOrders = async () => {
  const filters = [];
  filters.push(where("orderChannel", "==", "NECOKUMO"));
  filters.push(where("userId", "==", auth.currentUser.uid));

  let start = new Date(startDate.value);
  start.setHours(0, 0, 0, 0);
  let end = new Date(endDate.value);
  end.setHours(23, 59, 59, 999);

  filters.push(where("createdAt", ">=", Timestamp.fromDate(start)));
  filters.push(where("createdAt", "<=", Timestamp.fromDate(end)));

  const q = query(collection(db, "order"), ...filters, orderBy("createdAt", "desc"));
  const orderSnap = await getDocs(q);
  orderData.value = orderSnap.docs.map((doc) => doc.data());

  for (const order of orderData.value) {
    order.productOrderDatas = [];

    for (const productOrderId of order.productOrders || []) {
      const productOrderRef = await getDoc(doc(db, "productOrder", productOrderId));
      const productOrderData = productOrderRef.data();
      if (!productOrderData) continue;

      // 🔍 상태 필터링: "" 이면 전체 허용, 아니면 status 매칭
      if (
        orderStatusFilter.value !== "" &&
        productOrderData.status !== orderStatusFilter.value
      ) {
        continue;
      }

      const productRef = await getDoc(doc(db, "product", productOrderData.productId));
      const productData = productRef.exists() ? productRef.data() : null;

      productOrderData.productData = productData;
      order.productOrderDatas.push(productOrderData);
    }
  }
};

onMounted(async () => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);
  threeMonthsAgo.setHours(0, 0, 0, 0);

  const queryFilter = route.query.filter;
  const queryStart = route.query.startDate;
  const queryEnd = route.query.endDate;

  startDate.value = queryStart || toDateInputFormat(threeMonthsAgo);
  endDate.value = queryEnd || toDateInputFormat(today);

  orderStatusFilter.value = queryFilter || "";

  const userDataRef = (await getDoc(doc(db, "users", auth.currentUser.uid))).data();
  userData.value = userDataRef;

  await fetchOrders();
});

watch(dateRangeButton, (newVal) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  let start = new Date();

  switch (newVal) {
    case "TODAY":
      start.setHours(0, 0, 0, 0);
      break;
    case "1M":
      start.setMonth(today.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "3M":
      start.setMonth(today.getMonth() - 3);
      start.setHours(0, 0, 0, 0);
      break;
    case "6M":
      start.setMonth(today.getMonth() - 6);
      start.setHours(0, 0, 0, 0);
      break;
  }

  startDate.value = toDateInputFormat(start);
  endDate.value = toDateInputFormat(today);
});

watch(
  () => route.query,
  async (newQuery) => {
    const queryFilter = newQuery.filter || "";
    const queryStart = newQuery.startDate;
    const queryEnd = newQuery.endDate;

    // 상태 업데이트
    orderStatusFilter.value = queryFilter;
    if (queryStart && queryEnd) {
      startDate.value = queryStart;
      endDate.value = queryEnd;
    }

    await fetchOrders();
  }
);
</script>

<style lang="scss" scoped>
.consumer-mypage-order {
  padding: 16px 24px;

  > .main-container {
    > .order-container {
      > div {
        > h2 {
          text-align: center;
        }

        > .order-filter-container {
          margin-top: 24px;

          > select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #999;
            border-radius: 4px;
            box-sizing: border-box;
            outline: none;
            font-size: 14px;
          }

          > .date-button-container {
            display: flex;
            margin-top: 8px;
            > label {
              flex: 1;
              border: 1px solid #999;
              padding: 8px 12px;
              text-align: center;
              cursor: pointer;
              font-size: 14px;
            }

            input:checked + label {
              border-color: black;
            }
          }

          > .date-range-container {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 8px;

            > input {
              flex: 1;
              min-width: 0;
              padding: 8px 12px;
              border: 1px solid #999;
              border-radius: 4px;
              box-sizing: border-box;
              outline: none;
              font-size: 14px;
            }
          }

          > button {
            font-size: 14px;
            border: none;
            background: black;
            font-weight: 700;
            width: 100%;
            color: white;
            margin-top: 8px;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
          }
        }

        > .order-list-container {
          margin-top: 24px;

          > div {
            border-top: 2px solid black;

            &:not(:first-child) {
              margin-top: 16px;
            }

            > .order-title-container {
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: #efefef;
              padding: 12px 16px;

              > div {
                > strong {
                  font-size: 14px;
                }

                > p {
                  font-size: 12px;
                  font-weight: 400;
                  color: #666;
                  margin-top: 4px;
                }
              }

              > a {
                display: flex;
                align-items: center;
                > p {
                  font-weight: 700;
                  color: #007bff;
                  font-size: 14px;
                }

                > span {
                  color: #007bff;
                }
              }
            }

            > .order-product-container {
              margin-top: 16px;
              > .desc-container {
                display: flex;
                gap: 16px;

                > img {
                  width: 96px;
                  height: 96px;
                  border-radius: 8px;
                  object-fit: cover;
                  border: 1px solid #efefef;
                  padding: 4px;
                }

                > div {
                  > .name {
                    font-weight: 700;
                    font-size: 16px;
                  }

                  > .price {
                    margin-top: 4px;
                    font-size: 14px;
                  }

                  > .option {
                    margin-top: 16px;
                    color: #666;
                    font-size: 14px;
                  }
                }
              }

              > hr {
                margin: 16px 0;
              }

              > .order-status-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 16px;

                > .order-total-container {
                  > p,
                  strong {
                    font-size: 14px;
                    text-align: end;
                    line-height: 24px;

                    > span {
                      font-weight: 700;
                      color: #007bff;
                    }
                  }
                }

                > hr {
                  margin-top: 16px;
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
  }
}
</style>
