<template>
  <div class="consumer-mypage-order-detail" v-if="userData && orderData">
    <div class="main-container">
      <div class="order-container">
        <div>
          <h2>주문 상세조회</h2>
          <div class="order-info-container first">
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
                    orderData.paymentMethod === "bank" ? "무통장입금" : "PayPal"
                  }}
                </p>
              </div>
              <div>
                <p class="title">총 상품금액</p>
                <p class="content">
                  {{ orderData.productsPrice.toLocaleString() }}
                  {{ orderData.currency === "KRW" ? "원" : "$" }}
                </p>
              </div>
              <div>
                <p class="title">배송비</p>
                <p class="content">
                  {{ orderData.deliveryFee.toLocaleString() }}
                  {{ orderData.currency === "KRW" ? "원" : "$" }}
                </p>
              </div>
              <div>
                <p class="title">배송비 추가 결제 필요 여부</p>
                <p
                  class="content"
                  :class="orderData.deliveryFeePaymentRequired ? 'primary' : ''"
                >
                  {{
                    orderData.deliveryFeePaymentRequired
                      ? "필요함"
                      : "필요하지 않음"
                  }}
                </p>
              </div>
              <div v-if="orderData.deliveryFeePaymentRequired">
                <p class="title">배송비 추가 결제</p>
                <div class="content" v-if="!orderData.deliveryFeePaied">
                  <div ref="paypalButtonContainer"></div>
                  <p>또는, 새마을금고 9003-2983-9984-9 김원재</p>
                  <p class="primary">
                    ({{ orderData.deliveryFee.toLocaleString() }}
                    {{ orderData.currency === "KRW" ? "원" : "$" }})
                  </p>
                </div>
                <p class="content primary" v-else>결제완료</p>
              </div>
              <div>
                <p class="title">총 결제금액</p>
                <div class="content">
                  {{ orderData.totalPrice.toLocaleString() }}
                  {{ orderData.currency === "KRW" ? "원" : "$" }}
                </div>
              </div>
            </div>
          </div>
          <div class="order-list-container">
            <h4>
              주문 상품 정보<span
                >(총 {{ orderData.productOrders.length }}건 /
                {{ orderData.productsPrice.toLocaleString()
                }}{{ orderData.currency === "KRW" ? "원" : "$" }})</span
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
                    {{ productOrderItem.productPrice.toLocaleString()
                    }}{{ productOrderItem.currency === "KRW" ? "원" : "$" }} ({{
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
import { sendPpurioMessage } from '@/lib/ppurio';
import { db, auth } from '@/lib/firebase';
import { fetchExchangeRate } from '@/lib/paypal';
import { generateOrderStatusLabel } from '@/lib/utils';
import { doc, getDoc, updateDoc  } from 'firebase/firestore';
import { onMounted, ref, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';

const userData = ref(null);
const orderData = ref(null);
const orderStatusFilter = ref("");
const paypalButtonContainer = ref(null);
const route = useRoute();

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

function loadPayPalSDK() {
  return new Promise((resolve, reject) => {
    if (window.paypal) return resolve();
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AdKgezyAzq_AQhtF4i1R1UT7CnSpGh_Vqck8lCBACg2aCe_TkPLsaTGeyzvHRgOmsB8H0GJ-tINVZ24u&currency=USD';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

onMounted(async () => {
  await loadPayPalSDK();
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

watch(
  () => orderData.value?.deliveryFeePaymentRequired,
  async (required) => {
    if (required) {
      await nextTick();
      if (paypalButtonContainer.value && window.paypal) {
        const usdPrice = await fetchExchangeRate();
        const priceInUSD = Math.ceil((orderData.value.deliveryFee / usdPrice) * 100) / 100;
        window.paypal.Buttons({
          createOrder(data, actions) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: priceInUSD.toString(),
                  currency_code: "USD"
                }
              }],
              application_context: {
                shipping_preference: "NO_SHIPPING"
              }
            });
          },
          onApprove(data, actions) {
            return actions.order.capture().then(async (details) => {
              if (details.status === "COMPLETED") {
                const orderId = orderData.value.orderId;
                await updateDoc(doc(db, "order", orderId), {
                  deliveryFeePaied: true,
                  deliveryFeeCardAcceptNumber:
                    details.purchase_units[0].payments.captures[0].id,
                });
                await sendPpurioMessage({
                  receiver: orderData.value.userPhone,
                  msg: `[네코쿠모] 배송비 결제가 완료되었습니다.\n\n주문번호: ${orderId}\n결제수단: PayPal\n\n상품은 곧 배송 준비에 들어갑니다. 감사합니다!`,
                  msg_type: "LMS",
                  title: "[네코쿠모 주문 및 결제 내역 안내]",
                });
                window.location.reload();
              } else {
                alert("결제가 완료되지 않았습니다. 상태: " + details.status);
              }
            }).catch((err) => {
              console.error("결제 처리 중 오류: ", err);
              alert("결제 처리 중 문제가 발생했습니다.");
            });
          },
          onError(err) {
            console.error("결제 처리 중 오류: ", err);
            alert("결제 처리 중 문제가 발생했습니다.");
          }
        }).render(paypalButtonContainer.value);
      } else {
        console.error('PayPal container is not ready (inside watch)');
      }
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.consumer-mypage-order-detail {
  padding: 16px 24px;

  > .main-container {
    > .order-container {
      > div {
        > h2 {
          text-align: center;
        }

        > div {
          margin-top: 48px;
        }

        > .order-info-container {
          &.first {
            margin-top: 24px;
          }

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
                min-width: 96px;
                max-width: 96px;
                word-break: keep-all;
                padding: 12px 24px;
                font-size: 14px;
              }

              .content {
                flex: 1;
                min-width: 0;
                padding: 12px 24px;
                word-break: keep-all;
                font-size: 14px;
                &.primary {
                  font-weight: 700;
                  color: #007bff;
                }

                > p {
                  margin-top: 8px;
                  word-break: keep-all;

                  &.primary {
                    font-weight: 700;
                    color: #007bff;
                  }
                }
              }
            }
          }
        }

        > .order-list-container {
          margin-top: 48px;
          > .order-product-container {
            margin-top: 16px;
            > .desc-container {
              margin-top: 16px;
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

                > .point {
                  margin-top: 16px;
                  color: #007bff;
                  font-weight: 700;
                  font-size: 14px;
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
