<template>
  <div class="consumer-checkout" v-if="orderItemDatas.length > 0">
    <h2>주문 / 결제</h2>
    <hr />
    <div class="delivery-info-container">
      <h3>배송지</h3>
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
              id="quick"
              v-model="deliveryWay"
              value="quick"
            />
            <label for="quick">카카오 T 퀵</label>
          </div>
          <div>
            <input
              type="radio"
              id="manual"
              v-model="deliveryWay"
              value="manual"
            />
            <label for="manual">직접수령</label>
          </div>
        </div>
        <div class="description-container">
          <div v-if="deliveryWay === 'domestic'">
            <p>CJ대한통운을 통해 발송되는 배송방법입니다.</p>
            <p>
              기본 배송료는 4,000원이며 원화 기준 5만원 이상 주문 시
              무료배송됩니다.
            </p>
            <p>제주 / 도서산간 지역은 구매 금액 상관없이 5,000원 추가됩니다.</p>
            <br />
            <p>배송 기간 : 결제 시점으로부터 영업일 기준 1 ~ 3일</p>
          </div>
          <div v-else-if="deliveryWay === 'quick'">
            <p>현재 대구 지역만 지원되니 꼭 확인 부탁드립니다.</p>
            <p>
              알림톡으로 퀵비 결제 링크가 발송됩니다. 링크를 통해 배송료 결제를
              추가로 진행해주세요.
            </p>
            <br />
            <p>배송 기간 : 결제 시점으로부터 영업일 기준 1 ~ 2일</p>
          </div>
          <div v-else>
            <p>네코쿠모 본점에서 직접 수령하는 방법입니다.</p>
            <p>상품 준비에는 당일 ~ 영업일 기준 2일 정도 걸리실 수 있으시며,</p>
            <p>상품이 준비되면 알림톡으로 연락드립니다.</p>
            <br />
            <p>픽업 가능일 : 결제 시점으로부터 영업일 기준 1 ~ 2일</p>
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
          <div v-if="deliveryWay === 'domestic' || deliveryWay === 'quick'">
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
          <input
            type="text"
            placeholder="배송 메시지를 입력해주세요."
            v-model="consumerDeliveryMessage"
          />
          <div>
            <div class="save-container">
              <input
                type="checkbox"
                id="addressSave"
                v-model="consumerAddressSave"
              />
              <label for="addressSave">
                이 주소를 저장하고 다음 주문에도 사용합니다.
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="order-items-container">
      <h3>주문 상품</h3>
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
                      item.productBankSellPrice * item.count
                    ).toLocaleString()}원`
                  : `${(item.productSellPrice * item.count).toLocaleString()}원`
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="fee-container">
        <p class="title">배송비</p>
        <p class="content">{{ deliveryFee.toLocaleString() }}원</p>
      </div>
    </div>
    <hr />
    <div class="payment-method-container">
      <h3>결제수단</h3>
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
          <label for="card">신용카드</label>
        </div>
      </div>
      <div class="desc-container" v-if="paymentMethod === 'bank'">
        <div>
          <p>입금은행<span>*</span></p>
          <input type="text" disabled value="토스뱅크 1002-2582-0340 김원재" />
        </div>
        <div>
          <p>입금자명<span>*</span></p>
          <input type="text" v-model="bankName" />
        </div>
      </div>
      <div class="desc-container" v-else>
        <div>
          <p>카드번호<span>*</span></p>
          <input
            type="text"
            maxlength="16"
            placeholder="숫자만 입력 (- 제외)"
            v-model="consumerCardNumber"
          />
        </div>
        <div>
          <p>유효기간<span>*</span></p>
          <input
            type="month"
            v-model="consumerCardValidDate"
            @change="checkCard"
          />
        </div>
        <div>
          <input type="checkbox" id="cardSave" v-model="consumercardSave" />
          <label for="cardSave">
            이 카드를 저장하고 다음 결제에도 사용합니다.
          </label>
        </div>
        <p>
          <span>결제하기 버튼</span>을 누르시면,
          <span>영업시간 내에 카드 키인 결제</span>가 진행됩니다.
        </p>
        <p>
          <span>카드 정보가 올바르지 않거나</span> 고액 결제로 인해 CVC 등
          <span>수동 승인이 필요할 경우</span>, 영업시간 내에 담당자가 통화
          요청을 진행할 수 있습니다.
        </p>
      </div>
    </div>
    <hr />
    <h3>적립금</h3>
    <div class="point-container">
      <div v-if="userData">
        <p class="title">예상 적립금</p>
        <input
          type="text"
          disabled
          :value="`${convertUserGradeCodeToPoint(
            userData.userGrade,
            paymentMethod.value === 'bank' ? totalBankPrice : totalCardPrice
          ).toLocaleString()} 냥코인`"
        />
      </div>
    </div>
    <p>적립금으로는 쇼핑몰 내에 판매중인 굿즈를 구매할 수 있습니다.</p>
    <hr />
    <button @click="checkout" v-if="paymentMethod === 'bank'">
      {{
        `${(
          totalBankPrice + (typeof deliveryFee === "string" ? 0 : deliveryFee)
        ).toLocaleString()}원`
      }}
      결제하기
    </button>
    <button @click="checkoutCard" v-else>
      {{
        `${(
          totalCardDollar + (typeof deliveryFee === "string" ? 0 : deliveryFee)
        ).toLocaleString()}원`
      }}
      결제하기
    </button>
  </div>
</template>

<script setup lang="js">
import { computed, nextTick, onMounted, ref } from 'vue';
import { db } from "@/lib/firebase";
import { getDoc, doc, setDoc, Timestamp, updateDoc, getDocs, query, collection, where, orderBy, limit } from "firebase/firestore";
import { sendPpurioMessage } from "@/lib/ppurio";
import router from '@/router';
import { getUserId } from '@/lib/auth';
import { convertUserGradeCodeToPoint } from '@/lib/utils';

const orderItemDatas = ref([]);
const recentPointData = ref(null);
const userData = ref(null);
const deliveryWay = ref('domestic');
const paymentMethod = ref('bank');
const consumerName = ref("");
const consumerPostCode = ref("");
const consumerAddress1 = ref("");
const consumerAddress2 = ref("");
const consumerPhone = ref("");
const consumerDeliveryMessage = ref("");
const consumerAddressSave = ref(false);
const consumerCardNumber = ref("");
const consumerCardValidDate = ref("");
const consumercardSave = ref(false);
const bankName = ref("");

const deliveryFee = computed(() => {
  if (deliveryWay.value === "domestic") {
    switch (paymentMethod.value) {
      case "bank":
        if (totalBankPrice.value < 50000) {
          return 4000;
        } else {
          return 0;
        }

      case "card":
        if (totalCardPrice.value < 50000) {
          return 4000;
        } else {
          return 0;
        }

      default:
        return 0;
    }
  } else {
    return 0;
  }
});

const totalBankPrice = computed(() =>
  orderItemDatas.value.reduce(
    (sum, item) => sum + item.productBankSellPrice * item.count,
    0
  )
);

const totalCardPrice = computed(() => {
  const total = orderItemDatas.value.reduce(
    (sum, item) => sum + item.productSellPrice * item.count,
    0
  );
  return total;
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
      consumerPhone.value === ""
    ) {
      alert("필수 정보를 입력해주세요!");
      return;
    }

    if (bankName.value === "") {
      alert("입금자명을 입력해주세요!");
      return;
    }

    const uid = getUserId();
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

    const tempUserData = await (await getDoc(doc(db, "users", uid))).data();

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
        productPrice: item.productBankSellPrice *
                  item.count,
        userId: uid,
        createdAt: Timestamp.fromDate(date),
        deliveryTrackingNumber: "",
        deliveryTrackingLink: "",
        deliveryCompany: "",
        pointAmount: convertUserGradeCodeToPoint(tempUserData.userGrade, item.productBankSellPrice * item.count),
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
        status: "BEFORE_PAYMENT",
        orderChannel: "NECOKUMO",
        salespersonId: tempUserData.userSalespersonCode || "",
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
      deliveryMessage: consumerDeliveryMessage.value,
      productsPrice: totalBankPrice.value,
      totalPrice: totalBankPrice.value + deliveryFee.value,
      name: consumerName.value,
      deliveryWay: deliveryWay.value,
      userId: uid,
      orderChannel: "NECOKUMO",
      updatedAt: null,
      memoContent: "",
      cashReceiptNumber: "",
      cardReceiptNumber: "",
      salespersonId: tempUserData.userSalespersonCode || "",
    });

    if (consumerAddressSave.value) {
      await updateDoc(doc(db, "users", uid), {
        userPostCode: consumerPostCode.value,
        userAddress1: consumerAddress1.value,
        userAddress2: consumerAddress2.value,
      });
    }

    if (consumercardSave.value) {
      await updateDoc(doc(db, "users", uid), {
        userCardNumber: consumerCardNumber.value,
        userCardValidDate: consumerCardValidDate.value,
      });
    }

    await sendPpurioMessage({
      targets: [
        {
          to: consumerPhone.value
        }
      ],
      targetCount: 1,
      content: `[네코쿠모] 주문이 완료되었습니다.\n아래 계좌로 입금해 주세요.\n\n주문번호: ${orderId}\n입금은행: 토스뱅크\n계좌번호: 1002-2582-0340\n예금주: 김원재\n결제금액: ${(totalBankPrice.value + deliveryFee.value).toLocaleString()}원\n\n입금 확인 후 발송됩니다. 감사합니다!`,
      refKey: `ORDER_${orderId}`,
    });
    await sendPpurioMessage({
      targets: [
        {
          to: "01055779069"
        }
      ],
      targetCount: 1,
      content: `[네코쿠모] 신규 주문 건이 있습니다.\n관리자 페이지에서 확인 부탁드립니다.\n\n주문번호: ${orderId}\n결제수단: ${paymentMethod.value === "bank" ? "무통장입금" : "신용카드"}\n결제금액: ${(totalBankPrice.value + deliveryFee.value).toLocaleString()}원`,
      refKey: `ORDER_ADMIN_${orderId}`,
    });
    if (history.state?.query === "cart") {
      await updateDoc(doc(db, "users", uid), {
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

async function checkoutCard() {
  try {
    if (
      consumerName.value === "" ||
      consumerPostCode.value === "" ||
      consumerAddress1.value === "" ||
      consumerPhone.value === ""
    ) {
      alert("필수 정보를 입력해주세요!");
      return;
    }

    const uid = getUserId();
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

    const tempUserData = await (await getDoc(doc(db, "users", uid))).data();

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
        productPrice: item.productSellPrice *
                  item.count,
        userId: uid,
        createdAt: Timestamp.fromDate(date),
        deliveryTrackingNumber: "",
        deliveryTrackingLink: "",
        deliveryCompany: "",
        pointAmount: convertUserGradeCodeToPoint(tempUserData.userGrade, item.productSellPrice * item.count),
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
        status: "BEFORE_PAYMENT",
        orderChannel: "NECOKUMO",
        salespersonId: tempUserData.userSalespersonCode || "",
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
      deliveryMessage: consumerDeliveryMessage.value,
      productsPrice: totalCardPrice.value,
      totalPrice: totalCardPrice.value + deliveryFee.value,
      name: consumerName.value,
      deliveryWay: deliveryWay.value,
      userId: uid,
      orderChannel: "NECOKUMO",
      updatedAt: null,
      memoContent: "",
      cashReceiptNumber: "",
      cardReceiptNumber: "",
      salespersonId: tempUserData.userSalespersonCode || "",
    });
    await sendPpurioMessage({
      targets: [
        {
          to: consumerPhone.value
        }
      ],
      targetCount: 1,
      content: `[네코쿠모] 주문이 완료되었습니다.\n문자로 결제요청이 도착하면 결제 부탁드리겠습니다.\n\n주문번호: ${orderId}\n결제금액: ${(totalCardPrice.value + deliveryFee.value).toLocaleString()}원\n\n결제 확인 후 발송됩니다. 감사합니다!`,
      refKey: `ORDER_${orderId}`,
    });
    if (history.state?.query === "cart") {
      await updateDoc(doc(db, "users", uid), {
        userProductCartList: [],
      });
    }

    if (consumerAddressSave.value) {
      await updateDoc(doc(db, "users", uid), {
        userPostCode: consumerPostCode.value,
        userAddress1: consumerAddress1.value,
        userAddress2: consumerAddress2.value,
      });
    }

    if (consumercardSave.value) {
      await updateDoc(doc(db, "users", uid), {
        userCardNumber: consumerCardNumber.value,
        userCardValidDate: consumerCardValidDate.value,
      })
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
  window.open("https://map.naver.com/p/entry/place/2027661166");
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

async function fetchRecentPointData() {
  try {
    console.log("Fetching User Point Data...");
    const userId = await getUserId();
    const data = (await getDocs(query(collection(db, "userPoints"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(1)))).docs[0]?.data() ?? null;
    recentPointData.value = data;
    console.log("User Point Data Fetched Successfully!: ", recentPointData.value);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

async function fetchUserData() {
  try {
    console.log("Fetching User Data...");
    const userId = await getUserId();
    const data = (await getDoc(doc(db, "users", userId))).data();
    userData.value = data;
    console.log("User Data Fetched Successfully");
  } catch (error) {
    console.error("Failed to fetch data: ", error);
  }
}

onMounted(async () => {
  try {
    const orderItems = history.state?.orderItems;
    if (!orderItems) {
      console.warn("주문 데이터가 없습니다.");
      router.replace("/");
    } else {
      console.log("받은 주문 데이터: ", orderItems);
      await fetchUserData();
      await fetchOrderItemDatas(orderItems);
      await fetchRecentPointData();
      const uid = getUserId();
      const userData = (await getDoc(doc(db, "users", uid))).data();
      consumerName.value = userData.userName;
      consumerPostCode.value = userData.userPostCode;
      consumerAddress1.value = userData.userAddress1;
      consumerAddress2.value = userData.userAddress2;
      consumerPhone.value = userData.userPhone;
      consumerCardNumber.value = userData.cardNumber || "";
      consumerCardValidDate.value = userData.cardValidDate || { month: "", year: "" };
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
</script>

<style lang="scss" scoped>
.consumer-checkout {
  padding: 16px 24px;

  > h2 {
    text-align: center;
  }

  hr {
    margin: 16px 0;
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
        gap: 12px;
        > div {
          display: flex;
          align-items: center;
          gap: 6px;
          > input {
            width: 16px;
            height: 16px;
          }
          > label {
            font-size: 16px;
          }
        }
      }

      > .description-container {
        margin-top: 16px;
        p {
          font-size: 14px;
          line-height: 20px;
        }

        button {
          background: black;
          color: white;
          font-size: 14px;
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
          gap: 8px;

          &:not(:first-child) {
            margin-top: 16px;
          }
          > p {
            min-width: 72px;
            line-height: 36px;
            font-size: 14px;

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
                font-size: 14px;
                border-radius: 4px;
              }

              > button {
                min-width: 72px;
                height: 36px;
                background: black;
                color: white;
                font-size: 14px;
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

          > .save-container {
            display: flex;
            align-items: center;
            gap: 16px;

            > input {
              width: fit-content;
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
          width: 96px;
          height: 96px;
        }

        > div {
          > .product-name {
            font-weight: 700;
            font-size: 16px;
          }

          > .option-name {
            font-size: 14px;
            margin-top: 8px;
          }

          > .option-count {
            font-size: 12px;
            margin-top: 4px;
          }

          > .option-price {
            font-size: 16px;
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
        font-size: 14px;
        color: #666;
      }

      > .content {
        font-size: 16px;
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
      gap: 8px;

      > div {
        display: flex;
        align-items: center;
        gap: 8px;

        > p {
          min-width: 72px;
          line-height: 36px;
          font-size: 14px;

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
          font-size: 14px;
          border-radius: 4px;

          &[type="checkbox"] {
            width: fit-content;
          }
        }
      }

      > p {
        &:nth-child(4) {
          margin-top: 16px;
        }

        > span {
          color: #007bff;
          font-weight: 700;
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

  > .point-container {
    padding: 12px 16px;
    background-color: #efefef;
    margin-top: 24px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    > div {
      display: flex;
      align-items: center;
      gap: 16px;

      > .title {
        width: 96px;
        line-height: 38px;
      }

      > input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid black;
        font-size: 16px;
        border-radius: 4px;
      }

      > div {
        flex: 1;
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
}
</style>
