import CryptoJS from "crypto-js";

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
    BEFORE_PAYMENT: "결제전",
    PAYMENT_COMPLETED: "결제완료",
    PREPARING_PRODUCT: "상품준비중",
    PREPARING_DELIVERY: "배송준비중",
    SHIPPING_PROGRESS: "배송중",
    DELIVERY_COMPLETED: "배송완료",
    CONFIRM_PURCHASE: "구매확정",
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

export function generateTempPasswordCryptoJS(phone, opts = {}) {
  const randLen = opts.randomLettersLength ?? 3; // 무작위 영문 길이
  const tailLen = opts.phoneTailLength ?? 4; // 휴대폰 뒷자리 길이

  // 1) 휴대폰 숫자만 추출
  const digits = String(phone).replace(/\D/g, "");

  // 2) 휴대폰 뒷자리 확보
  const tail = digits.length >= tailLen ? digits.slice(-tailLen) : digits;

  // 3) 혼동 문자 제외한 안전 문자 리스트
  const SAFE_LETTERS = "abcdefhjkmnpqrtuvwxy";
  const total = SAFE_LETTERS.length;

  // 4) CryptoJS 기반 랜덤 인덱스 생성
  function randomLetter() {
    const bytes = CryptoJS.lib.WordArray.random(2); // 16bit 랜덤
    const num = bytes.words[0] & 0xffff; // 0~65535
    return SAFE_LETTERS[num % total];
  }

  function randomLetters(count) {
    let out = "";
    for (let i = 0; i < count; i++) out += randomLetter();
    return out;
  }

  const suffix = randomLetters(randLen);

  return `NK${tail}${suffix}!@`;
}

export function convertUserGradeCodeToLabel(code) {
  switch (code) {
    case "N1":
      return "아이언";
    case "N2":
      return "브론즈";
    case "N3":
      return "실버";
    case "N4":
      return "골드";
    case "N5":
      return "플래티넘";
    case "N6":
      return "에메랄드";
    case "N7":
      return "다이아몬드";
    case "N8":
      return "마스터";
    case "N9":
      return "그랜드마스터";
    case "N10":
      return "챌린저";
  }
}

export function convertUserGradeCodeToPointRate(code) {
  switch (code) {
    case "N1":
      return 0.01;
    case "N2":
      return 0.012;
    case "N3":
      return 0.015;
    case "N4":
      return 0.02;
    case "N5":
      return 0.03;
    case "N6":
      return 0.04;
    case "N7":
      return 0.055;
    case "N8":
      return 0.07;
    case "N9":
      return 0.085;
    case "N10":
      return 0.1;
  }
}

export function convertUserGradeCodeToPoint(code, price) {
  switch (code) {
    case "N1":
      return Number((price * 0.01).toFixed(0));
    case "N2":
      return Number((price * 0.012).toFixed(0));
    case "N3":
      return Number((price * 0.015).toFixed(0));
    case "N4":
      return Number((price * 0.02).toFixed(0));
    case "N5":
      return Number((price * 0.03).toFixed(0));
    case "N6":
      return Number((price * 0.04).toFixed(0));
    case "N7":
      return Number((price * 0.055).toFixed(0));
    case "N8":
      return Number((price * 0.07).toFixed(0));
    case "N9":
      return Number((price * 0.085).toFixed(0));
    case "N10":
      return Number((price * 0.1).toFixed(0));
  }
}

export function convertPriceToUserGradeCode(price) {
  if (price >= 0 && price <= 99999) {
    return "N1";
  } else if (price >= 100000 && price <= 249999) {
    return "N2";
  } else if (price >= 250000 && price <= 499999) {
    return "N3";
  } else if (price >= 500000 && price <= 749999) {
    return "N4";
  } else if (price >= 750000 && price <= 999999) {
    return "N5";
  } else if (price >= 1000000 && price <= 1499999) {
    return "N6";
  } else if (price >= 1500000 && price <= 1999999) {
    return "N7";
  } else if (price >= 2000000 && price <= 2499999) {
    return "N8";
  } else if (price >= 2500000 && price <= 2999999) {
    return "N9";
  } else if (price >= 3000000) {
    return "N10";
  }
}

export function isOverYear20(rrn6) {
  if (!/^\d{6}$/.test(rrn6)) return false;

  const yy = parseInt(rrn6.substring(0, 2), 10);
  const currentYear = new Date().getFullYear();

  // 출생년도 변환 (YY -> YYYY)
  const birthYear = yy <= currentYear % 100 ? 2000 + yy : 1900 + yy;

  // 연나이 = 올해 - 출생년도 + 1
  const yearAge = currentYear - birthYear + 1;

  return yearAge >= 20;
}

export function convertRRNtoDate(rrnFront) {
  // rrnFront: 주민등록번호 앞자리 "YYMMDD"
  if (!/^\d{6}$/.test(rrnFront)) return null;

  let yy = rrnFront.slice(0, 2);
  const mm = rrnFront.slice(2, 4);
  const dd = rrnFront.slice(4, 6);

  // 연도 판단 (연나이 0~120세 범위 기준)
  const currentYear = new Date().getFullYear();
  const century = Number(yy) > currentYear % 100 ? "19" : "20";
  const yyyy = century + yy;

  return `${yyyy}-${mm}-${dd}`;
}

export function getDiscountRate(originalPrice, salePrice) {
  if (!originalPrice || originalPrice <= 0) return 0;

  const discount = ((originalPrice - salePrice) / originalPrice) * 100;

  return Math.round(discount); // 정수로 반올림
}
