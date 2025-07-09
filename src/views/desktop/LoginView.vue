<template>
  <div class="login-container">
    <img src="@/assets/logo.png" alt="Logo" />
    <form @submit.prevent="login">
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
            id="company"
            name="role"
            value="company"
          />
          <label for="company">협력사</label>
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
          v-model="email"
          required
          placeholder="아이디 또는 이메일 주소"
        />
      </div>
      <div class="form">
        <input
          type="password"
          v-model="password"
          required
          placeholder="비밀번호 [초기 비밀번호: '-' 제외 전화번호]"
        />
      </div>
      <button type="submit">로그인</button>
      <div class="tool-container">
        <button @click="openSearchIdDialog">아이디 / 이메일 찾기</button>
        <hr />
        <button @click="openSearchPwDialog">비밀번호 초기화</button>
      </div>
      <p>기존 네코쿠모 사이트 계정 이메일로 로그인 가능합니다!</p>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <dialog ref="searchIdDialogRef">
      <header>
        <h2>아이디 / 이메일 찾기</h2>
        <button @click="closeSearchIdDialog">
          <span class="material-icons-round">close</span>
        </button>
      </header>
      <main>
        <input type="text" v-model="searchIdName" placeholder="이름" />
        <input type="date" v-model="searchIdBirthday" placeholder="생년월일" />
        <input
          type="text"
          v-model="searchIdPhone"
          placeholder="전화번호 (- 없이 입력)"
        />
        <button @click="searchId">아이디 / 이메일 찾기</button>
      </main>
    </dialog>
    <dialog ref="searchPwDialogRef">
      <header>
        <h2>비밀번호 초기화</h2>
        <button @click="closeSearchPwDialog">
          <span class="material-icons-round">close</span>
        </button>
      </header>
      <main>
        <input type="text" v-model="searchPwEmail" placeholder="이메일 주소" />
        <button @click="searchPw">비밀번호 초기화</button>
      </main>
    </dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth, db } from "@/lib/firebase";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { collection, getDocs, query, where } from "firebase/firestore";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const role = ref("consumer");
const searchIdDialogRef = ref(null);
const searchPwDialogRef = ref(null);
const searchIdName = ref("");
const searchIdBirthday = ref("");
const searchIdPhone = ref("");
const searchPwEmail = ref("");

const router = useRouter();

const openSearchIdDialog = () => {
  searchIdName.value = "";
  searchIdPhone.value = "";
  searchIdDialogRef.value.showModal();
};

const closeSearchIdDialog = () => {
  searchIdDialogRef.value.close();
};

const openSearchPwDialog = () => {
  searchPwEmail.value = "";
  searchPwDialogRef.value.showModal();
};

const closeSearchPwDialog = () => {
  searchPwDialogRef.value.close();
};

const searchId = async () => {
  try {
    const doc = await getDocs(
      query(
        collection(db, "users"),
        where("userName", "==", searchIdName.value),
        where("userBirthday", "==", searchIdBirthday.value),
        where("userPhone", "==", searchIdPhone.value.replaceAll("-", ""))
      )
    );
    if (doc.size > 0) {
      alert(
        `고객님의 아이디와 이메일은 아래와 같습니다!\n\n아이디: ${
          doc.docs[0].data().userId
        }\n이메일: ${doc.docs[0].data().userEmail}`
      );
      email.value = doc.docs[0].data().userEmail;
      searchIdDialogRef.value.close();
    } else {
      alert("일치하는 정보가 없습니다.");
    }
  } catch (error) {
    console.error("Error getting document:", error);
    alert("일치하는 정보가 없습니다.");
  }
};

const searchPw = async () => {
  try {
    await sendPasswordResetEmail(auth, searchPwEmail.value);
    alert("비밀번호 초기화 이메일을 전송하였습니다.\n메일함을 확인하세요.");
    searchPwDialogRef.value.close();
  } catch (error) {
    alert("일치하는 정보가 없습니다.");
  }
};

const login = async () => {
  try {
    let inputEmail = email.value.trim();
    if (!inputEmail.includes("@")) {
      const data = await getDocs(
        query(collection(db, "users"), where("userId", "==", inputEmail))
      );
      if (data.size > 0) {
        inputEmail = data.docs[0].data().userEmail;
      } else {
        errorMessage.value = "일치하는 정보가 없습니다.";
        return;
      }
    }
    await signInWithEmailAndPassword(auth, inputEmail, password.value);
    switch (role.value) {
      case "consumer":
        router.push("/");
        break;
      case "company":
        router.push("/company");
        break;
      case "admin":
        router.push("/admin");
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Error logging in:", error);
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage.value = "유효하지 않은 이메일 주소입니다.";
        break;
      case "auth/user-disabled":
        errorMessage.value = "이 계정은 비활성화되었습니다.";
        break;
      case "auth/user-not-found":
        errorMessage.value = "등록된 사용자가 아닙니다.";
        break;
      case "auth/wrong-password":
        errorMessage.value = "비밀번호가 틀렸습니다.";
        break;
      case "auth/invalid-credential":
        errorMessage.value = "잘못된 자격 증명입니다. 다시 시도해 주세요.";
        break;
      default:
        errorMessage.value = "로그인 중 오류가 발생했습니다.";
    }
  }
};
</script>

<style scoped lang="scss">
.login-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 70vh;
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

  > form {
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
