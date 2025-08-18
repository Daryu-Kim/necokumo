<template>
  <div class="consumer-mypage-order-detail" v-if="userData && orderData">
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
          <h3>주문 상세조회</h3>
          <div class="order-info-container">
            <h4>주문정보</h4>
            <div>
              <div>
                <p class="title">주문번호</p>
                <p class="content">{{ orderData.orderId }}</p>
              </div>
              <div>
                <p class="title">주문일자</p>
                <p class="content">
                  {{ formatDate(orderData.createdAt.toDate()) }}
                </p>
              </div>
              <div>
                <p class="title">주문자</p>
                <p class="content">{{ userData.userName }}</p>
              </div>
              <div>
                <p class="title">주문자 연락처</p>
                <p class="content">{{ userData.userPhone }}</p>
              </div>
            </div>
          </div>
          <div class="order-info-container">
            <h4>결제정보</h4>
            <div>
              <div>
                <p class="title">결제수단</p>
                <p class="content">
                  {{
                    orderData.paymentMethod === "bank"
                      ? "무통장입금"
                      : "신용카드"
                  }}
                </p>
              </div>
              <div>
                <p class="title">총 상품금액</p>
                <p class="content">
                  {{ orderData.productsPrice.toLocaleString() }}원
                </p>
              </div>
              <div>
                <p class="title">배송비</p>
                <p class="content">
                  {{ orderData.deliveryFee.toLocaleString() }}원
                </p>
              </div>
              <div>
                <p class="title">총 결제금액</p>
                <div class="content">
                  {{ orderData.totalPrice.toLocaleString() }}원
                </div>
              </div>
            </div>
          </div>
          <div class="order-list-container">
            <h4>
              주문 상품 정보<span
                >(총 {{ orderData.productOrders.length }}건 /
                {{ orderData.productsPrice.toLocaleString() }}원)</span
              >
            </h4>
            <div
              class="order-product-container"
              v-for="(
                productOrderItem, productOrderIndex
              ) in orderData.productOrderDatas"
              :key="productOrderIndex"
            >
              <div class="desc-container">
                <img
                  :src="
                    productOrderItem.productData.productThumbnailUrl.originalUrl
                  "
                />
                <div>
                  <p class="name">
                    {{ productOrderItem.productData.productName }}
                  </p>
                  <p class="price">
                    {{ productOrderItem.productPrice.toLocaleString() }}원 ({{
                      productOrderItem.count
                    }}개)
                  </p>
                  <p class="option">
                    [옵션: {{ productOrderItem.optionName }}]
                  </p>
                  <p class="point">
                    적립 예정 냥코인:
                    {{ productOrderItem.pointAmount.toLocaleString() }} 냥코인
                  </p>
                </div>
              </div>
              <hr />
              <strong>{{
                generateOrderStatusLabel(productOrderItem.status)
              }}</strong>
              <hr
                v-if="
                  productOrderIndex === orderData.productOrderDatas.length - 1
                "
              />
            </div>
          </div>
          <div class="order-info-container">
            <h4>배송지 정보</h4>
            <div>
              <div>
                <p class="title">받으시는 분</p>
                <p class="content">{{ orderData.name }}</p>
              </div>
              <div>
                <p class="title">우편번호</p>
                <p class="content">{{ orderData.postCode }}</p>
              </div>
              <div>
                <p class="title">주소</p>
                <p class="content">
                  {{ orderData.address1 }} {{ orderData.address2 }}
                </p>
              </div>
              <div>
                <p class="title">휴대전화</p>
                <p class="content">{{ orderData.phone }}</p>
              </div>
              <div>
                <p class="title">배송 메시지</p>
                <p class="content">
                  {{ orderData.deliveryMessage }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { db, auth } from '@/lib/firebase';
import { generateOrderStatusLabel } from '@/lib/utils';
import { sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc  } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const userData = ref(null);
const orderData = ref(null);
const orderStatusFilter = ref("");

const router = useRouter();
const route = useRoute();

const resetPassword = async () => {
  try {
    await sendPasswordResetEmail(auth, userData.value.userEmail);
    alert('비밀번호 초기화 링크를 전송하였습니다.\n메일보관함을 확인하세요!');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    alert('비밀번호 초기화 실패하였습니다.\n관리자에게 문의해주세요!');
  }
}

const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Date(date).toLocaleString('ko-KR', options);
}

const logout = async () => {
  await auth.signOut();
  router.push('/');
}

onMounted(async () => {
  const userDataRef = (await getDoc(doc(db, "users", auth.currentUser.uid))).data();
  userData.value = userDataRef;

  const orderSnap = await getDoc(doc(db, "order", route.query.id));
  orderData.value = orderSnap.data();

  orderData.value.productOrderDatas = [];

  for (const productOrderId of orderData.value.productOrders || []) {
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
    orderData.value.productOrderDatas.push(productOrderData);
  }

  console.log(orderData.value)
});
</script>

<style lang="scss" scoped>
.consumer-mypage-order-detail {
  padding: 36px 24px;
  margin: auto;
  max-width: 1200px;
  min-height: 70vh;

  > .main-container {
    display: flex;
    gap: 24px;

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
        > div {
          margin-top: 48px;
        }

        > .order-info-container {
          > div {
            margin-top: 16px;
            border-top: 2px solid black;
            border-bottom: 1px solid #999;
            > div {
              display: flex;

              &:not(:first-child) {
                border-top: 1px solid #999;
              }

              > .title {
                background: #efefef;
                width: 25%;
                padding: 12px 24px;
              }

              .content {
                padding: 12px 24px;
                &.primary {
                  font-weight: 700;
                  color: #007bff;
                }

                > p {
                  margin-top: 8px;

                  > span {
                    margin-left: 4px;
                    font-weight: 700;
                    color: #007bff;
                  }
                }
              }
            }
          }
        }

        > .order-list-container {
          > .order-product-container {
            margin-top: 16px;
            > .desc-container {
              margin-top: 16px;
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

                > .point {
                  margin-top: 16px;
                  color: #007bff;
                  font-weight: 700;
                }
              }
            }

            > hr {
              margin: 16px 0;
            }
          }
          > div {
            border-top: 2px solid black;

            &:not(:nth-child(2)) {
              border-top: 1px solid #999;
              margin-top: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
