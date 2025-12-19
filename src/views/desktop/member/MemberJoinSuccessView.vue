<template>
  <div class="member-join-success">
    <div class="inner-container">
      <h1>회원가입 완료</h1>
      <div class="join-success-container" v-if="userData">
        <hr />
        <h3>
          <span>{{ userData.userName }}</span>
          님, 가입을 진심으로 환영합니다!
        </h3>
        <div class="icon-container">
          <Icon size="128" color="#333" class="icon">
            <CertificateCheck />
          </Icon>
        </div>
        <div class="description-container">
          <p>
            회원님의 등급은
            <span class="">{{
              convertUserGradeCodeToLabel(userData.userGrade)
            }}</span>
            등급입니다. 구매 금액의
            <span
              >{{
                convertUserGradeCodeToPointRate(userData.userGrade) * 100
              }}%</span
            >가 적립됩니다.
          </p>
          <p>
            <span>50,000원</span> 더 구매하면
            <span>{{ convertUserGradeCodeToLabel("N2") }}</span> 등급으로
            승급되고, 구매 적립금이 늘어납니다!
          </p>
        </div>
        <hr />
        <div class="button-container">
          <button @click="router.push('/')">쇼핑하러 가기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getUserId } from "@/lib/auth";
import { db } from "@/lib/firebase";
import {
  convertUserGradeCodeToLabel,
  convertUserGradeCodeToPointRate,
} from "@/lib/utils";
import router from "@/router";
import { doc, getDoc } from "firebase/firestore";
import { onMounted, ref } from "vue";
import { Icon } from "@vicons/utils";
import { CertificateCheck } from "@vicons/carbon";

const userData = ref({});
onMounted(async () => {
  // 유저 데이터 불러오기
  const userId = await getUserId();
  const tempUserData = (await getDoc(doc(db, "users", userId))).data();
  userData.value = tempUserData;
});
</script>

<style lang="scss" scoped>
.member-join-success {
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

    > .join-success-container {
      margin-top: 48px;
      > hr {
        border: none;
        border-top: 3px solid black;
        margin: 24px 0;

        &.sub {
          border-top: 1px solid #999;
        }
      }

      > h3 {
        text-align: center;
        > span {
          font-size: 24px;
          color: #ff55b3;
        }
      }

      > .icon-container {
        margin: 24px 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      > .description-container {
        > p {
          font-size: 18px;
          font-weight: 500;
          text-align: center;

          &:last-child {
            margin-top: 8px;
          }

          > span {
            color: #ff55b3;
            font-weight: 700;
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
  }
}
</style>
