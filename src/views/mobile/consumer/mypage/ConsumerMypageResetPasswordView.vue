<template>
  <div class="consumer-mypage-edit" v-if="userData">
    <h2>비밀번호 변경</h2>
    <div class="user-info-container">
      <div class="summary-container">
        <div class="user-container">
          <span class="material-icons-outlined"> person </span>
          <div>
            <h3>안녕하세요. {{ userData.userName }} 님!</h3>
            <p>
              회원님의 개인정보를 안전하게 보호하고, 개인정보 도용으로 인한
              피해를 예방하기 위해 90일 이상 비밀번호를 변경하지 않은 경우
              비밀번호 변경을 권장하고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-container">
      <div class="input-container">
        <div>
          <p>현재 비밀번호</p>
          <div>
            <input type="password" v-model="existPassword" maxlength="16" />
          </div>
        </div>
        <div>
          <p>새로운 비밀번호</p>
          <div>
            <input type="password" v-model="newPassword" maxlength="16" />
          </div>
        </div>
        <div>
          <p>새로운 비밀번호<br />다시 입력</p>
          <div>
            <input type="password" v-model="confirmPassword" maxlength="16" />
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
import { onMounted, ref } from 'vue';
import { db } from "@/lib/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import router from '@/router';
import { getUserId } from '@/lib/auth';
import { decrypt, encrypt } from '@/lib/crypto';

const userData = ref(null);
const existPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

async function updateUserData() {
  try {
    // 필드가 비어있는 지 확인
    if (existPassword.value === "" || newPassword.value === "" || confirmPassword.value === "") {
      alert("모든 항목을 입력하세요.");
      return;
    }

    // 기존 비밀번호가 일치하는지 확인
    const decryptedPassword = await decrypt(userData.value.userPassword);
    if (decryptedPassword !== existPassword.value) {
      alert("기존 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 새로운 비밀번호 유효성 검사
    if (newPassword.value.length < 8 || newPassword.value.length > 16) {
      alert("비밀번호는 8~16자로 입력하세요.");
      return;
    }

    if (!/[a-z]/.test(newPassword.value) ||!/[0-9]/.test(newPassword.value)) {
      alert("비밀번호는 영문, 숫자를 포함해야 합니다.");
      return;
    }

    if (newPassword.value!== confirmPassword.value) {
      alert("새로운 비밀번호가 일치하지 않습니다.");
      return;
    }

    const uid = getUserId();
    const userRef = doc(db, "users", uid);

    const encryptedPassword = await encrypt(newPassword.value);
    userData.value.userPassword = encryptedPassword;

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

async function fetchUserData() {
  try {
    const uid = getUserId();
    const user = await getDoc(doc(db, 'users', uid));
    userData.value = user.data();
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

  > h2 {
    text-align: center;
  }

  > .user-info-container {
    margin-top: 24px;
    > div {
      border: 1px solid #efefef;
      padding: 24px 16px;
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
          font-size: 36px;
          border: 3px solid black;
          height: fit-content;
          border-radius: 50%;
          margin-bottom: 16px;
        }

        > div {
          > p {
            margin-top: 8px;
            font-size: 14px;
            word-break: keep-all;
          }
        }
      }
    }
  }

  > .edit-container {
    margin-top: 24px;
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
          min-width: 120px;
          max-width: 120px;
          font-size: 14px;
          background: #efefef;
          display: flex;
          align-items: center;
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
            font-size: 14px;
          }

          > p {
            margin-top: 8px;
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }

  > .button-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 48px;

    > button {
      flex: 1;
      font-size: 16px;
      cursor: pointer;
      height: 48px;
      border-radius: 4px;

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
