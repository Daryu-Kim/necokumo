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

export function generateOrderStatusLabel(status) {
  const data = {
    BEFORE_DEPOSIT: "입금전",
    PAYMENT_COMPLETED: "결제완료",
    PREPARING_PRODUCT: "상품준비중",
    PREPARING_DELIVERY: "배송준비중",
    SHIPPING_PROGRESS: "배송중",
    DELIVERY_COMPLETED: "배송완료",
    REQUEST_CANCEL: "취소요청",
    PROCESSING_CANCEL: "취소처리중",
    HOLD_CANCEL: "취소보류",
    APPROVED_CANCEL: "취소승인",
    REQUEST_EXCHANGE: "교환요청",
    PROCESSING_EXCHANGE: "교환처리중",
    HOLD_EXCHANGE: "교환보류",
    APPROVED_EXCHANGE: "교환승인",
    REQUEST_RETURN: "반품요청",
    PROCESSING_RETURN: "반품처리중",
    HOLD_RETURN: "반품보류",
    APPROVED_RETURN: "반품승인",
  };

  return data[status];
}
