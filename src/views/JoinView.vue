<template>
  <div class="login-container">
    <img src="@/assets/logo.png" alt="Logo" />
    <div>
      <h2>기본 정보</h2>
      <div class="form">
        <h4 style="text-align: start">
          <span style="color: #007bff; margin-right: 8px">*</span>이메일
        </h4>
        <input
          type="email"
          v-model="email"
          required
          :disabled="emailVerified"
          style="margin-top: 4px"
          placeholder="사용하실 이메일 주소를 입력하세요."
        />
        <button @click="verifyEmail" :disabled="emailVerified">
          이메일 중복확인
        </button>
      </div>
      <div class="form">
        <h4 style="text-align: start">
          <span style="color: #007bff; margin-right: 8px">*</span>비밀번호
        </h4>
        <input
          type="password"
          v-model="password"
          required
          style="margin-top: 4px"
          placeholder="비밀번호를 입력하세요."
        />
      </div>
      <div class="form">
        <h4 style="text-align: start">
          <span style="color: #007bff; margin-right: 8px">*</span>비밀번호 확인
        </h4>
        <input
          type="password"
          v-model="retryPassword"
          required
          style="margin-top: 4px"
          placeholder="비밀번호를 한 번 더 입력하세요."
        />
      </div>
      <div class="form">
        <h4 style="text-align: start">
          <span style="color: #007bff; margin-right: 8px">*</span>이름
        </h4>
        <input
          type="text"
          v-model="name"
          required
          placeholder="이름을 입력하세요."
        />
      </div>
      <div class="form address-container">
        <h4 style="text-align: start">
          <span style="color: #007bff; margin-right: 8px">*</span>주소
        </h4>
        <button @click="searchPostCode" style="margin-top: 12px">
          주소 검색하기
        </button>
        <input
          type="text"
          v-model="postCode"
          required
          disabled
          placeholder="우편번호"
        />
        <input
          type="text"
          v-model="address1"
          disabled
          required
          placeholder="기본 주소"
        />
        <input
          type="text"
          v-model="address2"
          placeholder="나머지 주소 (선택 입력 가능)"
        />
      </div>
      <div class="form">
        <h4 style="text-align: start">
          <span style="color: #007bff; margin-right: 8px">*</span>휴대전화
        </h4>
        <input
          type="tel"
          v-model="phone"
          required
          placeholder="휴대폰 번호를 입력하세요. (ex. 010-1234-5678)"
        />
      </div>
      <h2 style="margin-top: 36px">추가 정보</h2>
      <div class="form">
        <h4 style="text-align: start">
          <span style="color: #007bff; margin-right: 8px">*</span>성별
        </h4>
        <div>
          <div>
            <input
              type="radio"
              id="male"
              v-model="gender"
              name="gender"
              value="남"
              required
            />
            <label for="male">남자</label>
          </div>
          <div>
            <input
              type="radio"
              id="female"
              v-model="gender"
              name="gender"
              value="여"
              required
            />
            <label for="female">여자</label>
          </div>
        </div>
      </div>
      <div class="form">
        <h4 style="text-align: start">
          <span style="color: #007bff; margin-right: 8px">*</span>생년월일
        </h4>
        <input type="date" v-model="birthday" required />
      </div>
      <div class="form">
        <h4 style="text-align: start">
          <span style="color: #007bff; margin-right: 8px">*</span>
          이용중인 통신사
        </h4>
        <div>
          <div>
            <input
              type="radio"
              id="SKT"
              v-model="carrier"
              name="carrier"
              value="SKT"
              required
            />
            <label for="SKT">SKT</label>
          </div>
          <div>
            <input
              type="radio"
              id="KT"
              v-model="carrier"
              name="carrier"
              value="KT"
              required
            />
            <label for="KT">KT</label>
          </div>
          <div>
            <input
              type="radio"
              id="LGU+"
              v-model="carrier"
              name="carrier"
              value="LG U+"
              required
            />
            <label for="LGU+">LG U+</label>
          </div>
          <div>
            <input
              type="radio"
              id="SKT_1"
              v-model="carrier"
              name="carrier"
              value="SKT 알뜰폰"
              required
            />
            <label for="SKT_1">SKT 알뜰폰</label>
          </div>
          <div>
            <input
              type="radio"
              id="KT_1"
              v-model="carrier"
              name="carrier"
              value="KT 알뜰폰"
              required
            />
            <label for="KT_1">KT 알뜰폰</label>
          </div>
          <div>
            <input
              type="radio"
              id="LGU+_1"
              v-model="carrier"
              name="carrier"
              value="LG U+ 알뜰폰"
              required
            />
            <label for="LGU+_1">LG U+ 알뜰폰</label>
          </div>
        </div>
      </div>
      <div class="form">
        <h4 style="text-align: start">추천인 이메일</h4>
        <input
          type="email"
          v-model="referral"
          placeholder="추천인 이메일을 입력하세요."
          :disabled="referralVerified"
        />
        <button @click="verifyReferral" :disabled="referralVerified">
          추천인 확인
        </button>
      </div>
      <div class="form">
        <h4 style="text-align: start">
          <span style="color: #007bff; margin-right: 8px">*</span>
          환불계좌 정보
        </h4>
        <input type="text" v-model="refundName" required placeholder="예금주" />
        <input type="text" v-model="refundBank" required placeholder="은행명" />
        <input
          type="text"
          v-model="refundAccount"
          required
          placeholder="계좌번호 ('-'와 숫자만 입력해주세요)"
        />
      </div>
      <button @click="join">가입하기</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "vue-router";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const emailVerified = ref(false);
const password = ref("");
const retryPassword = ref("");
const name = ref("");
const postCode = ref("");
const address1 = ref("");
const address2 = ref("");
const phone = ref("");
const gender = ref("");
const birthday = ref("");
const carrier = ref("");
const referral = ref("");
const referralVerified = ref(false);
const refundName = ref("");
const refundBank = ref("");
const refundAccount = ref("");

const router = useRouter();

const joinVerified = computed(
  () =>
    email.value &&
    emailVerified.value == true &&
    password.value &&
    retryPassword.value &&
    name.value &&
    postCode.value &&
    address1.value &&
    address2.value &&
    phone.value &&
    gender.value &&
    birthday.value &&
    carrier.value &&
    refundName.value &&
    refundBank.value &&
    refundAccount.value
);

const verifyEmail = async () => {
  try {
    if (!email.value.length > 0) {
      alert("사용하실 이메일을 입력해주세요!");
      return;
    }

    if (!email.value.includes("@")) {
      alert("이메일 형식이 맞지 않습니다!");
      return;
    }

    const doc = await getDocs(
      query(collection(db, "users"), where("userEmail", "==", email.value))
    );
    if (doc.size > 0) {
      alert("이미 가입된 이메일입니다!");
      emailVerified.value = false;
    } else {
      alert("사용 가능한 이메일입니다!");
      emailVerified.value = true;
    }
  } catch (error) {
    console.error("Error verifying email:", error);
  }
};

const verifyReferral = async () => {
  try {
    if (!referral.value.length > 0) {
      alert("추천인 이메일을 입력해주세요!");
      return;
    }

    if (!referral.value.includes("@")) {
      alert("이메일 형식이 맞지 않습니다!");
      return;
    }

    const doc = await getDocs(
      query(collection(db, "users"), where("userEmail", "==", referral.value))
    );
    if (doc.size > 0) {
      alert("추천인 확인이 완료되었습니다!");
      referralVerified.value = true;
    } else {
      alert("가입된 추천인이 없습니다!");
      referralVerified.value = false;
    }
  } catch (error) {
    console.error("Error verifying referral:", error);
  }
};

function searchPostCode() {
  new window.daum.Postcode({
    oncomplete: function (data) {
      var roadAddr = data.roadAddress;
      var extraRoadAddr = "";
      if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname;
      }
      if (data.buildingName !== "" && data.apartment === "Y") {
        extraRoadAddr +=
          extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName;
      }
      if (extraRoadAddr !== "") {
        extraRoadAddr = " (" + extraRoadAddr + ")";
      }

      postCode.value = data.zonecode;
      address1.value = roadAddr;
      address2.value = roadAddr ? extraRoadAddr : "";
    },
  }).open();
}

const join = async () => {
  if (password.value !== retryPassword.value) {
    alert("비밀번호가 일치하지 않습니다!");
    return;
  }

  if (joinVerified.value == false) {
    alert("입력하지 않은 항목이 있습니다!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    if (userCredential.user) {
      const userId = userCredential.user.uid;
      await setDoc(doc(db, "users", userId), {
        userId: email.value.split("@")[0],
        userEmail: email.value,
        userName: name.value,
        userBirthday: birthday.value,
        userGender: gender.value,
        userCarrier: carrier.value,
        userPhone: phone.value.replaceAll("-", ""),
        userGrade: "🌱 솜털냥이",
        userPostCode: postCode.value,
        userAddress1: address1.value,
        userAddress2: address2.value,
        userActualPaymentAmount: 0,
        userTotalOrdersCount: 0,
        userAvailableReservesAmount: 0,
        userTotalUsedReservesAmount: 0,
        userTotalReservesAmount: 0,
        userReferral: referral.value,
        userReferralList: [],
        userRefundAccount: `${
          refundBank.value
        }/${refundAccount.value.replaceAll("-", "")}/${refundName.value}`,
        createdAt: new Date(),
        isAdmin: false,
      });
      const referralUserDocs = await getDocs(
        query(collection(db, "users"), where("userEmail", "==", referral.value))
      );
      const referralUserDoc = referralUserDocs.docs[0];
      await updateDoc(referralUserDoc.ref, {
        userReferralList: arrayUnion(email.value),
      });
      alert("회원가입이 완료되었습니다!");
      router.push("/");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    alert("회원가입 오류입니다! 관리자에게 문의해주세요.");
  }
};
</script>

<style scoped lang="scss">
.login-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: 8px;
  background-color: #fff;
  text-align: center;

  > img {
    width: 192px;
  }

  > div {
    margin-top: 48px;
    width: 100%;

    > h2 {
      padding-bottom: 24px;
    }

    .form:not(:first-child) {
      margin-top: 24px;
    }

    .form {
      > div {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        margin-top: 12px;
        > div {
          display: flex;
          align-items: center;
          gap: 4px;
          > input {
            width: 20px;
            height: 20px;
          }

          > label {
            font-size: 14px;
          }
        }
      }

      > button {
        padding: 12px 16px;
        font-size: 16px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        font-weight: 700;

        &:hover {
          background-color: #0069d9;
        }

        &:disabled {
          background-color: #999;
          cursor: not-allowed;
        }
      }
    }

    .form > input {
      padding: 8px;
      width: 100%;
      border: none;
      border-bottom: 1.5px solid #ccc;
      margin-bottom: 8px;
      margin-top: 4px;
      font-size: 16px;

      &:focus {
        outline: none;
        border-bottom-color: #007bff;
      }
    }

    > button {
      margin-top: 36px;
      padding: 12px 16px;
      font-size: 16px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      font-weight: 700;

      &:hover {
        background-color: #0069d9;
      }
    }
  }
}
</style>
