<template>
  <div class="consumer-mypage-profile" v-if="userData">
    <h1>마이 쇼핑</h1>
    <hr />
    <div class="user-info-container">
      <div class="summary-container">
        <div style="width: 50%" class="user-container">
          <span class="material-icons-outlined"> person </span>
          <div>
            <h2>안녕하세요. {{ userData.userName }} 님!</h2>
            <p class="grade">
              고객님의 회원 등급은
              <span>{{ convertUserGradeCodeToLabel(userData.userGrade) }}</span>
              입니다.
            </p>
            <p style="margin-top: 4px">
              구매 금액의
              <span
                >{{
                  convertUserGradeCodeToPointRate(userData.userGrade) * 100
                }}%</span
              >가 항상 적립됩니다!
            </p>
            <p style="margin-top: 4px">
              오늘도 구름 위를 걷는 듯한 쇼핑을 즐겨보세요 ☁️
            </p>
            <p>
              네코쿠모에서만 만날 수 있는 특별한 아이템이 기다리고 있어요 🐱
            </p>
          </div>
        </div>
        <div style="width: 25%" class="count-container">
          <span class="material-icons-outlined"> paid </span>
          <h3>{{ userPoint.toLocaleString() }} 냥코인</h3>
          <p>사용가능 냥코인</p>
        </div>
        <div style="width: 25%" class="count-container">
          <span class="material-icons-outlined"> inventory_2 </span>
          <h3>
            {{ totalOrderPrice.toLocaleString() }}원 ({{
              totalOrderCount.toLocaleString()
            }}회)
          </h3>
          <p>총 주문</p>
        </div>
      </div>
    </div>
    <div class="main-container">
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
      <div class="order-container">
        <div>
          <h3>나의 주문처리 현황 <span>(최근 3개월 기준)</span></h3>
          <hr />
          <div class="delivery-container">
            <div>
              <h3>
                <router-link to="/mypage/order?filter=BEFORE_PAYMENT">{{
                  orderStatus.BEFORE_PAYMENT.length.toLocaleString()
                }}</router-link>
              </h3>
              <p>결제전</p>
            </div>
            <span class="material-icons-outlined"> chevron_right </span>
            <div>
              <h3>
                <router-link to="/mypage/order?filter=PAYMENT_COMPLETED">{{
                  orderStatus.PAYMENT_COMPLETED.length.toLocaleString()
                }}</router-link>
              </h3>
              <p>결제완료</p>
            </div>
            <span class="material-icons-outlined"> chevron_right </span>
            <div>
              <h3>
                <router-link to="/mypage/order?filter=PREPARING_PRODUCT">{{
                  orderStatus.PREPARING_PRODUCT.length.toLocaleString()
                }}</router-link>
              </h3>
              <p>상품준비중</p>
            </div>
            <span class="material-icons-outlined"> chevron_right </span>
            <div>
              <h3>
                {{ orderStatus.PREPARING_DELIVERY.length.toLocaleString() }}
              </h3>
              <p>배송준비중</p>
            </div>
            <span class="material-icons-outlined"> chevron_right </span>
            <div>
              <h3>
                <router-link to="/mypage/order?filter=SHIPPING_PROGRESS">{{
                  orderStatus.SHIPPING_PROGRESS.length.toLocaleString()
                }}</router-link>
              </h3>
              <p>배송중</p>
            </div>
            <span class="material-icons-outlined"> chevron_right </span>
            <div>
              <h3>
                <router-link to="/mypage/order?filter=DELIVERY_COMPLETED">{{
                  orderStatus.DELIVERY_COMPLETED.length.toLocaleString()
                }}</router-link>
              </h3>
              <p>배송완료</p>
            </div>
          </div>
          <div class="refund-container">
            <div>
              <p>
                취소:
                <span
                  ><router-link to="/mypage/order?filter=CANCELLED">{{
                    orderStatus.CANCELLED.length.toLocaleString()
                  }}</router-link></span
                >
              </p>
            </div>
            <div>
              <p>
                교환:
                <span
                  ><router-link to="/mypage/order?filter=EXCHANGE">{{
                    orderStatus.EXCHANGE.length.toLocaleString()
                  }}</router-link></span
                >
              </p>
            </div>
            <div>
              <p>
                반품:
                <span
                  ><router-link to="/mypage/order?filter=RETURNED">{{
                    orderStatus.RETURNED.length.toLocaleString()
                  }}</router-link></span
                >
              </p>
            </div>
          </div>
        </div>
        <div>
          <h3>주문내역 조회 <span>(최근 5건)</span></h3>
          <div class="order-list-container" v-if="recentOrders.length > 0">
            <div
              class="order-item"
              v-for="(order, index) in recentOrders"
              :key="order.id"
            >
              <div class="order-title-container">
                <strong
                  >{{ formatDate(order.createdAt.toDate())
                  }}<span>({{ order.productOrderId }})</span></strong
                >
                <router-link :to="`/mypage/order/detail?id=${order.orderId}`">
                  <p>상세보기</p>
                  <span class="material-icons-outlined"> chevron_right </span>
                </router-link>
              </div>
              <div class="order-product-container">
                <div class="desc-container">
                  <img
                    :src="order.productData.productThumbnailUrl.originalUrl"
                  />
                  <div>
                    <p class="name">
                      {{ order.productData.productName }}
                    </p>
                    <p class="price">
                      {{ order.productPrice.toLocaleString() }}원 ({{
                        order.count
                      }}개)
                    </p>
                    <p class="option">[옵션: {{ order.optionName }}]</p>
                  </div>
                </div>
                <hr />
                <div class="order-status-container">
                  <strong>{{ generateOrderStatusLabel(order.status) }}</strong>
                  <div class="order-total-container">
                    <p>
                      총 결제금액:
                      <span>{{ order.productPrice.toLocaleString() }}원</span>
                    </p>
                    <p>
                      적립 냥코인:
                      <span>
                        {{ order.pointAmount.toLocaleString() }}냥코인
                      </span>
                    </p>
                    <strong
                      v-if="
                        order.orderData.deliveryFeePaymentRequired &&
                        !order.orderData.deliveryFeePaied
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
import { getUserId, logoutProcess } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { convertUserGradeCodeToLabel, convertUserGradeCodeToPointRate, generateOrderStatusLabel } from '@/lib/utils';
import router from '@/router';
import { doc, getDoc, getDocs, query, collection, where, orderBy, Timestamp, limit } from 'firebase/firestore';
import { onMounted, ref } from 'vue';

const userData = ref(null);
const orderData = ref([]);
const orderStatus = ref({
  BEFORE_PAYMENT: [],
  PAYMENT_COMPLETED: [],
  PREPARING_PRODUCT: [],
  PREPARING_DELIVERY: [],
  SHIPPING_PROGRESS: [],
  DELIVERY_COMPLETED: [],
  CANCELLED: [],
  EXCHANGE: [],
  RETURNED: [],
});
const recentOrders = ref([]);

const userPoint = ref(0);
const totalOrderCount = ref(0);
const totalOrderPrice = ref(0);

const resetPassword = async () => {
  router.push("/mypage/reset-password");
}

const logout = async () => {
  await logoutProcess();
  window.location.href = "/";
}

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

onMounted(async () => {
  const uid = getUserId();
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
  const threeMonthsAgoTimestamp = Timestamp.fromDate(threeMonthsAgo);

  const userDataRef = (await getDoc(doc(db, "users", uid))).data();
  userData.value = userDataRef;

  // 유저 포인트 조회
  const userPointRef = await getDocs(
    query(
      collection(db, "userPoints"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc"),
      limit(1)
    )
  );

  userPoint.value = userPointRef.docs[0].data().afterPoint;

  // 총 주문 건수 & 금액 조회
  const totalOrderRef = await getDocs(
    query(
      collection(db, "order"),
      where("orderChannel", "==", "NECOKUMO"),
      where("userId", "==", uid)
    )
  );

  totalOrderCount.value = totalOrderRef.size;
  totalOrderPrice.value = totalOrderRef.docs.reduce((acc, doc) => acc + doc.data().productsPrice, 0);

  // 주문내역 조회
  const orderDataRef = await getDocs(
    query(
      collection(db, "productOrder"),
      where("userId", "==", uid),
      where("createdAt", ">=", threeMonthsAgoTimestamp), // 3개월 조건 추가
      orderBy("createdAt", "desc") // 반드시 createdAt으로 정렬
    )
  );
  orderData.value = await Promise.all(
    orderDataRef.docs.map(async (document) => {
      const data = document.data();
      const productSnap = await getDoc(doc(db, "product", data.productId));
      const productData = productSnap.data();
      const orderSnap = await getDoc(doc(db, "order", data.orderId));
      const orderData = orderSnap.data();
      return { ...data, productData, orderData };
    })
  );
  console.log(orderData.value);
  orderStatus.value = {
    BEFORE_PAYMENT: orderDataRef.docs.filter((doc) => doc.data().status === 'BEFORE_PAYMENT'),
    PAYMENT_COMPLETED: orderDataRef.docs.filter((doc) => doc.data().status === 'PAYMENT_COMPLETED'),
    PREPARING_PRODUCT: orderDataRef.docs.filter((doc) => doc.data().status === 'PREPARING_PRODUCT'),
    PREPARING_DELIVERY: orderDataRef.docs.filter((doc) => doc.data().status === 'PREPARING_DELIVERY'),
    SHIPPING_PROGRESS: orderDataRef.docs.filter((doc) => doc.data().status === 'SHIPPING_PROGRESS'),
    DELIVERY_COMPLETED: orderDataRef.docs.filter(doc => {
      const status = doc.data().status;
      return status === 'DELIVERY_COMPLETED' || status === 'CONFIRM_PURCHASE';
    }),
    CANCELLED: orderDataRef.docs.filter((doc) => doc.data().status === 'CANCELLED'),
    EXCHANGE: orderDataRef.docs.filter((doc) => doc.data().status === 'EXCHANGE'),
    RETURNED: orderDataRef.docs.filter((doc) => doc.data().status === 'RETURNED'),
  };
  recentOrders.value = orderData.value.slice(0, 5);
});
</script>

<style lang="scss" scoped>
.consumer-mypage-profile {
  padding: 36px 24px;
  margin: auto;
  max-width: 1200px;

  > h1 {
    text-align: center;
  }

  > hr {
    margin: 48px 0;
    border: none;
    border-bottom: 1px solid #efefef;
  }

  > .user-info-container {
    > div {
      border: 1px solid #efefef;

      &:not(:first-child) {
        border-top: none;
      }
    }

    > .summary-container {
      display: flex;
      > div {
        padding: 48px 24px;
        &:not(:first-child) {
          border-left: 1px solid #efefef;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
        }
      }
      > .user-container {
        display: flex;
        gap: 16px;

        > span {
          font-size: 48px;
          border: 4px solid black;
          height: fit-content;
          border-radius: 50%;
        }

        > div {
          > .grade {
            color: #666;
            margin-top: 8px;
            font-size: 16px;
            > span {
              font-weight: 700;
              color: black;
            }
          }

          > p {
            font-size: 14px;
            > span {
              font-weight: 700;
              color: #007bff;
            }
          }
        }
      }

      > .count-container {
        > span {
          font-size: 36px;
        }

        > h3 {
          margin-top: 8px;
        }

        > p {
          font-size: 16px;
          margin-top: 4px;
          color: #666;
        }
      }
    }
  }

  > .main-container {
    display: flex;
    gap: 24px;
    margin-top: 48px;

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

    > .order-container {
      flex: 1;
      > div {
        &:not(:first-child) {
          margin-top: 48px;
        }

        > h3 {
          > span {
            font-size: 14px;
            color: #666;
          }
        }

        > hr {
          margin-top: 16px;
          border: none;
          border-top: 2px solid black;
        }

        > .delivery-container {
          display: flex;
          align-items: center;
          gap: 16px;
          > div {
            flex: 1;
            height: 128px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;

            > p {
              color: #666;
            }
          }
        }

        > .refund-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          > div {
            border: 1px solid #efefef;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:not(:first-child) {
              border-left: none;
            }

            > p {
              > span {
                font-weight: 700;
              }
            }
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

              > strong {
                font-size: 14px;
                > span {
                  font-size: 12px;
                  font-weight: 400;
                  color: #666;
                  margin-left: 4px;
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
                  width: 144px;
                  height: 144px;
                  border-radius: 8px;
                  object-fit: cover;
                  border: 1px solid #efefef;
                  padding: 4px;
                }

                > div {
                  > .name {
                    font-weight: 700;
                    font-size: 18px;
                  }

                  > .price {
                    margin-top: 4px;
                  }

                  > .option {
                    margin-top: 16px;
                    color: #666;
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
