<template>
  <div class="login-container">
    <img src="@/assets/logo.png" alt="Logo" />
    <div>
      <div class="role-container">
        <div>
          <input
            type="radio"
            id="consumer"
            name="role"
            value="consumer"
            v-model="role"
            checked
          />
          <label for="consumer">일반회원</label>
        </div>
        <div>
          <input
            type="radio"
            v-model="role"
            id="salesperson"
            name="role"
            value="salesperson"
          />
          <label for="salesperson">영업자</label>
        </div>
        <div>
          <input
            type="radio"
            v-model="role"
            id="admin"
            name="role"
            value="admin"
          />
          <label for="admin">관리자</label>
        </div>
      </div>
      <div class="form">
        <input
          type="text"
          v-model="phone"
          required
          inputmode="numeric"
          maxlength="11"
          placeholder="휴대폰 번호 [-(하이픈) 제외]"
          @input="(e) => onlyNumber(e, 'phone')"
          @keyup.enter="login"
        />
      </div>
      <div class="form">
        <input
          type="password"
          v-model="password"
          required
          maxlength="16"
          placeholder="비밀번호 입력"
          @keyup.enter="login"
        />
      </div>
      <button @click="login">로그인</button>
      <div class="tool-container">
        <button @click="openSearchPwDialog">비밀번호 초기화</button>
        <hr />
        <button @click="goJoinPage">회원가입</button>
      </div>
    </div>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <dialog ref="searchPwDialogRef">
      <header>
        <h2>비밀번호 초기화</h2>
        <button @click="closeSearchPwDialog">
          <span class="material-icons-round">close</span>
        </button>
      </header>
      <main>
        <input type="text" v-model="searchPwName" placeholder="가입자 이름" />
        <input
          type="text"
          v-model="searchPwPhone"
          placeholder="가입자 휴대폰 번호"
          inputmode="numeric"
          maxlength="11"
          @input="(e) => onlyNumber(e, 'phone')"
        />
        <button @click="searchPw">비밀번호 초기화</button>
      </main>
    </dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { db } from "@/lib/firebase";
import { useRouter } from "vue-router";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { sendPpurioMessage } from "@/lib/ppurio";
import { generateTempPasswordCryptoJS } from "@/lib/utils";
import { encrypt } from "@/lib/crypto";
import { loginProcess } from "@/lib/auth";

const phone = ref("");
const password = ref("");
const errorMessage = ref("");
const role = ref("consumer");
const searchPwDialogRef = ref(null);
const searchPwName = ref("");
const searchPwPhone = ref("");

const router = useRouter();

const onlyNumber = (e, refName) => {
  const targetRef = {
    phone,
    searchPwPhone,
  }[refName];

  const value = e.target.value.replace(/\D/g, "");
  targetRef.value = value;
  e.target.value = value;
};

const goJoinPage = () => {
  router.push("/member");
};

const openSearchPwDialog = () => {
  searchPwName.value = "";
  searchPwPhone.value = "";
  searchPwDialogRef.value.showModal();
};

const closeSearchPwDialog = () => {
  searchPwDialogRef.value.close();
};

const searchPw = async () => {
  try {
    if (!searchPwName.value) {
      alert("이름을 입력해주세요!");
      return;
    }

    if (!searchPwPhone.value || searchPwPhone.value.length !== 11) {
      alert("휴대폰 번호를 정확히 입력해주세요!");
      return;
    }

    const data = await getDocs(
      query(
        collection(db, "users"),
        where("userName", "==", searchPwName.value),
        where("userPhone", "==", searchPwPhone.value)
      )
    );

    console.log(data);

    if (data.size > 0) {
      const tempPassword = await generateTempPasswordCryptoJS(
        searchPwPhone.value
      );
      const encryptedTempPassword = encrypt(tempPassword);

      await updateDoc(data.docs[0].ref, {
        userPassword: encryptedTempPassword,
      });
      await sendPpurioMessage({
        targets: [
          {
            to: searchPwPhone.value,
          },
        ],
        targetCount: 1,
        content: `[네코쿠모] 임시 비밀번호를 전송해드립니다!\n\n임시 비밀번호: ${tempPassword}\n\n계정 보안을 위해 로그인 후 회원정보 수정에서 비밀번호를 변경해주시기 바랍니다!\n오늘도 즐거운 쇼핑 되시길 바랍니다 :)`,
        refKey: `RESET_${Timestamp.now().seconds}_${searchPwPhone.value}`,
      });
      alert(
        "임시 비밀번호를 문자로 전송하였습니다.\n문자 메시지를 확인하세요."
      );
      searchPwDialogRef.value.close();
    } else {
      errorMessage.value = "회원 정보가 없습니다. 회원가입을 진행해주세요!";
      return;
    }
  } catch (error) {
    console.error(error);
    alert("일치하는 정보가 없습니다.");
  }
};

const login = async () => {
  try {
    if (!phone.value || !password.value) {
      alert("로그인 정보를 모두 입력해주세요!");
      return;
    }

    const encryptedPassword = encrypt(password.value);
    console.log(encryptedPassword);

    const data = await getDocs(
      query(
        collection(db, "users"),
        where("userPhone", "==", phone.value),
        where("userPassword", "==", encryptedPassword)
      )
    );

    if (data.size === 0) {
      errorMessage.value = "회원 정보가 없습니다. 회원가입을 진행해주세요!";
      return;
    }

    const uid = data.docs[0].data().userId;
    const isLogged = loginProcess(uid);

    if (isLogged) {
      switch (role.value) {
        case "consumer":
          window.location.href = "/";
          break;
        case "salesperson":
          window.location.href = "/salesperson";
          break;
        case "admin":
          window.location.href = "/admin";
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
};
</script>

<style scoped lang="scss">
.login-container {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: 8px;
  background-color: #fff;
  text-align: center;
  height: 100%;

  > img {
    width: 128px;
  }

  > div {
    margin-top: 48px;
    width: 100%;

    > .role-container {
      display: flex;
      align-items: center;
      gap: 16px;
      justify-content: end;
      margin-bottom: 16px;

      > div {
        display: flex;
        align-items: center;
        gap: 6px;

        > input {
          accent-color: #007bff;
          width: 16px;
          height: 16px;
        }

        > label {
          font-size: 14px;
        }
      }
    }

    .form > input {
      padding: 12px 8px;
      width: 100%;
      border: none;
      border-bottom: 1.5px solid #ccc;
      margin-bottom: 8px;
      font-size: 16px;

      &:focus {
        outline: none;
        border-bottom-color: #007bff;
      }
    }

    > button {
      margin-top: 16px;
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

    > .tool-container {
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;

      > a,
      button {
        border: none;
        background: none;
        font-size: 14px;
        color: #666;
        cursor: pointer;
      }

      > hr {
        height: 12px;
      }
    }

    > p {
      font-size: 14px;
      margin-top: 8px;
      font-weight: 700;
      color: #007bff;
    }
  }

  > dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 8px;
    width: 90%;
    max-width: 480px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border: none;

    &::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    > header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      position: sticky;
      top: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);
      background: #efefef;

      > h2 {
        font-size: 18px;
      }

      > button {
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        background-color: #007bff;
        color: #fff;
        font-weight: 700;
        cursor: pointer;

        > span {
          font-size: 16px;
        }
      }
    }

    > main {
      padding: 8px 16px;
      > img {
        width: 100%;
      }

      > input {
        padding: 12px 8px;
        width: 100%;
        border: none;
        border-bottom: 1.5px solid #ccc;
        margin-bottom: 8px;
        font-size: 16px;

        &:focus {
          outline: none;
          border-bottom-color: #007bff;
        }
      }

      > button {
        margin-top: 16px;
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
}
.error {
  margin-top: 16px;
  font-size: 14px;
  font-weight: 700;
  color: red;
}
</style>
