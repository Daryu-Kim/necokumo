<template>
  <div class="admin-consumer-add">
    <h2>{{ isReplace ? "회원 정보 수정하기" : "회원 정보 등록하기" }}</h2>
    <div class="add-box">
      <h3>기본 정보</h3>
      <div>
        <h4>유저 ID</h4>
        <input
          type="text"
          v-model="userData.userId"
          maxlength="16"
          placeholder="8 ~ 16자의 영문, 숫자, 특수문자 중 1가지 이상"
          :disabled="isReplace"
        />
      </div>
      <div>
        <h4>유저 E-Mail</h4>
        <input
          type="email"
          v-model="userData.userEmail"
          placeholder="실제 사용중인 유저의 E-Mail 주소"
          :disabled="isReplace"
        />
      </div>
      <div v-if="!isReplace">
        <h4>유저 비밀번호</h4>
        <input
          type="password"
          v-model="userPassword"
          placeholder="8 ~ 20자의 영문, 숫자, 특수문자 중 2가지 이상 (설정하지 않을 시 휴대폰 번호로 설정)"
        />
      </div>
      <div v-if="!isReplace">
        <h4>유저 비밀번호 재입력</h4>
        <input
          type="password"
          v-model="userRePassword"
          placeholder="사용할 비밀번호 재입력"
        />
      </div>
      <div>
        <h4>유저 이름</h4>
        <input
          type="text"
          v-model="userData.userName"
          placeholder="신분증 기재 상 이름 입력"
        />
      </div>
      <div>
        <h4>유저 주소</h4>
        <div class="address-container">
          <div>
            <input
              type="text"
              v-model="userData.userPostCode"
              disabled
              placeholder="00000"
            />
            <button @click="openAddressPopup()">주소검색</button>
          </div>
          <input
            type="text"
            v-model="userData.userAddress1"
            disabled
            placeholder="주소 검색을 사용하세요."
          />
          <input
            type="text"
            v-model="userData.userAddress2"
            placeholder="상세 주소를 입력하세요 (예: 아파트, 동/호수 등)"
          />
        </div>
      </div>
    </div>
    <div class="add-box">
      <h3>추가 정보</h3>
      <div>
        <h4>유저 성별</h4>
        <div class="radio-box">
          <div>
            <input
              name="gender"
              id="male"
              type="radio"
              value="남"
              v-model="userData.userGender"
              :disabled="isReplace"
            />
            <label for="male">남자</label>
          </div>
          <div>
            <input
              name="gender"
              id="female"
              type="radio"
              value="여"
              v-model="userData.userGender"
              :disabled="isReplace"
            />
            <label for="female">여자</label>
          </div>
        </div>
      </div>
      <div>
        <h4>유저 생년월일</h4>
        <input
          type="date"
          v-model="userData.userBirthday"
          :disabled="isReplace"
        />
      </div>
      <div>
        <h4>유저 통신사</h4>
        <div class="radio-box">
          <div>
            <input
              name="carrier"
              id="SKT"
              type="radio"
              value="SKT"
              v-model="userData.userCarrier"
            />
            <label for="SKT">SKT</label>
          </div>
          <div>
            <input
              name="carrier"
              id="KT"
              type="radio"
              value="KT"
              v-model="userData.userCarrier"
            />
            <label for="KT">KT</label>
          </div>
          <div>
            <input
              name="carrier"
              id="LGU"
              type="radio"
              value="LG U+"
              v-model="userData.userCarrier"
            />
            <label for="LGU">LG U+</label>
          </div>
          <div>
            <input
              name="carrier"
              id="SKT2"
              type="radio"
              value="SKT 알뜰폰"
              v-model="userData.userCarrier"
            />
            <label for="SKT2">SKT 알뜰폰</label>
          </div>
          <div>
            <input
              name="carrier"
              id="KT2"
              type="radio"
              value="KT 알뜰폰"
              v-model="userData.userCarrier"
            />
            <label for="KT2">KT 알뜰폰</label>
          </div>
          <div>
            <input
              name="carrier"
              id="LGU2"
              type="radio"
              value="LG U+ 알뜰폰"
              v-model="userData.userCarrier"
            />
            <label for="LGU2">LG U+ 알뜰폰</label>
          </div>
        </div>
      </div>
      <div>
        <h4>유저 휴대폰번호</h4>
        <input
          type="phone"
          v-model="userData.userPhone"
          placeholder="'-' 없이 숫자만 입력"
          @input="
            (e) =>
              (userData.userPhone = e.target.value
                .replace(/[^0-9]/g, '')
                .slice(0, 11))
          "
        />
      </div>
      <div>
        <h4>유저 환불계좌</h4>
        <div class="refund-container">
          <select v-model="userRefundAccount[0]">
            <option value="">선택</option>
            <option
              v-for="(item, index) in bankNames"
              :key="index"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
          <input
            type="text"
            placeholder="계좌번호 입력"
            v-model="userRefundAccount[1]"
            @input="
              (e) =>
                (userRefundAccount[1] = e.target.value.replace(/[^0-9]/g, ''))
            "
          />
          <input
            type="text"
            placeholder="예금주명"
            v-model="userRefundAccount[2]"
          />
        </div>
      </div>
      <div>
        <h4>유저 추천인 아이디</h4>
        <input
          type="text"
          v-model="userData.userReferralId"
          placeholder="추천인 아이디 입력 (영문, 숫자만 입력)"
        />
      </div>
    </div>
    <div class="button-box">
      <button @click="confirmUserData" :disabled="isBusy">
        {{ isReplace ? "회원 정보 수정하기" : "회원 정보 등록하기" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { auth, db } from "@/lib/firebase";
import router from "@/router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
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
import { nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const isBusy = ref(false);
const isReplace = ref(false);
const userData = ref({});
const route = useRoute();

const userPassword = ref("");
const userRePassword = ref("");
const userRefundAccount = ref([""]);

const bankNames = [
  "경남은행",
  "광주은행",
  "단위농협(지역농축협)",
  "부산은행",
  "새마을금고",
  "산림조합",
  "신한은행",
  "신협",
  "씨티은행",
  "우리은행",
  "우체국예금보험",
  "저축은행중앙회",
  "전북은행",
  "제주은행",
  "카카오뱅크",
  "케이뱅크",
  "토스뱅크",
  "하나은행",
  "홍콩상하이은행",
  "IBK기업은행",
  "KB국민은행",
  "iM뱅크(대구)",
  "한국산업은행",
  "NH농협은행",
  "SC제일은행",
  "Sh수협은행",
  "교보증권",
  "대신증권",
  "메리츠증권",
  "미래에셋증권",
  "부국증권",
  "삼성증권",
  "신영증권",
  "신한금융투자",
  "유안타증권",
  "유진투자증권",
  "카카오페이증권",
  "키움증권",
  "토스머니",
  "토스증권",
  "펀드온라인코리아(한국포스증권)",
  "하나금융투자",
  "아이엠증권",
  "한국투자증권",
  "한화투자증권",
  "현대차증권",
  "DB금융투자",
  "KB증권",
  "KTB투자증권(다올투자증권)",
  "LIG투자증권",
  "NH투자증권",
  "SK증권",
];

async function confirmUserData() {
  try {
    if (
      userData.value.userId === "" ||
      userData.value.userEmail === "" ||
      userData.value.userName === "" ||
      userData.value.userPostCode === "" ||
      userData.value.userAddress1 === "" ||
      userData.value.userGender === "" ||
      userData.value.userBirthday === "" ||
      userData.value.userCarrier === "" ||
      userData.value.userPhone === "" ||
      userRefundAccount.value[0] === "" ||
      userRefundAccount.value[1] === "" ||
      userRefundAccount.value[2] === ""
    ) {
      alert("누락된 내용을 입력해주세요.");
      return;
    }

    if (!isReplace.value) {
      if (userPassword.value !== userRePassword.value) {
        alert("비밀번호가 일치하지 않습니다!");
        return;
      }

      const duplicatedUserId = await getDocs(
        query(
          collection(db, "users"),
          where("userId", "==", userData.value.userId)
        )
      );

      if (duplicatedUserId.docs.length > 0) {
        alert("중복된 아이디가 있습니다!");
        return;
      }

      const duplicatedUserEmail = await getDocs(
        query(
          collection(db, "users"),
          where("userEmail", "==", userData.value.userEmail)
        )
      );

      if (duplicatedUserEmail.docs.length > 0) {
        alert("중복된 이메일이 있습니다!");
        return;
      }

      if (userData.value.userReferralId.length > 0) {
        const existReferralUserId = await getDocs(
          query(
            collection(db, "users"),
            where("userId", "==", userData.value.userReferralId)
          )
        );

        if (existReferralUserId.docs.length === 0) {
          alert("입력하신 추천인이 존재하지 않습니다!");
          return;
        }
      }

      if (userPassword.value.length === 0) {
        userPassword.value = userData.value.userPhone;
      }
    }

    if (!isReplace.value) {
      const originalUserUid = auth.currentUser.uid;
      await signOut(auth);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.value.userEmail,
        userPassword.value
      );

      userData.value.userAge =
        new Date().getFullYear() -
        parseInt(userData.value.userBirthday.slice(0, 4)) +
        1;
      userData.value.userGrade = "🌱 솜털냥이";
      userData.value.userActualPaymentAmount = 0;
      userData.value.userTotalActualOrderCount = 0;
      userData.value.userAvailablePoint = 0;
      userData.value.userTotalUsedPoint = 0;
      userData.value.userTotalPoint = 0;
      userData.value.userRefundAccount = userRefundAccount.value.join("/");
      userData.value.createdAt = Timestamp.fromDate(new Date());
      userData.value.isAdmin = false;

      await setDoc(doc(db, "users", userCredential.user.uid), userData.value);

      if (userData.value.userReferralId.length > 0) {
        const referralUserDoc = (
          await getDocs(
            query(
              collection(db, "users"),
              where("userId", "==", userData.value.userReferralId)
            )
          )
        ).docs[0];
        await updateDoc(doc(db, "users", referralUserDoc.id), {
          userReferralList: arrayUnion(userData.value.userId),
        });
      }

      await signOut(auth);

      const originalUser = (
        await getDoc(doc(db, "users", originalUserUid))
      ).data();
      await signInWithEmailAndPassword(
        auth,
        originalUser.userEmail,
        originalUser.userPassword
      );
    } else {
      const userRef = doc(db, "users", route.query.id);
      userData.value.userRefundAccount = [
        userRefundAccount.value[0], // 은행명
        userRefundAccount.value[1].replace(/-/g, ""), // 계좌번호에서 '-' 제거
        userRefundAccount.value[2], // 예금주명
      ].join("/");
      await updateDoc(userRef, userData.value);

      const referralUserDoc = (
        await getDocs(
          query(
            collection(db, "users"),
            where("userId", "==", userData.value.userReferralId)
          )
        )
      ).docs[0];
      await updateDoc(doc(db, "users", referralUserDoc.id), {
        userReferralList: arrayUnion(userData.value.userId),
      });
    }

    alert("변경내용이 저장되었습니다!");
    router.replace("/admin/consumer/list");
  } catch (error) {
    console.error("Error updating user data: ", error);
  }
}

async function openAddressPopup() {
  new window.daum.Postcode({
    oncomplete: function (data) {
      let fullAddress = data.address; // 도로명 or 지번 주소
      let extraAddress = ""; // 건물명, 법정동 등
      let defaultDetail = ""; // address2에 넣을 기본값

      // 도로명 주소일 경우 부가정보 조합
      if (data.addressType === "R") {
        if (data.bname) extraAddress += data.bname;
        if (data.buildingName) {
          extraAddress += (extraAddress ? ", " : "") + data.buildingName;
        }
      }

      if (extraAddress) {
        defaultDetail = `(${extraAddress})`; // 예: "역삼동, 삼성빌딩"
      }

      // Vue 데이터에 반영
      userData.value.userPostCode = data.zonecode;
      userData.value.userAddress1 = fullAddress;
      userData.value.userAddress2 = defaultDetail; // 여기에 자동 기본값 입력!

      // 상세 주소 input 포커싱
      nextTick(() => {
        document.getElementById("address2")?.focus();
      });
    },
  }).open();
}

onMounted(async () => {
  try {
    const query = route.query.id || null;
    if (query) {
      const data = await (await getDoc(doc(db, "users", query))).data();
      userData.value = data;
      userRefundAccount.value = data.userRefundAccount.split("/");
      isReplace.value = true;
    }
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
});
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
        textarea {
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
