<template>
  <div class="member-agreement">
    <div class="inner-container">
      <h1>회원가입</h1>
      <div class="agreement-container">
        <hr />
        <div class="checkbox-container">
          <div>
            <input id="terms" type="checkbox" v-model="checks.terms" />
          </div>
          <div class="label-container">
            <label for="terms" class="bold">이용약관 동의 (필수)</label>
          </div>
          <button @click="openDialog('AGREEMENT_TERMS')">보기</button>
        </div>
        <div class="checkbox-container">
          <div>
            <input
              id="privacy-required"
              type="checkbox"
              v-model="checks.privacyRequired"
            />
          </div>
          <div class="label-container">
            <label for="privacy-required" class="bold">
              개인정보 수집 및 이용 동의 (필수)
            </label>
          </div>
          <button @click="openDialog('AGREEMENT_PRIVACY')">보기</button>
        </div>
        <div class="checkbox-container">
          <div>
            <input id="gps" type="checkbox" v-model="checks.gps" />
          </div>
          <div class="label-container">
            <label for="gps" class="bold">
              위치기반서비스 이용약관 동의 (필수)
            </label>
          </div>
          <button @click="openDialog('AGREEMENT_GPS')">보기</button>
        </div>
        <div class="checkbox-container">
          <div>
            <input id="marketing" type="checkbox" v-model="checks.marketing" />
          </div>
          <div class="label-container">
            <label for="marketing" class="bold"
              >마케팅 목적의 개인정보 수집 및 이용 (필수)</label
            >
          </div>
          <button @click="openDialog('AGREEMENT_MARKETING')">보기</button>
        </div>
        <div class="checkbox-container">
          <div>
            <input id="sms" type="checkbox" v-model="checks.sms" />
          </div>
          <div class="label-container">
            <label for="sms" class="bold">
              쇼핑정보 SMS / 알림톡 수신 동의 (필수)
            </label>
          </div>
          <button @click="openDialog('AGREEMENT_SMS')">보기</button>
        </div>
        <hr />
      </div>
      <div class="join-container">
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
              :disabled="isNotPhoneDuplicated || isBusy"
              @input="(e) => onlyNumber(e, 'phone1Text')"
            />
            <p>-</p>
            <input
              type="text"
              v-model="phone2Text"
              inputmode="numeric"
              maxlength="4"
              placeholder="1234"
              :disabled="isNotPhoneDuplicated || isBusy"
              @input="(e) => onlyNumber(e, 'phone2Text')"
            />
            <p>-</p>
            <input
              type="text"
              v-model="phone3Text"
              inputmode="numeric"
              maxlength="4"
              placeholder="5678"
              :disabled="isNotPhoneDuplicated || isBusy"
              @input="(e) => onlyNumber(e, 'phone3Text')"
            />
            <button
              class="side-button"
              @click="handleCheckPhoneNumber"
              :disabled="isNotPhoneDuplicated || isBusy"
            >
              중복확인
            </button>
          </div>
        </div>
        <div class="input-container">
          <p>비밀번호<span>*</span></p>
          <input
            type="password"
            maxlength="16"
            v-model="passwordText"
            :disabled="isBusy"
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
            :disabled="isBusy"
            placeholder="비밀번호를 다시 입력해주세요"
            @input="validatePassword2"
          />
          <p class="error" v-if="password2Error">{{ password2Error }}</p>
        </div>
        <hr class="sub" />
        <h3>가입자 본인인증</h3>
        <img src="@/assets/resident_guide.png" />
        <div class="input-container">
          <p>이름<span>*</span></p>
          <input
            type="text"
            v-model="verifyNameText"
            :disabled="isVerified || isBusy"
            placeholder="①번 항목"
          />
        </div>
        <div class="input-container rrn">
          <p>주민등록번호<span>*</span></p>
          <div>
            <input
              type="text"
              v-model="verifyRrn1Text"
              maxlength="6"
              :disabled="isVerified || isBusy"
              placeholder="②번 항목"
              @input="(e) => onlyNumber(e, 'verifyRrn1Text')"
            />
            <p>-</p>
            <input
              type="password"
              v-model="verifyRrn2Text"
              maxlength="7"
              :disabled="isVerified || isBusy"
              placeholder="③번 항목"
              @input="(e) => onlyNumber(e, 'verifyRrn2Text')"
            />
          </div>
        </div>
        <div class="input-container">
          <p>발급일자<span>*</span></p>
          <input
            type="date"
            v-model="verifyIssueDate"
            :disabled="isVerified || isBusy"
          />
        </div>
        <!-- goto -->
        <div class="input-container">
          <button :disabled="isVerified || isBusy" @click="handleCheckAdult">
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
            :disabled="isBusy"
            placeholder="상세 주소 입력"
          />
        </div>
        <hr class="sub" />
        <h3>환불 정보 입력</h3>
        <div class="input-container">
          <p>은행명<span>*</span></p>
          <select v-model="bankNameText" :disabled="isBusy">
            <option value="">== 은행명 선택 ==</option>
            <option value="NH농협은행">NH농협은행</option>
            <option value="카카오뱅크">카카오뱅크</option>
            <option value="KB국민은행">KB국민은행</option>
            <option value="토스뱅크">토스뱅크</option>
            <option value="신한은행">신한은행</option>
            <option value="우리은행">우리은행</option>
            <option value="IBK기업은행">IBK기업은행</option>
            <option value="하나은행">하나은행</option>
            <option value="새마을금고">새마을금고</option>
            <option value="부산은행">부산은행</option>
            <option value="iM뱅크">iM뱅크</option>
            <option value="케이뱅크">케이뱅크</option>
            <option value="신협">신협</option>
            <option value="우체국">우체국</option>
            <option value="SC제일은행">SC제일은행</option>
            <option value="경남은행">경남은행</option>
            <option value="광주은행">광주은행</option>
            <option value="수협">수협</option>
            <option value="전북은행">전북은행</option>
            <option value="저축은행">저축은행</option>
            <option value="제주은행">제주은행</option>
            <option value="씨티은행">씨티은행</option>
            <option value="KDB산업은행">KDB산업은행</option>
            <option value="산림조합은행">산림조합은행</option>
            <option value="SBI저축은행">SBI저축은행</option>
          </select>
        </div>
        <div class="input-container">
          <p>계좌번호<span>*</span></p>
          <input
            type="text"
            v-model="bankAccountNumberText"
            :disabled="isBusy"
            maxlength="20"
            placeholder="숫자만 입력 가능"
            @input="(e) => onlyNumber(e, 'bankAccountNumberText')"
          />
        </div>
        <div class="input-container">
          <p>예금주<span>*</span></p>
          <input
            type="text"
            v-model="bankDepositorNameText"
            :disabled="isBusy"
          />
        </div>
        <hr class="sub" />
        <h3>영업자 정보 입력</h3>
        <div class="input-container rrn">
          <p>영업자 코드 (선택)</p>
          <div>
            <input
              type="text"
              v-model="salespersonCodeText"
              :disabled="isCheckedSalespersonCode || isBusy"
              maxlength="8"
              placeholder="예) NKS00000"
              @input="(e) => onlyNumberAndUpper(e, 'salespersonCodeText')"
            />
            <button
              class="side-button"
              @click="checkSalesPersonCode"
              :disabled="isCheckedSalespersonCode || isBusy"
            >
              영업자 확인
            </button>
          </div>
        </div>
        <hr class="sub" />
        <div class="button-container">
          <button @click="router.go('/')" :disabled="isBusy">취소</button>
          <button @click="nextStep" :disabled="isBusy">회원가입</button>
        </div>
      </div>
    </div>
    <div v-if="isDialogOpened" class="overlay" @click="closeDialog">
      <div class="modal" @click.stop>
        <div class="title-container">
          <h2>{{ dialogTitle }}</h2>
          <button class="close-button" @click="isDialogOpened = false">
            <Icon size="24">
              <CloseRound />
            </Icon>
          </button>
        </div>
        <hr />
        <div class="content-container">
          <p v-html="dialogContent"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { db } from "@/lib/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Icon } from "@vicons/utils";
import { CloseRound } from "@vicons/material";
import { nextTick, ref } from "vue";
import router from "@/router";
import {
  convertRRNtoDate,
  generateUUIDFromSeed,
  isOverYear20,
} from "@/lib/utils";
import { encrypt } from "@/lib/crypto";
import { checkResidentCard } from "@/lib/apick";
import { loginProcess } from "@/lib/auth";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const isBusy = ref(false);

const isDialogOpened = ref(false);
const dialogTitle = ref("");
const dialogContent = ref("");

const phone1Text = ref("");
const phone2Text = ref("");
const phone3Text = ref("");
const isNotPhoneDuplicated = ref(false);

const passwordText = ref("");
const password2Text = ref("");

const passwordError = ref("");
const password2Error = ref("");

const verifyNameText = ref("");
// 주민등록증
const verifyRrn1Text = ref("");
const verifyRrn2Text = ref("");
const verifyIssueDate = ref("2025-01-01");

const isVerified = ref(false);
const verifiedInfo = ref({});

const postCodeText = ref("");
const address1Text = ref("");
const address2Text = ref("");

const bankNameText = ref("");
const bankAccountNumberText = ref("");
const bankDepositorNameText = ref("");

const salespersonCodeText = ref("");
const isCheckedSalespersonCode = ref(false);

const checks = ref({
  terms: false,
  privacyRequired: false,
  gps: false,
  marketing: false,
  sms: false,
});

const onlyNumber = (e, refName) => {
  const targetRef = {
    phone1Text,
    phone2Text,
    phone3Text,
    verifyRrn1Text,
    verifyRrn2Text,
    bankAccountNumberText,
  }[refName];

  const value = e.target.value.replace(/\D/g, "");
  targetRef.value = value;
  e.target.value = value;
};

const onlyNumberAndUpper = (e, refName) => {
  const targetRef = {
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

const handleCheckPhoneNumber = async () => {
  try {
    isBusy.value = true;
    if (
      !phone1Text.value ||
      phone1Text.value.length !== 3 ||
      !phone2Text.value ||
      phone2Text.value.length !== 4 ||
      !phone3Text.value ||
      phone3Text.value.length !== 4
    ) {
      alert("휴대폰 번호를 정확하게 입력해주시기 바랍니다!");
      isBusy.value = false;
      return;
    }

    const phoneText = `${phone1Text.value}${phone2Text.value}${phone3Text.value}`;

    const docsSnap = await getDocs(
      query(collection(db, "users"), where("userPhone", "==", phoneText))
    );

    if (!docsSnap.empty) {
      alert("이미 등록된 전화번호입니다!");
      isBusy.value = false;
      return;
    }

    alert("사용 가능한 전화번호입니다.");
    isNotPhoneDuplicated.value = true;
    isBusy.value = false;
  } catch (e) {
    console.error(e);
    isBusy.value = false;
  }
};

const handleCheckAdult = async () => {
  try {
    isBusy.value = true;
    let result = {};

    if (
      !verifyNameText.value ||
      verifyRrn1Text.value.length !== 6 ||
      verifyRrn2Text.value.length !== 7
    ) {
      alert("주민등록증 정보를 입력해주세요!");
      isBusy.value = false;
      return;
    }

    const formattedDate = verifyIssueDate.value.replaceAll("-", "");

    result = await checkResidentCard({
      name: verifyNameText.value,
      rrn1: verifyRrn1Text.value,
      rrn2: verifyRrn2Text.value,
      date: formattedDate,
    });

    if (result.data.result !== 1) {
      alert("주민등록증 조회에 실패했습니다!");
      isVerified.value = false;
      isBusy.value = false;
      return;
    }

    if (!isOverYear20(verifyRrn1Text.value)) {
      alert("20세 미만의 청소년은 가입이 불가합니다!");
      isVerified.value = false;
      isBusy.value = false;
      return;
    }

    verifiedInfo.value = {
      type: result.data.type,
      ic_id: result.data.ic_id,
      pl_id: result.api.pl_id,
      verifiedTimestamp: Timestamp.fromDate(new Date()),
    };

    alert("신분증 인증이 완료되었습니다!");
    isVerified.value = true;
    isBusy.value = false;
  } catch (e) {
    console.error(e);
    isVerified.value = false;
    isBusy.value = false;
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

const checkSalesPersonCode = async () => {
  try {
    isBusy.value = true;

    if (salespersonCodeText.value.length === 0) {
      alert("영업자 코드를 입력해주세요!");
      isBusy.value = false;
      return;
    }

    const salespersonDocs = await getDocs(
      query(
        collection(db, "salespersons"),
        where("salespersonId", "==", salespersonCodeText.value)
      )
    );

    if (salespersonDocs.empty) {
      alert("해당하는 영업자가 없습니다!");
      isBusy.value = false;
      return;
    }

    alert("영업자가 확인되었습니다!");
    isCheckedSalespersonCode.value = true;
    isBusy.value = false;
  } catch (e) {
    console.error(e);
    alert("영업자 코드 확인 중 오류가 발생했습니다!");
    isBusy.value = false;
  }
};

const nextStep = async () => {
  try {
    isBusy.value = true;
    const allRequiredChecked = Object.values(checks.value).every(
      (v) => v === true
    );

    if (!allRequiredChecked) {
      alert("필수 항목을 모두 체크해주세요!");
      isBusy.value = false;
      return;
    }

    if (!isNotPhoneDuplicated.value) {
      alert("휴대폰 번호 중복체크를 진행해주세요!");
      isBusy.value = false;
      return;
    }

    if (
      passwordError.value !== "" ||
      password2Error.value !== "" ||
      passwordText.value !== password2Text.value
    ) {
      alert("비밀번호가 일치하지 않거나 문제가 있습니다!");
      isBusy.value = false;
      return;
    }

    if (!isVerified.value) {
      alert("본인 인증을 진행해주세요!");
      isBusy.value = false;
      return;
    }

    if (postCodeText.value === "" || address1Text.value === "") {
      alert("주소를 입력해주세요!");
      isBusy.value = false;
      return;
    }

    if (
      bankNameText.value === "" ||
      bankAccountNumberText.value === "" ||
      bankDepositorNameText.value === ""
    ) {
      alert("환불 계좌 정보를 입력해주세요!");
      isBusy.value = false;
      return;
    }

    if (!isCheckedSalespersonCode.value) {
      salespersonCodeText.value = "";
    }

    const uuid = await generateUUIDFromSeed(
      `${phone1Text.value}${phone2Text.value}${phone3Text.value}`
    );

    await setDoc(doc(db, "users", uuid), {
      userId: uuid,
      userName: verifyNameText.value,
      userPhone: `${phone1Text.value}${phone2Text.value}${phone3Text.value}`,
      userPassword: encrypt(passwordText.value),
      userVerifiedInfo: encrypt(JSON.stringify(verifiedInfo.value)),
      userGrade: "N1",
      userMinGrade: "N1",
      userBirthday: convertRRNtoDate(verifyRrn1Text.value),
      userPostCode: postCodeText.value,
      userAddress1: address1Text.value,
      userAddress2: address2Text.value,
      userBankName: bankNameText.value,
      userBankAccountNumber: bankAccountNumberText.value,
      userBankDepositorName: bankDepositorNameText.value,
      userCardNumber: "",
      userCardValidDate: null,
      userSalespersonCode: salespersonCodeText.value,
      userProductCartList: [],
      userProductWishList: [],
      isAdmin: false,
      termsAcceptedAt: Timestamp.fromDate(new Date()),
      privacyAcceptedAt: Timestamp.fromDate(new Date()),
      gpsAcceptedAt: Timestamp.fromDate(new Date()),
      marketingAcceptedAt: Timestamp.fromDate(new Date()),
      smsAcceptedAt: Timestamp.fromDate(new Date()),
      visitedAt: Timestamp.fromDate(new Date()),
      createdAt: Timestamp.fromDate(new Date()),
    });

    await addDoc(collection(db, "userPoints"), {
      actionType: "ADD",
      afterPoint: 3000,
      amount: 3000,
      beforePoint: 0,
      createdAt: Timestamp.fromDate(new Date()),
      description: "회원가입으로 인한 가입 축하 적립금 3,000 냥코인 적립",
      sourceType: "JOIN_REWARD",
      userId: uuid,
    });

    if (isCheckedSalespersonCode.value) {
      await updateDoc(doc(db, "salespersons", salespersonCodeText.value), {
        userIds: arrayUnion(uuid),
      });
    }

    await loginProcess(uuid);

    window.location.href = "/member/join-success";
  } catch (e) {
    console.error(e);
    alert("회원가입 중 오류가 발생했습니다!");
    isBusy.value = false;
  }
};

const openDialog = async (docId) => {
  try {
    const data = (await getDoc(doc(db, "settings", docId))).data();
    dialogTitle.value = data.title;
    dialogContent.value = data.content;
    isDialogOpened.value = true;
  } catch (e) {
    console.error(e);
  }
};

const closeDialog = () => {
  isDialogOpened.value = false;
};

onMounted(async () => {
  const route = useRoute();
  const id = route.query.id || "";

  isBusy.value = true;

  const salespersonDocs = await getDocs(
    query(collection(db, "salespersons"), where("salespersonId", "==", id))
  );

  if (salespersonDocs.empty) {
    isBusy.value = false;
    return;
  }

  salespersonCodeText.value = id;
  isCheckedSalespersonCode.value = true;
  isBusy.value = false;
});
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

    > .agreement-container {
      margin-top: 48px;
      > hr {
        border: none;
        border-top: 3px solid black;
        margin: 24px 0;

        &.sub {
          border-top: 1px solid #999;
        }
      }

      > .checkbox-container {
        display: flex;
        align-items: center;
        gap: 16px;

        &:not(:first-child) {
          margin-top: 24px;
        }

        > div {
          &.label-container {
            flex: 1;
          }

          > input {
            width: 24px;
            height: 24px;
          }

          > label {
            font-size: 18px;
            line-height: 24px;
            &.bold {
              font-weight: 700;
            }
          }

          > p {
            font-size: 14px;
            margin-top: 4px;
            color: #999;
          }
        }

        > button {
          border: none;
          background: #007bff;
          color: white;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;

          &:hover {
            filter: brightness(1.15);
          }
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

  > .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5); /* 🔥 배경 어둡게 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

    > .modal {
      background: #fff;
      width: 90%;
      max-width: 540px;
      border-radius: 8px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);

      > .title-container {
        display: flex;
        align-items: center;
        padding: 16px 24px;

        > h2 {
          flex: 1;
        }

        > .close-button {
          background: none;
          border: none;
          cursor: pointer;

          &:hover {
            filter: brightness(1.15);
          }
        }
      }

      > .content-container {
        padding: 16px 24px;
        max-height: 70vh;
        overflow-y: scroll;
      }
    }
  }
}
</style>
