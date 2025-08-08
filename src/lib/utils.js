export async function generateUUIDFromSeed(seed) {
  const encoder = new TextEncoder();
  const data = encoder.encode(seed);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data); // returns a Promise
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // 월은 0부터 시작
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function generateDeliveryCompanyLabel(company) {
  const data = {
    MANUAL: "직접전달",
    LOGEN: "로젠택배",
    CJ: "CJ대한통운",
    ZERODAY: "제로데이택배",
  };

  return data[company];
}

export function generateDeliveryTrackingLinkOrigin(company) {
  const data = {
    MANUAL: "",
    LOGEN: "https://www.ilogen.com/web/personal/trace/",
    CJ: "https://trace.cjlogistics.com/web/detail.jsp?slipno=",
    ZERODAY: "",
  };

  return data[company];
}

export function generateOrderStatusLabel(status) {
  const data = {
    BEFORE_DEPOSIT: "입금전",
    PAYMENT_COMPLETED: "결제완료",
    PREPARING_PRODUCT: "상품준비중",
    PREPARING_DELIVERY: "배송준비중",
    SHIPPING_PROGRESS: "배송중",
    DELIVERY_COMPLETED: "배송완료",
    CANCELLED: "취소",
    REQUEST_CANCEL: "취소요청",
    PROCESSING_CANCEL: "취소처리중",
    HOLD_CANCEL: "취소보류",
    APPROVED_CANCEL: "취소승인",
    EXCHANGE: "교환",
    REQUEST_EXCHANGE: "교환요청",
    PROCESSING_EXCHANGE: "교환처리중",
    HOLD_EXCHANGE: "교환보류",
    APPROVED_EXCHANGE: "교환승인",
    RETURNED: "반품",
    REQUEST_RETURN: "반품요청",
    PROCESSING_RETURN: "반품처리중",
    HOLD_RETURN: "반품보류",
    APPROVED_RETURN: "반품승인",
  };

  return data[status];
}

export function deliveryCompanyFormatter(value, row) {
  const id = row[3]?.content || ""; // 혹시 index가 다를 경우 대비

  const options = [
    { value: "", label: "배송업체 선택" },
    { value: "MANUAL", label: "직접전달" },
    { value: "LOGEN", label: "로젠택배" },
    { value: "CJ", label: "CJ대한통운" },
    { value: "ZERODAY", label: "제로데이택배" },
  ];

  const selectOptions = options
    .map(
      (opt) =>
        `<option value="${opt.value}" ${
          value === opt.value ? "selected" : ""
        }>${opt.label}</option>`
    )
    .join("");

  return `
    <select class="delivery-select" data-id="${id}">
      ${selectOptions}
    </select>
  `;
}
