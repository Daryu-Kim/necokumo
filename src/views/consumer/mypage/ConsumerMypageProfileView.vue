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
              <span>{{ userData.userGrade }}</span> 입니다.
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
          <h3>{{ userData.userAvailablePoint.toLocaleString() }} 냥코인</h3>
          <p>사용가능 냥코인</p>
        </div>
        <div style="width: 25%" class="count-container">
          <span class="material-icons-outlined"> inventory_2 </span>
          <h3>
            {{ userData.userActualPaymentAmount.toLocaleString() }}원 ({{
              userData.userTotalActualOrderCount.toLocaleString()
            }}회)
          </h3>
          <p>총 주문</p>
        </div>
      </div>
      <div class="invite-container">
        <h3>주소를 복사하여 친구를 쇼핑몰에 초대해보세요.</h3>
        <div class="address-copy-container">
          <input
            type="text"
            :value="`http://necokumo.shop/?reco_id=${userData.userId}`"
            readonly
          />
          <button @click="copyAddress">주소 복사</button>
        </div>
        <p>친구가 상품을 구매 시 구매 적립금의 일부를 받아요.</p>
        <p>
          추천받은 횟수가 늘어나면 네코쿠모의 구인 공고에 지원했을때 가산점을
          받아요.
        </p>
        <p>네코쿠모에서 근무 시 이 적립금을 환급받을 수도 있어요.</p>
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
              <router-link to="/mypage/profile/edit">
                회원 정보 수정
              </router-link>
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
                <router-link to="/mypage/order?filter=BEFORE_DEPOSIT">{{
                  orderStatus.BEFORE_DEPOSIT.length.toLocaleString()
                }}</router-link>
              </h3>
              <p>입금전</p>
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
          <hr />
          <table style="width: 100%" v-if="recentOrders.length > 0">
            <thead>
              <tr>
                <th style="width: 25%">주문번호</th>
                <th style="width: 15%">총 금액</th>
                <th style="width: 10%">결제수단</th>
                <th style="width: 10%">처리상태</th>
                <th style="width: 25%">주문일</th>
                <th style="width: 15%">상세보기</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.orderId">
                <td>{{ order.orderId }}</td>
                <td>
                  {{ order.totalPrice.toLocaleString()
                  }}{{ order.paymentMethod === "bank" ? "원" : "$" }}
                </td>
                <td>
                  {{ order.paymentMethod === "bank" ? "무통장입금" : "PayPal" }}
                </td>
                <td>{{ generateOrderStatusLabel(order.status) }}</td>
                <td>{{ order.createdAt.toDate().toLocaleString() }}</td>
                <td>
                  <router-link :to="`/mypage/order/detail?id=${order.orderId}`">
                    상세보기
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const userData = ref(null);
const orderData = ref(null);
const orderStatus = ref({
  BEFORE_DEPOSIT: [],
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

const router = useRouter();

const logout = async () => {
  await auth.signOut();
  router.push('/');
}

const copyAddress = () => {
  navigator.clipboard.writeText(`http://necokumo.shop/?reco_id=${userData.value.userId}`);
  alert('주소를 복사했습니다.\n친구들에게 공유해보세요!');
};

onMounted(async () => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
  const threeMonthsAgoTimestamp = Timestamp.fromDate(threeMonthsAgo);

  const userDataRef = (await getDoc(doc(db, "users", auth.currentUser.uid))).data();
  userData.value = userDataRef;

  const orderDataRef = await getDocs(
    query(
      collection(db, "order"),
      where("orderChannel", "==", "NECOKUMO"),
      where("userId", "==", auth.currentUser.uid),
      where("createdAt", ">=", threeMonthsAgoTimestamp), // 3개월 조건 추가
      orderBy("createdAt", "desc") // 반드시 createdAt으로 정렬
    )
  );
  orderData.value = orderDataRef.docs.map((doc) => doc.data());
  orderStatus.value = {
    BEFORE_DEPOSIT: orderDataRef.docs.filter((doc) => doc.data().status === 'BEFORE_DEPOSIT'),
    PAYMENT_COMPLETED: orderDataRef.docs.filter((doc) => doc.data().status === 'PAYMENT_COMPLETED'),
    PREPARING_PRODUCT: orderDataRef.docs.filter((doc) => doc.data().status === 'PREPARING_PRODUCT'),
    PREPARING_DELIVERY: orderDataRef.docs.filter((doc) => doc.data().status === 'PREPARING_DELIVERY'),
    SHIPPING_PROGRESS: orderDataRef.docs.filter((doc) => doc.data().status === 'SHIPPING_PROGRESS'),
    DELIVERY_COMPLETED: orderDataRef.docs.filter((doc) => doc.data().status === 'DELIVERY_COMPLETED'),
    CANCELLED: orderDataRef.docs.filter((doc) =>
      ["REQUEST_CANCEL", "PROCESSING_CANCEL", "HOLD_CANCEL", "APPROVED_CANCEL"].includes(doc.data().status)
    ),
    EXCHANGE: orderDataRef.docs.filter((doc) =>
      ["REQUEST_EXCHANGE", "PROCESSING_EXCHANGE", "HOLD_EXCHANGE", "APPROVED_EXCHANGE"].includes(doc.data().status)
    ),
    RETURNED: orderDataRef.docs.filter((doc) =>
      ["REQUEST_RETURN", "PROCESSING_RETURN", "HOLD_RETURN", "APPROVED_RETURN"].includes(doc.data().status)
    ),
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

    > .invite-container {
      padding: 48px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;

      > div {
        margin: 24px 0;
        display: flex;
        align-items: center;
        gap: 8px;
        > input {
          font-size: 16px;
          height: 42px;
          width: 420px;
          padding: 0 12px;
        }

        > button {
          border: none;
          background: #007bff;
          height: 42px;
          font-weight: 700;
          color: white;
          border-radius: 4px;
          font-size: 16px;
          width: 96px;
          cursor: pointer;
        }
      }

      > p {
        font-size: 16px;
        line-height: 24px;
        color: #666;
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

        > table {
          width: 100%;

          td {
            font-size: 14px;
          }

          th,
          td {
            padding: 8px 0;
            text-align: center;

            > a {
              background: #007bff;
              color: white;
              font-weight: 700;
              width: 100%;
              padding: 6px 16px;
              border-radius: 4px;
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
