<template>
  <div class="consumer-mypage-edit" v-if="userData">
    <h1>회원 정보 수정</h1>
    <div class="user-info-container">
      <div class="summary-container">
        <div style="width: 50%" class="user-container">
          <span class="material-icons-outlined"> person </span>
          <div>
            <h2>안녕하세요. {{ userData.userName }} 님!</h2>
            <p class="grade">
              고객님의 회원 등급은
              <span>{{ convertUserGradeCodeToLabel(userData.userGrade) }}</span>
              입니다.
            </p>
            <p style="margin-top: 4px">
              오늘도 구름 위를 걷는 듯한 쇼핑을 즐겨보세요 ☁️
            </p>
            <p>
              네코쿠모에서만 만날 수 있는 특별한 아이템이 기다리고 있어요 🐱
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-container">
      <div class="title-container">
        <strong>기본정보</strong>
        <p><span>*</span> 필수 입력사항</p>
      </div>
      <div class="input-container">
        <div>
          <p><span>*</span>휴대전화</p>
          <div>
            <input
              type="text"
              v-model="userData.userPhone"
              disabled
              @input="
                (e) =>
                  (userData.userPhone = e.target.value
                    .replace(/[^0-9]/g, '')
                    .slice(0, 11))
              "
            />
          </div>
        </div>
        <div>
          <p><span>*</span>이름</p>
          <div>
            <input type="text" v-model="userData.userName" disabled />
          </div>
        </div>
        <div>
          <p><span>*</span>주소</p>
          <div>
            <div class="address-container">
              <div>
                <input type="text" v-model="userData.userPostCode" disabled />
                <button @click="openAddressPopup()">주소검색</button>
              </div>
              <input type="text" v-model="userData.userAddress1" disabled />
              <input
                type="text"
                v-model="userData.userAddress2"
                placeholder="상세 주소를 입력하세요 (예: 아파트, 동/호수 등)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-container">
      <div class="title-container">
        <strong>추가정보</strong>
      </div>
      <div class="input-container">
        <div>
          <p>생년월일</p>
          <div>
            <div class="birthday-container">
              <input type="text" v-model="userBirthday[0]" disabled />
              <span>년</span>
              <input type="text" v-model="userBirthday[1]" disabled />
              <span>월</span>
              <input type="text" v-model="userBirthday[2]" disabled />
              <span>일</span>
            </div>
          </div>
        </div>
        <div>
          <p>환불계좌</p>
          <div>
            <div class="refund-container">
              <select v-model="userData.userBankName">
                <option value="">== 은행명 선택 ==</option>
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
                v-model="userData.userBankAccountNumber"
                @input="
                  (e) =>
                    (userData.userBankAccountNumber = e.target.value.replace(
                      /[^0-9]/g,
                      ''
                    ))
                "
              />
              <input
                type="text"
                placeholder="예금주명"
                v-model="userData.userBankDepositorName"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <button class="outlined" @click="goBack">취소</button>
      <button class="primary" @click="updateUserData">변경내용 저장</button>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref, nextTick } from 'vue';
import { db } from "@/lib/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import router from '@/router';
import { getUserId } from '@/lib/auth';
import { convertUserGradeCodeToLabel } from '@/lib/utils';

const userData = ref(null);
const userBirthday = ref([]);
const userRefundAccount = ref([]);
const bankNames = [
  "NH농협은행",
  "카카오뱅크",
  "KB국민은행",
  "토스뱅크",
  "신한은행",
  "우리은행",
  "IBK기업은행",
  "하나은행",
  "새마을금고",
  "부산은행",
  "iM뱅크",
  "케이뱅크",
  "신협",
  "우체국",
  "SC제일은행",
  "경남은행",
  "광주은행",
  "수협",
  "전북은행",
  "저축은행",
  "제주은행",
  "씨티은행",
  "KDB산업은행",
  "산림조합은행",
  "SBI저축은행"
];

async function updateUserData() {
  try {
    const uid = getUserId();
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, userData.value);

    alert("변경내용이 저장되었습니다!");
    window.location.href = "/mypage";
  } catch (error) {
    console.error("Error updating user data: ", error);
  }
}

function goBack() {
  router.back();
}

async function openAddressPopup() {
  new window.daum.Postcode({
    oncomplete: function(data) {
      let fullAddress = data.address;     // 도로명 or 지번 주소
      let extraAddress = '';              // 건물명, 법정동 등
      let defaultDetail = '';             // address2에 넣을 기본값

      // 도로명 주소일 경우 부가정보 조합
      if (data.addressType === 'R') {
        if (data.bname) extraAddress += data.bname;
        if (data.buildingName) {
          extraAddress += (extraAddress ? ', ' : '') + data.buildingName;
        }
      }

      if (extraAddress) {
        defaultDetail = `(${extraAddress})`;     // 예: "역삼동, 삼성빌딩"
      }

      // Vue 데이터에 반영
      userData.value.userPostCode = data.zonecode;
      userData.value.userAddress1 = fullAddress;
      userData.value.userAddress2 = defaultDetail; // 여기에 자동 기본값 입력!

      // 상세 주소 input 포커싱
      nextTick(() => {
        document.getElementById("address2")?.focus();
      });
    }
  }).open();
}

async function fetchUserData() {
  try {
    const uid = getUserId();
    const user = await getDoc(doc(db, 'users', uid));
    userData.value = user.data();
    userBirthday.value = userData.value.userBirthday.split('-');
    userRefundAccount.value = userData.value.userRefundAccount.split('/');
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
}

onMounted(async () => {
    try {
      await fetchUserData();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
});
</script>

<style lang="scss" scoped>
.consumer-mypage-edit {
  padding: 16px 24px;
  margin: auto;
  max-width: 1200px;
  min-height: 70vh;

  > h1 {
    text-align: center;
  }

  > .user-info-container {
    margin-top: 48px;
    > div {
      border: 1px solid #efefef;
      padding: 48px 24px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      &:not(:first-child) {
        border-top: none;
      }
    }

    > .summary-container {
      > .user-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        * {
          text-align: center;
        }
        > span {
          font-size: 48px;
          border: 4px solid black;
          height: fit-content;
          border-radius: 50%;
          margin-bottom: 16px;
        }

        > div {
          > .grade {
            color: #666;
            margin-top: 8px;
            font-size: 16px;
            > span {
              font-weight: 700;
              color: black;
            }
          }

          > p {
            font-size: 14px;
          }
        }
      }
    }
  }

  > .edit-container {
    margin-top: 48px;
    > .title-container {
      display: flex;
      align-items: center;
      justify-content: space-between;

      > p {
        font-size: 14px;
        > span {
          font-weight: 700;
          color: #007bff;
          margin-right: 4px;
        }
      }
    }

    > .input-container {
      border-top: 2px solid black;
      margin-top: 16px;
      > div {
        display: flex;
        align-items: stretch;
        &:not(:first-child) {
          border-top: 1px solid #ccc;
        }
        > p {
          padding: 12px 16px;
          width: 240px;
          background: #efefef;
          display: flex;
          align-items: center;
          > span {
            font-weight: 700;
            color: #007bff;
            margin-right: 4px;
          }
        }

        > div {
          flex: 1;
          padding: 12px 16px;

          > input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #999;
            border-radius: 4px;
            box-sizing: border-box;
            outline: none;
            font-size: 16px;
          }

          > p {
            margin-top: 8px;
            font-size: 14px;
            color: #666;
          }

          > .birthday-container {
            display: flex;
            align-items: center;

            > input {
              width: 100%;
              padding: 8px 12px;
              border: 1px solid #999;
              border-radius: 4px;
              box-sizing: border-box;
              outline: none;
              font-size: 16px;
            }

            > span {
              margin-left: 8px;
              margin-right: 24px;
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
              border: 1px solid #999;
              border-radius: 4px;
              box-sizing: border-box;
              outline: none;
              font-size: 16px;
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
                border: 1px solid #999;
                border-radius: 4px;
                box-sizing: border-box;
                outline: none;
                font-size: 16px;
              }

              > button {
                font-size: 14px;
                border: 1px solid #999;
                border-radius: 4px;
                cursor: pointer;
                height: 38px;
                padding: 8px 16px;
                background: #fff;
              }
            }

            > input {
              width: 100%;
              padding: 8px 12px;
              border: 1px solid #999;
              border-radius: 4px;
              box-sizing: border-box;
              outline: none;
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  > .button-container {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 48px;

    > button {
      flex: 1;
      font-size: 16px;
      cursor: pointer;
      height: 48px;

      &.outlined {
        background: none;
        border: 1px solid #999;
      }

      &.primary {
        background: black;
        color: white;
        font-weight: 700;
        border: none;
      }
    }
  }
}
</style>
