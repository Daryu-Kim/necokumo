<template>
  <div class="member-agreement">
    <div class="inner-container">
      <h1>회원가입</h1>
      <div class="step-container">
        <p>1. 약관동의</p>
        <p>></p>
        <p class="current">2. 정보입력</p>
        <p>></p>
        <p>3. 가입완료</p>
      </div>
      <div class="join-container">
        <hr />
        <h3>기본 로그인 정보 입력</h3>
        <div class="input-container rrn">
          <p>휴대폰 번호<span>*</span></p>
          <div>
            <input
              type="text"
              v-model="phone1Text"
              inputmode="numeric"
              maxlength="3"
              placeholder="010"
              @input="(e) => onlyNumber(e, 'phone1Text')"
            />
            <p>-</p>
            <input
              type="text"
              v-model="phone2Text"
              inputmode="numeric"
              maxlength="4"
              placeholder="1234"
              @input="(e) => onlyNumber(e, 'phone2Text')"
            />
            <p>-</p>
            <input
              type="text"
              v-model="phone3Text"
              inputmode="numeric"
              maxlength="4"
              placeholder="5678"
              @input="(e) => onlyNumber(e, 'phone3Text')"
            />
            <button class="side-button">중복확인</button>
          </div>
        </div>
        <div class="input-container">
          <p>비밀번호<span>*</span></p>
          <input
            type="password"
            maxlength="16"
            v-model="passwordText"
            placeholder="8 ~ 16자, 영문 대·소문자/숫자/특수문자 포함"
            @input="validatePassword"
          />
          <p class="error" v-if="passwordError">{{ passwordError }}</p>
        </div>
        <div class="input-container">
          <p>비밀번호 확인<span>*</span></p>
          <input
            type="password"
            maxlength="16"
            v-model="password2Text"
            placeholder="비밀번호를 다시 입력해주세요"
            @input="validatePassword2"
          />
          <p class="error" v-if="password2Error">{{ password2Error }}</p>
        </div>
        <hr class="sub" />
        <h3>가입자 본인인증</h3>
        <div class="input-container flex">
          <div>
            <input
              type="radio"
              name="verifyMethod"
              v-model="verifyMethod"
              :value="1"
              :disabled="isVerified"
              id="resident"
            />
            <label for="resident">주민등록증</label>
          </div>
          <div>
            <input
              type="radio"
              name="verifyMethod"
              v-model="verifyMethod"
              :value="2"
              :disabled="isVerified"
              id="driver"
            />
            <label for="driver">운전면허증</label>
          </div>
        </div>
        <img src="@/assets/resident_guide.png" v-if="verifyMethod === 1" />
        <img src="@/assets/driver_guide.png" v-if="verifyMethod === 2" />
        <div class="input-container" v-if="verifyMethod">
          <p>이름<span>*</span></p>
          <input
            type="text"
            v-model="verifyNameText"
            :disabled="isVerified"
            :placeholder="verifyMethod === 2 ? '④번 항목' : '①번 항목'"
          />
        </div>
        <!-- 주민등록증 입력란 -->
        <div class="input-container rrn" v-if="verifyMethod === 1">
          <p>주민등록번호<span>*</span></p>
          <div>
            <input
              type="text"
              v-model="verifyRrn1Text"
              maxlength="6"
              :disabled="isVerified"
              placeholder="②번 항목"
              @input="(e) => onlyNumber(e, 'verifyRrn1Text')"
            />
            <p>-</p>
            <input
              type="password"
              v-model="verifyRrn2Text"
              maxlength="7"
              :disabled="isVerified"
              placeholder="③번 항목"
              @input="(e) => onlyNumber(e, 'verifyRrn2Text')"
            />
          </div>
        </div>
        <div class="input-container" v-if="verifyMethod === 1">
          <p>발급일자<span>*</span></p>
          <input type="date" v-model="verifyIssueDate" :disabled="isVerified" />
        </div>
        <!-- 운전면허증 입력란 -->
        <div class="input-container" v-if="verifyMethod === 2">
          <p>생년월일<span>*</span></p>
          <input type="date" v-model="verifyBirthText" :disabled="isVerified" />
        </div>
        <div class="input-container rrn" v-if="verifyMethod === 2">
          <p>면허번호<span>*</span></p>
          <div>
            <input
              type="text"
              v-model="verifyLicense1Text"
              maxlength="2"
              :disabled="isVerified"
              placeholder="⑤번 항목"
              @input="(e) => onlyNumber(e, 'verifyLicense1Text')"
            />
            <p>-</p>
            <input
              type="text"
              v-model="verifyLicense2Text"
              maxlength="2"
              :disabled="isVerified"
              placeholder="⑥번 항목"
              @input="(e) => onlyNumber(e, 'verifyLicense2Text')"
            />
            <p>-</p>
            <input
              type="text"
              v-model="verifyLicense3Text"
              maxlength="6"
              :disabled="isVerified"
              placeholder="⑦번 항목"
              @input="(e) => onlyNumber(e, 'verifyLicense3Text')"
            />
            <p>-</p>
            <input
              type="text"
              v-model="verifyLicense4Text"
              maxlength="2"
              :disabled="isVerified"
              placeholder="⑧번 항목"
              @input="(e) => onlyNumber(e, 'verifyLicense4Text')"
            />
          </div>
        </div>
        <div class="input-container" v-if="verifyMethod === 2">
          <p>식별번호</p>
          <input
            type="text"
            v-model="verifyIdentifyText"
            :disabled="isVerified"
            maxlength="6"
            placeholder="⑨번 항목 (없을 경우 제외)"
            @input="(e) => onlyNumberAndUpper(e, 'verifyIdentifyText')"
          />
        </div>
        <!-- goto -->
        <div class="input-container" v-if="verifyMethod">
          <button :disabled="isVerified" @click="handleCheckAdult">
            위의 정보로 본인 확인하기
          </button>
        </div>
        <hr class="sub" />
        <h3>기본 배송지 정보 입력</h3>
        <div class="input-container rrn">
          <p>우편번호<span>*</span></p>
          <div>
            <input
              type="text"
              v-model="postCodeText"
              placeholder="우편번호"
              disabled
            />
            <button class="side-button" @click="openDaumPostcode">
              주소검색
            </button>
          </div>
        </div>
        <div class="input-container">
          <p>기본 주소<span>*</span></p>
          <input
            type="text"
            v-model="address1Text"
            placeholder="기본 주소"
            disabled
          />
        </div>
        <div class="input-container">
          <p>나머지 주소<span>*</span></p>
          <input
            type="text"
            v-model="address2Text"
            placeholder="상세 주소 입력"
          />
        </div>
        <hr class="sub" />
        <h3>환불 정보 입력</h3>
        <div class="input-container">
          <p>은행명<span>*</span></p>
          <select v-model="bankNameText">
            <option value="">== 은행명 선택 ==</option>
            <option value="ssibal">시발</option>
          </select>
        </div>
        <div class="input-container">
          <p>계좌번호<span>*</span></p>
          <input
            type="text"
            v-model="bankAccountNumberText"
            maxlength="20"
            placeholder="숫자만 입력 가능"
            @input="(e) => onlyNumber(e, 'bankAccountNumberText')"
          />
        </div>
        <div class="input-container">
          <p>예금주<span>*</span></p>
          <input type="text" v-model="bankDepositorNameText" />
        </div>
        <hr class="sub" />
        <h3>영업자 정보 입력</h3>
        <div class="input-container rrn">
          <p>영업자 코드 (선택)</p>
          <div>
            <input
              type="text"
              v-model="salespersonCodeText"
              maxlength="8"
              placeholder="예) NKS00000"
              @input="(e) => onlyNumberAndUpper(e, 'salespersonCodeText')"
            />
            <button class="side-button">영업자 확인</button>
          </div>
        </div>
        <hr class="sub" />
        <div class="button-container">
          <button @click="router.back()">취소</button>
          <button @click="nextStep">다음</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { db } from "@/lib/firebase";
// import { doc, getDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { nextTick, ref } from "vue";
// import router from "@/router";

const verifyMethod = ref(1);
const isVerified = ref(false);
const msg = ref("");
const verifiedInfo = ref({});

const phone1Text = ref("");
const phone2Text = ref("");
const phone3Text = ref("");

const passwordText = ref("");
const password2Text = ref("");

const passwordError = ref("");
const password2Error = ref("");

const verifyNameText = ref("");
// 주민등록증
const verifyRrn1Text = ref("");
const verifyRrn2Text = ref("");
const verifyIssueDate = ref("2025-01-01");
// 운전면허증
const verifyBirthText = ref("2006-12-31");
const verifyLicense1Text = ref("");
const verifyLicense2Text = ref("");
const verifyLicense3Text = ref("");
const verifyLicense4Text = ref("");
const verifyIdentifyText = ref("");

const postCodeText = ref("");
const address1Text = ref("");
const address2Text = ref("");

const bankNameText = ref("");
const bankAccountNumberText = ref("");
const bankDepositorNameText = ref("");

const salespersonCodeText = ref("");

const onlyNumber = (e, refName) => {
  const targetRef = {
    phone1Text,
    phone2Text,
    phone3Text,
    verifyRrn1Text,
    verifyRrn2Text,
    verifyLicense1Text,
    verifyLicense2Text,
    verifyLicense3Text,
    verifyLicense4Text,
    bankAccountNumberText,
  }[refName];

  const value = e.target.value.replace(/\D/g, "");
  targetRef.value = value;
  e.target.value = value;
};

const onlyNumberAndUpper = (e, refName) => {
  const targetRef = {
    verifyIdentifyText,
    salespersonCodeText,
  }[refName];

  // 1. 입력값 가져오기
  let value = e.target.value;

  // 2. 소문자를 대문자로 변환
  value = value.toUpperCase();

  // 3. 영문 대문자와 숫자만 남기기
  value = value.replace(/[^A-Z0-9]/g, "");

  // 4. ref와 input에 값 반영
  targetRef.value = value;
  e.target.value = value;
};

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|\\:;"'<>,.?/]).{8,16}$/;

const validatePassword = () => {
  if (!passwordText.value) {
    passwordError.value = "";
    return;
  }

  if (!passwordRegex.test(passwordText.value)) {
    passwordError.value =
      "8~16자의 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.";
  } else {
    passwordError.value = "";
  }

  // 비밀번호 확인도 다시 체크
  validatePassword2();
};

const validatePassword2 = () => {
  if (!password2Text.value) {
    password2Error.value = "";
    return;
  }

  if (passwordText.value !== password2Text.value) {
    password2Error.value = "비밀번호가 일치하지 않습니다.";
  } else {
    password2Error.value = "";
  }
};

const handleCheckAdult = async () => {
  try {
    const result = {};

    switch (verifyMethod.value) {
      case 1:
        if (
          !verifyNameText.value ||
          verifyRrn1Text.value.length !== 6 ||
          verifyRrn2Text.value.length !== 7
        ) {
          alert("본인 정보를 입력하라우.");
        }
        break;
      case 2:
        break;
    }
    verifiedInfo.value = {
      type: result.data.type,
      ic_id: result.data.ic_id,
      pl_id: result.api.pl_id,
      verifiedTimestamp: Timestamp.fromDate(new Date()),
    };
    alert(msg);
  } catch (e) {
    console.error(e);
    isVerified.value = false;
  }
};

const openDaumPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      // 기본 주소
      let extraAddr = "";

      // 참고항목이 있을 경우
      if (data.addressType === "R") {
        if (data.bname !== "") extraAddr += data.bname;
        if (data.buildingName !== "") {
          extraAddr +=
            extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
      }

      postCodeText.value = data.zonecode;
      address1Text.value = data.address;
      address2Text.value = `(${extraAddr}) `;
      // 포커스를 상세 주소로 옮김
      nextTick(() => {
        document.querySelector('input[placeholder="상세 주소 입력"]')?.focus();
      });
    },
  }).open();
};

// const nextStep = () => {
//   try {
//     const allRequiredChecked = Object.values(checks.value).every(
//       (v) => v === true
//     );

//     if (allRequiredChecked) {
//       router.push("/member/join");
//     } else {
//       alert("필수 항목을 모두 체크해주십시오!");
//       return;
//     }
//   } catch (e) {
//     console.error(e);
//   }
// };
</script>

<style lang="scss" scoped>
.member-agreement {
  padding: 64px 24px;
  margin: auto;
  max-width: 1200px;
  min-height: 70vh;

  > .inner-container {
    width: 640px;
    margin: auto;
    > h1 {
      text-align: center;
      margin-bottom: 16px;
    }

    > .step-container {
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;

      > p {
        color: #999;

        &.current {
          color: unset;
          font-weight: 700;
        }
      }
    }

    > .join-container {
      margin-top: 48px;
      > hr {
        border: none;
        border-top: 3px solid black;
        margin: 24px 0;

        &.sub {
          border-top: 1px solid #999;
        }
      }

      > img {
        width: 100%;
        margin-top: 24px;
      }

      button.side-button {
        min-width: 96px;
        margin-left: 16px;
        margin-top: 8px;
        background: none;
        border: none;
        border-radius: 8px;
        height: 38px;
        font-size: 16px;
        cursor: pointer;
        border: 1px solid #007bff;
        background-color: #007bff;
        font-weight: 700;
        color: white;
      }

      > .input-container {
        margin-top: 16px;
        > p {
          &.error {
            margin-top: 8px;
            color: red;
            font-weight: 700;
            font-size: 14px;
          }

          > span {
            margin-left: 6px;
            font-weight: 700;
            color: #007bff;
          }
        }

        &.flex {
          display: flex;
          align-items: center;
          gap: 24px;

          > div {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }

        &.rrn {
          > div {
            display: flex;
            align-items: center;
            gap: 8px;

            > input {
              width: 100%;
              margin-top: 8px;
              padding: 8px 12px;
              font-size: 16px;
              border-radius: 8px;
              border: 1px solid #999;
            }
          }
        }

        > input,
        select {
          width: 100%;
          margin-top: 8px;
          padding: 8px 12px;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #999;
        }

        > button {
          margin-top: 24px;
          background: none;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 18px;
          cursor: pointer;
          border: 1px solid #007bff;
          background-color: #007bff;
          font-weight: 700;
          color: white;
          width: 100%;
        }
      }

      > .button-container {
        display: flex;
        align-items: center;
        gap: 24px;

        > button {
          flex: 1;
          background: none;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 18px;
          cursor: pointer;

          &:first-child {
            border: 1px solid black;
          }

          &:last-child {
            border: 1px solid #007bff;
            background-color: #007bff;
            font-weight: 700;
            color: white;
          }
        }
      }
    }
  }
}
</style>
