<template>
  <div class="login-container">
    <h2>관리자 로그인</h2>
    <form @submit.prevent="login">
      <div>
        <input
          type="email"
          v-model="email"
          required
          placeholder="이메일 주소를 입력하세요."
        />
      </div>
      <div>
        <input
          type="password"
          v-model="password"
          required
          placeholder="비밀번호를 입력하세요."
        />
      </div>
      <button type="submit">로그인</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    // Redirect to the home page or another page after successful login
    router.push("/admin");
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
  max-width: 400px;
  margin: 50vh auto 0;
  transform: translateY(-50%);
  padding: 24px;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  background-color: #fff;
  text-align: center;

  > form {
    margin-top: 16px;

    input {
      padding: 8px;
      width: 100%;
      border: none;
      border-bottom: 1.5px solid #ccc;
      margin-bottom: 8px;

      &:focus {
        outline: none;
        border-bottom-color: #007bff;
      }
    }

    button {
      margin-top: 16px;
      padding: 8px 16px;
      font-size: 14px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #0069d9;
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
