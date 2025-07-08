<template>
  <div class="consumer-checkout" v-if="orderItemDatas.length > 0">
    <h1>주문 / 결제</h1>
    <hr />
    <div class="delivery-info-container">
      <h2>배송지</h2>
      <div class="delivery-way-container">
        <div class="select-container">
          <div>
            <input
              type="radio"
              id="domestic"
              v-model="deliveryWay"
              value="domestic"
            />
            <label for="domestic">국내배송</label>
          </div>
          <div>
            <input
              type="radio"
              id="international"
              v-model="deliveryWay"
              value="international"
              disabled
            />
            <label for="international">해외배송</label>
          </div>
          <div>
            <input
              type="radio"
              id="subway"
              v-model="deliveryWay"
              value="subway"
              disabled
            />
            <label for="subway">지하철역 무인보관함</label>
          </div>
          <div>
            <input
              type="radio"
              id="convenience"
              v-model="deliveryWay"
              value="convenience"
              disabled
            />
            <label for="convenience">편의점 반값택배</label>
          </div>
          <div>
            <input
              type="radio"
              id="quick"
              v-model="deliveryWay"
              value="quick"
              disabled
            />
            <label for="quick">카카오 T 퀵</label>
          </div>
          <div>
            <input
              type="radio"
              id="manual"
              v-model="deliveryWay"
              value="manual"
              disabled
            />
            <label for="manual">직접수령</label>
          </div>
        </div>
        <div class="description-container">
          <div v-if="deliveryWay === 'domestic'">
            <p>한진택배를 통해 발송되는 배송방법입니다.</p>
            <p>
              기본 배송료는 3,500원이며 원화 기준 5만원 이상 주문 시
              무료배송됩니다.
            </p>
            <p>제주 / 도서산간 지역은 구매 금액 상관없이 5,000원 추가됩니다.</p>
          </div>
          <div v-else-if="deliveryWay === 'international'">
            <p>현재 미국, 일본 배송만 지원됩니다.</p>
            <p>
              상품 가격 먼저 결제 후, 문자 혹은 이메일로 배송료 결제 안내를
              받으면 마이페이지에서 배송료 결제를 추가로 진행해주세요.
            </p>
          </div>
          <div v-else-if="deliveryWay === 'subway'">
            <p>
              "또타라커" 어플을 통해 받고자 하는 지하철역을 검색한 후, 받으실
              무인보관함 고유번호를 입력해주세요. (ex. 동대문 TL128A)
            </p>
            <div class="app-link-container">
              <a
                href="https://play.google.com/store/search?q=%EB%98%90%ED%83%80%EB%9D%BC%EC%BB%A4&c=apps"
                target="_blank"
              >
                <img src="@/assets/google.png" />
              </a>
              <a
                href="https://apps.apple.com/kr/app/t-locker-%EB%98%90%ED%83%80%EB%9D%BC%EC%BB%A4-%EC%A7%80%ED%95%98%EC%B2%A0-%EB%AC%BC%ED%92%88-%EB%B3%B4%EA%B4%80-%EC%A0%84%EB%8B%AC%ED%95%A8/id1503291383"
                target="_blank"
              >
                <img src="@/assets/apple.png" />
              </a>
            </div>
          </div>
          <div v-else-if="deliveryWay === 'convenience'">
            <p>편의점 반값택배를 통해 발송되는 배송방법입니다.</p>
            <p>받으실 편의점 지점명을 정확하게 적어주세요.</p>
            <p>
              기본 배송료는 3,000원이며 원화 기준 5만원 이상 주문 시
              무료배송됩니다.
            </p>
            <p>제주 / 도서산간 지역은 구매 금액 상관없이 5,000원 추가됩니다.</p>
          </div>
          <div v-else-if="deliveryWay === 'quick'">
            <p>현재 수도권 지역만 지원됩니다.</p>
            <p>
              상품 가격 먼저 결제 후, 문자 혹은 이메일로 배송료 결제 안내를
              받으면 마이페이지에서 배송료 결제를 추가로 진행해주세요.
            </p>
          </div>
          <div v-else>
            <p>인천에 있는 사무실에서 직접 수령하는 배송방법입니다.</p>
            <p>상품이 준비되면 문자와 이메일로 연락드립니다.</p>
            <button @click="openMapPopup">지도보기</button>
          </div>
        </div>
      </div>
      <div class="address-container">
        <div>
          <div>
            <p>받는사람<span style="color: #007bff">*</span></p>
            <input type="text" v-model="consumerName" />
          </div>
          <div>
            <p>주소<span style="color: #007bff">*</span></p>
            <div>
              <div>
                <input
                  type="text"
                  disabled
                  placeholder="우편번호 (ex. 12345)"
                  v-model="consumerPostCode"
                />
                <button @click="openDaumPostcode">주소검색</button>
              </div>
              <input
                type="text"
                disabled
                placeholder="기본 주소"
                v-model="consumerAddress1"
              />
              <input
                type="text"
                placeholder="나머지 주소"
                v-model="consumerAddress2"
              />
            </div>
          </div>
          <div>
            <p>휴대전화<span style="color: #007bff">*</span></p>
            <input type="tel" v-model="consumerPhone" />
          </div>
          <div>
            <p>이메일<span style="color: #007bff">*</span></p>
            <input type="email" v-model="consumerEmail" />
          </div>
          <input
            type="text"
            placeholder="배송 메시지를 입력해주세요."
            v-model="consumerDeliveryMessage"
          />
        </div>
      </div>
    </div>
    <hr />
    <div class="order-items-container">
      <h2>주문 상품</h2>
      <div class="item-container">
        <div v-for="item in orderItemDatas" :key="item.id">
          <img :src="item.productThumbnailUrl.originalUrl" />
          <div>
            <p class="product-name">{{ item.productName }}</p>
            <p class="option-name">옵션: {{ item.optionName }}</p>
            <p class="option-count">수량: {{ item.count }}개</p>
            <p class="option-price">
              {{
                paymentMethod === "bank"
                  ? `${(
                      item.productSellPrice *
                      item.count *
                      0.95
                    ).toLocaleString()}원`
                  : `${(
                      Math.ceil(
                        ((item.productSellPrice * item.count * 0.97) /
                          usdPrice) *
                          100
                      ) / 100
                    ).toLocaleString()}$`
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="fee-container">
        <p class="title">배송비</p>
        <p class="content">
          {{ deliveryFee.toLocaleString()
          }}{{
            deliveryWay === "domestic" ||
            deliveryWay === "convenience" ||
            deliveryWay === "manual"
              ? paymentMethod === "bank"
                ? "원"
                : "$"
              : ""
          }}
        </p>
      </div>
    </div>
    <hr />
    <div class="payment-method-container">
      <h2>결제수단</h2>
      <div class="input-container">
        <div
          @click="paymentMethod = 'bank'"
          :class="paymentMethod === 'bank' ? 'active' : ''"
        >
          <input
            type="radio"
            id="bank"
            v-model="paymentMethod"
            value="bank"
            style="display: none"
          />
          <label for="bank">무통장입금</label>
        </div>
        <div
          @click="paymentMethod = 'card'"
          :class="paymentMethod === 'card' ? 'active' : ''"
        >
          <input
            type="radio"
            id="card"
            v-model="paymentMethod"
            value="card"
            style="display: none"
          />
          <label for="card">PayPal 신용카드</label>
        </div>
      </div>
      <div class="desc-container" v-if="paymentMethod === 'bank'">
        <div>
          <p>입금은행<span>*</span></p>
          <input type="text" disabled value="케이뱅크 100-151-009519 김원재" />
        </div>
        <div>
          <p>입금자명<span>*</span></p>
          <input type="text" v-model="bankName" />
        </div>
      </div>
      <div class="desc-container" v-else>
        <p>PayPal로 결제를 위해 <span>달러($)</span>로 결제됩니다.</p>
        <p>
          PayPal 결제는
          <span>해외결제가 지원되는 카드(Visa, Mastercard 등)</span>를 이용해야
          결제가 가능합니다.
        </p>
        <p>
          카드사에서 해외 원화 결제 차단을 활성화하면 이중환전이 되지 않아
          <span>수수료 없이 더욱 저렴하게 구매</span>가 가능합니다.
        </p>
        <p>
          할부의 경우 PayPal 결제 후
          <span>카드사 어플이나 고객센터를 통해 할부로 전환</span>이 가능합니다.
        </p>
      </div>
    </div>
    <hr />
    <button @click="checkout" v-if="paymentMethod === 'bank'">
      {{
        paymentMethod === "bank"
          ? `${(
              totalBankPrice +
              (typeof deliveryFee === "string" ? 0 : deliveryFee)
            ).toLocaleString()}원`
          : `${(
              totalCardDollar +
              (typeof deliveryFee === "string" ? 0 : deliveryFee)
            ).toLocaleString()}$`
      }}
      결제하기
    </button>
    <div
      v-else
      ref="paypalButtonContainer"
      class="paypal-button-container"
    ></div>
  </div>
</template>

<script setup lang="js">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { auth, db } from "@/lib/firebase";
import { getDoc, doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { fetchExchangeRate } from '@/lib/paypal';
import { sendAligoMessage } from "@/lib/aligo";
import router from '@/router';

const usdPrice = ref(0);
const orderItemDatas = ref([]);
const deliveryWay = ref('domestic');
const paymentMethod = ref('bank');
const consumerName = ref("");
const consumerPostCode = ref("");
const consumerAddress1 = ref("");
const consumerAddress2 = ref("");
const consumerPhone = ref("");
const consumerEmail = ref("");
const consumerDeliveryMessage = ref("");
const bankName = ref("");
const paypalButtonContainer = ref(null);

const deliveryFee = computed(() => {
  switch (deliveryWay.value) {
    case 'domestic':
      if (totalBankPrice.value < 50000) {
        let fee = 0;
        if (paymentMethod.value === 'bank') {
          fee = 3500;
        } else {
          fee = Math.ceil((3500 / usdPrice.value) * 100) / 100;
        }
        return fee;
      } else {
        return 0;
      }
    case 'international':
      return "마이페이지에서 결제 필요";
    case 'subway':
      return "마이페이지에서 결제 필요";
    case 'convenience':
      if (totalBankPrice.value < 50000) {
        let fee = 0;
        if (paymentMethod.value === 'bank') {
          fee = 3000;
        } else {
          fee = Math.ceil((3000 / usdPrice.value) * 100) / 100;
        }
        return fee;
      } else {
        return 0;
      }
    case 'quick':
      return "마이페이지에서 결제 필요";
    case 'manual':
      return 0;
    default:
      return 0;
  }
});

const totalBankPrice = computed(() =>
  orderItemDatas.value.reduce(
    (sum, item) => sum + item.productSellPrice * item.count * 0.95,
    0
  )
);

const totalCardDollar = computed(() => {
  const total = orderItemDatas.value.reduce(
    (sum, item) => sum + item.productSellPrice * item.count * 0.97,
    0
  );
  return Math.ceil((total / usdPrice.value) * 100) / 100;
});

function openDaumPostcode() {
  new window.daum.Postcode({
    oncomplete: (data) => {
      // 기본 주소
      let extraAddr = '';

      // 참고항목이 있을 경우
      if (data.addressType === 'R') {
        if (data.bname !== '') extraAddr += data.bname;
        if (data.buildingName !== '') {
          extraAddr += extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
        }
      }

      consumerPostCode.value = data.zonecode;
      consumerAddress1.value = data.address;
      consumerAddress2.value = `(${extraAddr}) `;
      // 포커스를 상세 주소로 옮김
      nextTick(() => {
        document.querySelector('input[placeholder="나머지 주소"]')?.focus();
      });
    },
  }).open();
}

async function checkout() {
  try {
    if (
      consumerName.value === "" ||
      consumerPostCode.value === "" ||
      consumerAddress1.value === "" ||
      consumerPhone.value === "" ||
      consumerEmail.value === ""
    ) {
      alert("필수 정보를 입력해주세요!");
      return;
    }

    if (bankName.value === "") {
      alert("입금자명을 입력해주세요!");
      return;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");;
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const randomPart = [...Array(6)].map(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    const orderId = `${year}${month}${day}_${hour}${minute}${seconds}_${randomPart}`;
    const productOrders = [];

    orderItemDatas.value.forEach(async (item, index) => {
      const padIndex = index.toString().padStart(2, "0");
      const padOrderId = `${orderId}_${padIndex}`;
      productOrders.push(padOrderId);
      await setDoc(doc(db, "productOrder", padOrderId), {
        orderId: orderId,
        productOrderId: padOrderId,
        productId: item.id,
        productName: item.productName,
        optionName: item.optionName,
        count: item.count,
        usdPrice: usdPrice.value,
        orderChannel: "NECOKUMO",
        productPrice: item.productSellPrice *
                  item.count *
                  0.95,
        currency: "KRW",
        userId: auth.currentUser.uid,
        createdAt: Timestamp.fromDate(date),
        status: "BEFORE_DEPOSIT",
        deliveryTrackingNumber: "",
        deliveryTrackingLink: "",
        deliveryCompany: "",
        pointAmount: item.productSellPrice *
                    item.count *
                    0.95 * 0.03,
        pointGived: false,
        claimType: "",
        claimReason: "",
        claimStatus: "",
        claimRequestedAt: null,
        claimProcessedAt: null,
        returnTrackingNumber: "",
        returnTrackingLink: "",
        returnCompany: "",
        returnStatus: "",
        returnReceivedAt: null,
      });
    });
    await setDoc(doc(db, "order", orderId), {
      orderId: orderId,
      productOrders:  productOrders,
      createdAt: Timestamp.fromDate(date),
      deliveryFee: deliveryFee.value,
      paymentMethod: paymentMethod.value,
      bankName: bankName.value,
      postCode: consumerPostCode.value,
      address1: consumerAddress1.value,
      address2: consumerAddress2.value,
      phone: consumerPhone.value,
      email: consumerEmail.value,
      deliveryMessage: consumerDeliveryMessage.value,
      productsPrice: totalBankPrice.value,
      totalPrice: totalBankPrice.value + deliveryFee.value,
      name: consumerName.value,
      deliveryWay: deliveryWay.value,
      paymentAt: null,
      deliveryFeePaymentRequired: false,
      userId: auth.currentUser.uid,
      orderChannel: "NECOKUMO",
      deliveryFeePaymentLink: "",
      deliveryFeePaied: false,
      deliveryFeeCardAcceptNumber: "",
      updatedAt: null,
      currency: "KRW",
      cardAcceptNumber: "",
      memoContent: "",
    });
    await sendAligoMessage({
      receiver: consumerPhone.value,
      msg: `[네코쿠모] 주문이 완료되었습니다.\n아래 계좌로 입금해 주세요.\n\n주문번호: ${orderId}\n입금은행: 케이뱅크\n계좌번호: 100-151-009519\n예금주: 김원재\n\n입금 확인 후 발송됩니다. 감사합니다!`,
      msg_type: "LMS",
      title: "[네코쿠모 무통장입금 계좌 안내]",
    });
    if (history.state?.query === "cart") {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        userProductCartList: [],
      });
    }
    router.push({
      path: "/order-complete",
      state: { orderId },
    });

  } catch (error) {
    console.error("Checkout Error: ", error);
  }
}

function openMapPopup() {
  window.open("https://naver.me/5RhLKSA0");
}

async function fetchOrderItemDatas(orderItems) {
  try {
    console.log("Fetching Product Data...");
    for (const item of orderItems) {
      const product = await getDoc(doc(db, "product", item.productCode));
      orderItemDatas.value.push({ id: product.id, ...product.data(), optionName: item.optionName, count: item.count });
    }
    console.log("Product Data Fetched Successfully!: ", orderItemDatas.value);
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
  try {
    await loadPayPalSDK();
    const orderItems = history.state?.orderItems;
    if (!orderItems) {
      console.warn("주문 데이터가 없습니다.");
      router.replace("/");
    } else {
      console.log("받은 주문 데이터: ", orderItems);
      await fetchUSDPrice();
      await fetchOrderItemDatas(orderItems);
      const userData = (await getDoc(doc(db, "users", auth.currentUser.uid))).data();
      consumerName.value = userData.userName;
      consumerPostCode.value = userData.userPostCode;
      consumerAddress1.value = userData.userAddress1;
      consumerAddress2.value = userData.userAddress2;
      consumerPhone.value = userData.userPhone;
      consumerEmail.value = userData.userEmail;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

watch(paymentMethod, async (newVal) => {
  if (newVal !== 'bank') {
    await nextTick(); // DOM이 렌더된 다음
    if (paypalButtonContainer.value && window.paypal) {
      window.paypal.Buttons({
        createOrder(data, actions) {
          if (
            consumerName.value === "" ||
            consumerPostCode.value === "" ||
            consumerAddress1.value === "" ||
            consumerPhone.value === "" ||
            consumerEmail.value === ""
          ) {
            alert("필수 정보를 입력해주세요!");
            // 결제 흐름을 중단하려면 reject Promise
            return actions.reject(); // 중요!
          }

          const paymentAmount = totalCardDollar.value + deliveryFee.value;
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: paymentAmount.toString(),
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
              // ✅ 정상 결제 처리
              const date = new Date();
              const year = date.getFullYear();
              const month = (date.getMonth() + 1).toString().padStart(2, "0");
              const day = date.getDate().toString().padStart(2, "0");
              const hour = date.getHours().toString().padStart(2, "0");
              const minute = date.getMinutes().toString().padStart(2, "0");;
              const seconds = date.getSeconds().toString().padStart(2, "0");
              const randomPart = [...Array(6)].map(() => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                return chars[Math.floor(Math.random() * chars.length)];
              }).join('');
              const orderId = `${year}${month}${day}_${hour}${minute}${seconds}_${randomPart}`;
              const productOrders = [];

              orderItemDatas.value.forEach(async (item, index) => {
                const padIndex = index.toString().padStart(2, "0");
                const padOrderId = `${orderId}_${padIndex}`;
                productOrders.push(padOrderId);
                await setDoc(doc(db, "productOrder", padOrderId), {
                  orderId: orderId,
                  productOrderId: padOrderId,
                  productId: item.id,
                  productName: item.productName,
                  optionName: item.optionName,
                  orderChannel: "NECOKUMO",
                  count: item.count,
                  userId: auth.currentUser.uid,
                  usdPrice: usdPrice.value,
                  productPrice: Math.ceil(
                              ((item.productSellPrice * item.count * 0.97) /
                                usdPrice.value) *
                                100
                            ) / 100,
                  currency: "USD",
                  createdAt: Timestamp.fromDate(date),
                  status: "PAYMENT_COMPLETED",
                  deliveryTrackingNumber: "",
                  deliveryTrackingLink: "",
                  deliveryCompany: "",
                  pointAmount: item.productSellPrice *
                              item.count *
                              0.97 * 0.03,
                  pointGived: false,
                  claimType: "",
                  claimReason: "",
                  claimStatus: "",
                  claimRequestedAt: null,
                  claimProcessedAt: null,
                  returnTrackingNumber: "",
                  returnTrackingLink: "",
                  returnCompany: "",
                  returnStatus: "",
                  returnReceivedAt: null,
                });
              });
              await setDoc(doc(db, "order", orderId), {
                orderId: orderId,
                productOrders:  productOrders,
                createdAt: Timestamp.fromDate(date),
                deliveryFee: deliveryFee.value,
                paymentMethod: paymentMethod.value,
                bankName: "",
                postCode: consumerPostCode.value,
                address1: consumerAddress1.value,
                address2: consumerAddress2.value,
                phone: consumerPhone.value,
                orderChannel: "NECOKUMO",
                email: consumerEmail.value,
                userId: auth.currentUser.uid,
                deliveryMessage: consumerDeliveryMessage.value,
                productsPrice: totalCardDollar.value,
                totalPrice: totalCardDollar.value + deliveryFee.value,
                name: consumerName.value,
                deliveryWay: deliveryWay.value,
                paymentAt: details.update_time,
                deliveryFeePaymentRequired: false,
                deliveryFeePaymentLink: "",
                deliveryFeePaied: false,
                deliveryFeeCardAcceptNumber: "",
                updatedAt: null,
                currency: "USD",
                cardAcceptNumber: details.purchase_units[0].payments.captures[0].id,
                memoContent: "",
              });
              console.log("결제 성공:", details);
              await sendAligoMessage({
                receiver: consumerPhone.value,
                msg: `[네코쿠모] 주문 및 결제가 완료되었습니다.\n\n주문번호: ${orderId}\n결제수단: PayPal\n\n상품은 곧 배송 준비에 들어갑니다. 감사합니다!`,
                msg_type: "LMS",
                title: "[네코쿠모 주문 및 결제 내역 안내]",
              });
              if (history.state?.query === "cart") {
                await updateDoc(doc(db, "users", auth.currentUser.uid), {
                  userProductCartList: [],
                });
              }
              router.push({
                path: "/order-complete",
                state: { orderId },
              });
            } else {
              // ⚠️ 보류되거나 실패한 결제
              console.warn("결제 상태:", details.status);
              alert("결제가 완료되지 않았습니다. 상태: " + details.status);
            }
          }).catch((err) => {
            // ❌ 완전한 실패 (네트워크/권한 등)
            console.error("결제 처리 중 오류: ", err);
            alert("결제 처리 중 문제가 발생했습니다.");
          });
        },
        onError(err) {
          // ❌ 완전한 실패 (네트워크/권한 등)
          console.error("결제 처리 중 오류: ", err);
          alert("결제 처리 중 문제가 발생했습니다.");
        }
      }).render(paypalButtonContainer.value)
    } else {
      console.error('PayPal container is not ready')
    }
  }
})
</script>

<style lang="scss" scoped>
.consumer-checkout {
  padding: 36px 24px;
  margin: auto;
  max-width: 1200px;

  > h1 {
    text-align: center;
  }

  hr {
    margin: 48px 0;
    border: none;
    border-bottom: 1px solid #efefef;
  }

  > .delivery-info-container {
    > .delivery-way-container {
      margin-top: 16px;
      > .select-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        > div {
          display: flex;
          align-items: center;
          gap: 6px;
          > input {
            width: 20px;
            height: 20px;
          }
          > label {
            font-size: 18px;
          }
        }
      }

      > .description-container {
        margin-top: 16px;
        p {
          font-size: 16px;
          line-height: 24px;
        }

        button {
          background: black;
          color: white;
          font-size: 16px;
          cursor: pointer;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 700;
          margin-top: 4px;
        }

        .app-link-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          > a {
            height: 48px;
            > img {
              height: 48px;
            }
          }
        }
      }
    }

    > .address-container {
      margin-top: 24px;
      > div {
        > div {
          display: flex;
          gap: 16px;

          &:not(:first-child) {
            margin-top: 16px;
          }
          > p {
            width: 96px;
            line-height: 38px;

            > span {
              margin-left: 4px;
            }
          }

          > div {
            width: 100%;

            > div {
              display: flex;
              align-items: center;
              gap: 8px;
              > input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #efefef;
                width: 100%;
                font-size: 16px;
                border-radius: 4px;
              }

              > button {
                width: 96px;
                height: 38px;
                background: black;
                color: white;
                font-size: 16px;
                cursor: pointer;
                border: none;
                border-radius: 4px;
                font-weight: 700;
              }
            }

            > input {
              width: 100%;
              padding: 8px 12px;
              border: 1px solid #efefef;
              width: 100%;
              font-size: 16px;
              border-radius: 4px;
              &:not(:first-child) {
                margin-top: 16px;
              }
            }
          }

          > input {
            padding: 8px 12px;
            border: 1px solid #efefef;
            width: 100%;
            font-size: 16px;
            border-radius: 4px;
          }
        }

        > input {
          margin-top: 24px;
          padding: 8px 12px;
          border: 1px solid #efefef;
          width: 100%;
          font-size: 16px;
          border-radius: 4px;
        }
      }
    }
  }

  > .order-items-container {
    > .item-container {
      margin-top: 24px;
      > div {
        display: flex;
        gap: 16px;

        &:not(:first-child) {
          margin-top: 16px;
        }

        > img {
          width: 128px;
        }

        > div {
          > .product-name {
            font-weight: 700;
            font-size: 20px;
          }

          > .option-name {
            font-size: 18px;
            margin-top: 8px;
          }

          > .option-count {
            font-size: 16px;
            margin-top: 4px;
          }

          > .option-price {
            font-size: 18px;
            font-weight: 700;
            margin-top: 8px;
          }
        }
      }
    }

    > .fee-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 24px;
      background-color: #efefef;
      border-radius: 4px;
      padding: 12px 16px;

      > .title {
        font-size: 16px;
        color: #666;
      }

      > .content {
        font-size: 18px;
        font-weight: 700;
      }
    }
  }

  > .payment-method-container {
    > .input-container {
      margin-top: 24px;
      > div {
        border: 1px solid #efefef;
        padding: 16px;
        cursor: pointer;
        > label {
          cursor: pointer;
        }

        &.active {
          border-color: #007bff;
          > label {
            color: #007bff;
            font-weight: 700;
          }
        }
      }
    }

    > .desc-container {
      padding: 12px 16px;
      background-color: #efefef;
      margin-top: 16px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      > div {
        display: flex;
        align-items: center;
        gap: 16px;

        > p {
          width: 96px;
          line-height: 38px;

          > span {
            margin-left: 4px;
            color: #007bff;
            font-weight: 700;
          }
        }

        > input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid black;
          font-size: 16px;
          border-radius: 4px;
        }
      }

      > p {
        > span {
          color: #007bff;
          font-weight: 700;
        }
      }
    }
  }

  > button {
    background: black;
    width: 100%;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: 700;
    font-size: 18px;
    border-radius: 4px;
    height: 48px;
  }

  .paypal-button-container {
    width: 600px;
    margin: 0 auto;
  }
}
</style>
