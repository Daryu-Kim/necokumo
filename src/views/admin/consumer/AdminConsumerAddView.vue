<template>
  <div class="admin-consumer-add">
    <h2>회원 정보 등록하기</h2>
    <div class="add-box">
      <h3>기본 정보</h3>
      <div>
        <h4>유저 휴대폰번호</h4>
        <div class="rrn">
          <input
            type="text"
            v-model="phone1Text"
            inputmode="numeric"
            maxlength="3"
            placeholder="010"
            :disabled="isNotPhoneDuplicated"
            @input="(e) => onlyNumber(e, 'phone1Text')"
          />
          <p>-</p>
          <input
            type="text"
            v-model="phone2Text"
            inputmode="numeric"
            maxlength="4"
            placeholder="1234"
            :disabled="isNotPhoneDuplicated"
            @input="(e) => onlyNumber(e, 'phone2Text')"
          />
          <p>-</p>
          <input
            type="text"
            v-model="phone3Text"
            inputmode="numeric"
            maxlength="4"
            placeholder="5678"
            :disabled="isNotPhoneDuplicated"
            @input="(e) => onlyNumber(e, 'phone3Text')"
          />
          <button
            class="side-button"
            @click="handleCheckPhoneNumber"
            :disabled="isNotPhoneDuplicated"
          >
            중복확인
          </button>
        </div>
      </div>
      <div>
        <h4>유저 이름</h4>
        <input
          type="text"
          v-model="nameText"
          placeholder="신분증 기재 상 이름 입력"
        />
      </div>
      <div>
        <h4>유저 생년월일</h4>
        <input type="date" v-model="birthdayText" />
      </div>
      <div>
        <h4>유저 등급</h4>
        <div class="grade-container">
          <select v-model="minGradeText">
            <option value="">== 최소 등급 선택 ==</option>
            <option value="N1">N1 - 아이언</option>
            <option value="N2">N2 - 브론즈</option>
            <option value="N3">N3 - 실버</option>
            <option value="N4">N4 - 골드</option>
            <option value="N5">N5 - 플래티넘</option>
            <option value="N6">N6 - 에메랄드</option>
            <option value="N7">N7 - 다이아몬드</option>
            <option value="N8">N8 - 마스터</option>
            <option value="N9">N9 - 그랜드마스터</option>
            <option value="N10">N10 - 챌린저</option>
          </select>
          <select v-model="gradeText">
            <option value="">== 초기 등급 선택 ==</option>
            <option value="N1">N1 - 아이언</option>
            <option value="N2">N2 - 브론즈</option>
            <option value="N3">N3 - 실버</option>
            <option value="N4">N4 - 골드</option>
            <option value="N5">N5 - 플래티넘</option>
            <option value="N6">N6 - 에메랄드</option>
            <option value="N7">N7 - 다이아몬드</option>
            <option value="N8">N8 - 마스터</option>
            <option value="N9">N9 - 그랜드마스터</option>
            <option value="N10">N10 - 챌린저</option>
          </select>
        </div>
      </div>
      <div>
        <h4>유저 주소</h4>
        <div class="address-container">
          <div>
            <input
              type="text"
              v-model="postCodeText"
              disabled
              placeholder="00000"
            />
            <button @click="openDaumPostcode()">주소검색</button>
          </div>
          <input
            type="text"
            v-model="address1Text"
            disabled
            placeholder="주소 검색을 사용하세요."
          />
          <input
            type="text"
            v-model="address2Text"
            placeholder="상세 주소를 입력하세요 (예: 아파트, 동/호수 등)"
          />
        </div>
      </div>
      <div>
        <h4>기존 결제금액</h4>
        <div class="address-container">
          <div>
            <input
              type="text"
              v-model="recentPriceText"
              :disabled="isBusy"
              maxlength="8"
              placeholder="예) 100,000"
              @input="(e) => onlyNumber(e, 'recentPriceText')"
            />
          </div>
        </div>
      </div>
      <div>
        <h4>영업자 정보</h4>
        <div class="address-container">
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
      </div>
    </div>
    <div class="button-box">
      <button @click="nextStep" :disabled="isBusy">회원 정보 등록하기</button>
    </div>
  </div>
</template>

<script setup>
import { encrypt } from "@/lib/crypto";
import { db } from "@/lib/firebase";
import { sendPpurioMessage } from "@/lib/ppurio";
import {
  convertUserGradeCodeToPoint,
  generateTempPasswordCryptoJS,
  generateUUIDFromSeed,
} from "@/lib/utils";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { computed } from "vue";
import { nextTick, ref } from "vue";

const isBusy = ref(false);

const phone1Text = ref("");
const phone2Text = ref("");
const phone3Text = ref("");
const isNotPhoneDuplicated = ref(false);

const nameText = ref("");

const birthdayText = ref("");

const minGradeText = ref("");
const gradeText = ref("");

const postCodeText = ref("");
const address1Text = ref("");
const address2Text = ref("");

const bankNameText = ref("");
const bankAccountNumberText = ref("");
const bankDepositorNameText = ref("");

const recentPriceText = ref("0");

const salespersonCodeText = ref("");
const isCheckedSalespersonCode = ref(false);

const phoneText = computed(() => {
  return `${phone1Text.value}${phone2Text.value}${phone3Text.value}`;
});

const onlyNumber = (e, refName) => {
  const targetRef = {
    phone1Text,
    phone2Text,
    phone3Text,
    recentPriceText,
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

    const docsSnap = await getDocs(
      query(collection(db, "users"), where("userPhone", "==", phoneText.value))
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

const nextStep = async () => {
  try {
    isBusy.value = true;

    if (!isNotPhoneDuplicated.value) {
      alert("휴대폰 번호 중복체크를 진행해주세요!");
      isBusy.value = false;
      return;
    }

    if (birthdayText.value === "") {
      alert("생년월일을 입력해주세요!");
      isBusy.value = false;
      return;
    }

    if (minGradeText.value === "") {
      alert("최소 유저 등급을 선택해주세요!");
      isBusy.value = false;
      return;
    }

    if (gradeText.value === "") {
      alert("초기 유저 등급을 선택해주세요!");
      isBusy.value = false;
      return;
    }

    if (!isCheckedSalespersonCode.value) {
      salespersonCodeText.value = "";
    }

    const uuid = await generateUUIDFromSeed(phoneText.value);
    const tempPassword = generateTempPasswordCryptoJS(phoneText.value);

    await setDoc(doc(db, "users", uuid), {
      userId: uuid,
      userName: nameText.value,
      userPhone: phoneText.value,
      userPassword: encrypt(tempPassword),
      userVerifiedInfo: encrypt(
        JSON.stringify({
          isAdminVerified: true,
        })
      ),
      userGrade: gradeText.value,
      userMinGrade: minGradeText.value,
      userBirthday: birthdayText.value,
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

    if (Number(recentPriceText.value) > 0) {
      const point = convertUserGradeCodeToPoint(
        gradeText.value,
        Number(recentPriceText.value)
      );

      await addDoc(collection(db, "userPoints"), {
        actionType: "ADD",
        afterPoint: point + 3000,
        amount: point,
        beforePoint: 3000,
        createdAt: Timestamp.fromDate(new Date()),
        description: "기존 결제금액에 대한 포인트 지급",
        sourceType: "MANUAL_ADMIN",
        userId: uuid,
      });
    }

    if (isCheckedSalespersonCode.value) {
      await updateDoc(doc(db, "salespersons", salespersonCodeText.value), {
        userIds: arrayUnion(uuid),
      });
    }

    await sendPpurioMessage({
      targets: [
        {
          to: phoneText.value,
        },
      ],
      targetCount: 1,
      content: `[네코쿠모] 회원가입이 완료되었습니다!\n\n아이디: ${phoneText.value}\n비밀번호: ${tempPassword}\n\n아래 링크에 접속하여 로그인해주세요!\nhttps://www.necokumo.co.kr/login`,
      refKey: `JOIN_${Timestamp.now().seconds}_${phoneText.value}`,
    });

    alert("변경내용이 저장되었습니다!");
    window.location.href = "/admin/consumer/list";
  } catch (e) {
    console.error(e);
    alert("회원가입 중 오류가 발생했습니다!");
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
</script>

<style scoped lang="scss">
.admin-consumer-add {
  margin-top: 36px;

  > .add-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;

    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;

      > h4 {
        width: 160px;
        border-right: 1px solid rgba(0, 0, 0, 0.25);
      }

      > div {
        &.rrn {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        > button {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          width: 100%;

          &:hover {
            background-color: #0069d9;
          }

          &:disabled {
            cursor: not-allowed;
            background-color: #efefef;
            color: rgba($color: #000000, $alpha: 0.5);
          }
        }

        &.grade-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      }

      > input,
      textarea {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        background-color: #efefef;
        font-size: 14px;

        ::placeholder {
          color: rgba(0, 0, 0, 0.6);
        }

        &:focus {
          outline: 2px solid #007bff;
        }
      }

      > .radio-box {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        > div {
          margin: 0;
          display: flex;
          align-items: center;
          > input {
            width: 20px;
            height: 20px;
          }
          > label {
            font-size: 14px;
          }
        }
      }

      > .refund-container {
        display: flex;
        align-items: center;
        gap: 16px;

        > input,
        select {
          width: 100%;
          padding: 8px 12px;
          border-radius: 4px;
          border: none;
          box-sizing: border-box;
          outline: none;
          font-size: 14px;
          background-color: #efefef;
        }
      }

      > .address-container {
        display: flex;
        flex-direction: column;
        gap: 8px;

        > div {
          display: flex;
          align-items: center;
          gap: 8px;

          > input {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            box-sizing: border-box;
            outline: none;
            font-size: 14px;
            background-color: #efefef;
          }

          > button {
            font-size: 14px;
            border-radius: 4px;
            cursor: pointer;
            height: 34px;
            padding: 8px 16px;
          }
        }

        > input {
          width: 100%;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          box-sizing: border-box;
          outline: none;
          font-size: 14px;
        }
      }

      > span {
        font-size: 14px;
      }

      > div {
        flex: 1;
        > input,
        textarea,
        select {
          width: 100%;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          background-color: #efefef;
          font-size: 14px;

          ::placeholder {
            color: rgba(0, 0, 0, 0.6);
          }

          &:focus {
            outline: 2px solid #007bff;
          }
        }

        > div {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 8px;

          > button {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            background-color: #007bff;
            color: #fff;
            font-size: 14px;
            cursor: pointer;

            &:hover {
              background-color: #0069d9;
            }

            &:disabled {
              cursor: not-allowed;
              background-color: #efefef;
              color: rgba($color: #000000, $alpha: 0.5);
            }
          }
        }
      }
    }
  }

  > .button-box {
    margin-top: 36px;
    display: flex;
    align-items: center;
    justify-content: center;

    > button {
      border-radius: 4px;
      padding: 12px 24px;
      background-color: #007bff;
      border: none;
      color: #fff;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
