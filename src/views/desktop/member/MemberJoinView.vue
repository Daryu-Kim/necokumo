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
            <input type="text" maxlength="3" />
            <p>-</p>
            <input type="text" maxlength="4" />
            <p>-</p>
            <input type="text" maxlength="4" />
          </div>
        </div>
        <div class="input-container">
          <p>비밀번호<span>*</span></p>
          <input type="password" />
        </div>
        <div class="input-container">
          <p>비밀번호 확인<span>*</span></p>
          <input type="password" />
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
          <div>
            <input
              type="radio"
              name="verifyMethod"
              v-model="verifyMethod"
              :value="3"
              :disabled="isVerified"
              id="passport"
            />
            <label for="passport">여권</label>
          </div>
        </div>
        <img src="@/assets/resident_guide.png" v-if="verifyMethod === 1" />
        <img src="@/assets/driver_guide.png" v-if="verifyMethod === 2" />
        <img src="@/assets/passport_guide.png" v-if="verifyMethod === 3" />
        <div class="input-container" v-if="verifyMethod">
          <p>이름<span>*</span></p>
          <input
            type="text"
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
              maxlength="6"
              :disabled="isVerified"
              placeholder="②번 항목"
            />
            <p>-</p>
            <input
              type="password"
              maxlength="7"
              :disabled="isVerified"
              placeholder="③번 항목"
            />
          </div>
        </div>
        <div class="input-container" v-if="verifyMethod === 1">
          <p>발급일자<span>*</span></p>
          <input type="date" :disabled="isVerified" />
        </div>
        <!-- 운전면허증 입력란 -->
        <div class="input-container" v-if="verifyMethod === 2">
          <p>생년월일<span>*</span></p>
          <input type="date" :disabled="isVerified" />
        </div>
        <div class="input-container rrn" v-if="verifyMethod === 2">
          <p>면허번호<span>*</span></p>
          <div>
            <input
              type="text"
              maxlength="2"
              :disabled="isVerified"
              placeholder="⑤번 항목"
            />
            <p>-</p>
            <input
              type="text"
              maxlength="2"
              :disabled="isVerified"
              placeholder="⑥번 항목"
            />
            <p>-</p>
            <input
              type="text"
              maxlength="6"
              :disabled="isVerified"
              placeholder="⑦번 항목"
            />
            <p>-</p>
            <input
              type="text"
              maxlength="2"
              :disabled="isVerified"
              placeholder="⑧번 항목"
            />
          </div>
        </div>
        <div class="input-container" v-if="verifyMethod === 2">
          <p>식별번호</p>
          <input
            type="text"
            :disabled="isVerified"
            maxlength="6"
            placeholder="⑨번 항목 (없을 경우 제외)"
          />
        </div>
        <!-- 여권 입력란 -->
        <div class="input-container" v-if="verifyMethod === 3">
          <p>생년월일<span>*</span></p>
          <input type="date" :disabled="isVerified" />
        </div>
        <div class="input-container" v-if="verifyMethod === 3">
          <p>여권 번호<span>*</span></p>
          <input type="text" :disabled="isVerified" placeholder="②번 항목" />
        </div>
        <div class="input-container" v-if="verifyMethod === 3">
          <p>발급 일자<span>*</span></p>
          <input type="date" :disabled="isVerified" />
        </div>
        <div class="input-container" v-if="verifyMethod === 3">
          <p>만료 일자<span>*</span></p>
          <input type="date" :disabled="isVerified" />
        </div>
        <!-- goto -->
        <div class="input-container" v-if="verifyMethod">
          <button :disabled="isVerified" @click="handleCheckAdult">
            위의 정보로 본인 확인하기
          </button>
        </div>
        <hr class="sub" />
        <h3>기본 배송지 정보 입력</h3>
        <div class="input-container">
          <p>우편번호<span>*</span></p>
          <input type="email" />
        </div>
        <div class="input-container">
          <p>기본 주소<span>*</span></p>
          <input type="email" />
        </div>
        <div class="input-container">
          <p>나머지 주소<span>*</span></p>
          <input type="email" />
        </div>
        <hr class="sub" />
        <h3>환불 정보 입력</h3>
        <div class="input-container">
          <p>은행명<span>*</span></p>
          <input type="email" />
        </div>
        <div class="input-container">
          <p>계좌번호<span>*</span></p>
          <input type="email" />
        </div>
        <div class="input-container">
          <p>예금주<span>*</span></p>
          <input type="email" />
        </div>
        <hr class="sub" />
        <h3>영업자 정보 입력</h3>
        <div class="input-container">
          <p>영업자 코드 (선택)</p>
          <input type="email" />
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
import { ref } from "vue";
// import router from "@/router";

const verifyMethod = ref(1);
const isVerified = ref(false);
const msg = ref("");
const verifiedInfo = ref({});

const handleCheckAdult = async () => {
  try {
    const result = {};
    switch (verifyMethod.value) {
      case 1:
        break;
      case 2:
        break;
      case 3:
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

      > .input-container {
        margin-top: 16px;
        > p {
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

        > input {
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
