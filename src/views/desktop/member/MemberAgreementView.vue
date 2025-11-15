<template>
  <div class="member-agreement">
    <div class="inner-container">
      <h1>회원가입</h1>
      <div class="step-container">
        <p class="current">1. 약관동의</p>
        <p>></p>
        <p>2. 정보입력</p>
        <p>></p>
        <p>3. 가입완료</p>
      </div>
      <div class="agreement-container">
        <h3>전체 동의</h3>
        <hr />
        <div class="checkbox-container">
          <div>
            <input type="checkbox" />
          </div>
          <div class="label-container">
            <label class="bold">모든 약관을 확인하고 전체 동의합니다.</label>
            <p>
              (전체 동의는 필수 및 선택 정보에 대한 동의가 포함되어 있습니다.)
            </p>
          </div>
        </div>
        <hr class="sub" />
        <div class="checkbox-container">
          <div>
            <input type="checkbox" />
          </div>
          <div class="label-container">
            <label>이용약관 동의 (필수)</label>
          </div>
          <button @click="openDialog('AGREEMENT_TERMS')">보기</button>
        </div>
        <div class="checkbox-container">
          <div>
            <input type="checkbox" />
          </div>
          <div class="label-container">
            <label>개인정보 수집 및 이용 동의 (필수)</label>
          </div>
          <button value="">보기</button>
        </div>
        <div class="checkbox-container">
          <div>
            <input type="checkbox" />
          </div>
          <div class="label-container">
            <label>개인정보 수집 및 이용 동의 (선택)</label>
          </div>
          <button>보기</button>
        </div>
        <div class="checkbox-container">
          <div>
            <input type="checkbox" />
          </div>
          <div class="label-container">
            <label>마케팅 목적의 개인정보 수집 및 이용 (선택)</label>
          </div>
          <button>보기</button>
        </div>
        <div class="checkbox-container">
          <div>
            <input type="checkbox" />
          </div>
          <div class="label-container">
            <label>쇼핑정보 SMS / 알림톡 수신 동의 (선택)</label>
          </div>
          <button>보기</button>
        </div>
      </div>
    </div>
    <div v-if="isDialogOpened" class="overlay" @click="closeDialog">
      <div class="modal" @click.stop>
        <div class="title-container">
          <h2>{{ dialogTitle }}</h2>
          <button class="close-button" @click="isDialogOpened = false">
            <Icon>
              <CloseRound />
            </Icon>
          </button>
        </div>
        <hr />
        <div class="content-container">
          <p>{{ dialogContent }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref } from "vue";
import { Icon } from "@vicons/utils";
import { CloseRound } from "@vicons/material";

const isDialogOpened = ref(false);
const dialogTitle = ref("");
const dialogContent = ref("");

const openDialog = async (docId) => {
  try {
    const data = (await getDoc(doc(db, "settings", docId))).data();
    dialogTitle.value = data.title;
    dialogContent.value = data.content;
    isDialogOpened.value = true;
  } catch (e) {
    console.error(e);
  }
};

const closeDialog = () => {
  isDialogOpened.value = false;
};
</script>

<style lang="scss" scoped>
.member-agreement {
  padding: 64px 24px;
  margin: auto;
  max-width: 1200px;
  min-height: 70vh;

  > .inner-container {
    width: 768px;
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

    > .agreement-container {
      margin-top: 48px;
      > hr {
        border: none;
        border-top: 3px solid black;
        margin: 24px 0;

        &.sub {
          border-top: 1px solid #999;
        }
      }

      > .checkbox-container {
        display: flex;
        align-items: center;
        gap: 16px;

        &:not(:first-child) {
          margin-top: 24px;
        }

        > div {
          &.label-container {
            flex: 1;
          }

          > input {
            width: 24px;
            height: 24px;
          }

          > label {
            font-size: 18px;
            &.bold {
              font-weight: 700;
            }
          }

          > p {
            font-size: 14px;
            margin-top: 4px;
            color: #999;
          }
        }

        > button {
          border: none;
          background: #007bff;
          color: white;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;

          &:hover {
            filter: brightness(1.15);
          }
        }
      }
    }
  }

  > .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5); /* 🔥 배경 어둡게 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

    > .modal {
      background: #fff;
      width: 90%;
      max-width: 480px;
      border-radius: 8px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);

      > .title-container {
        display: flex;
        align-items: center;
        padding: 16px 24px;

        > h2 {
          flex: 1;
        }

        > .close-button {
          background: none;
          border: none;
        }
      }

      > .content-container {
        padding: 16px 24px;
      }
    }
  }
}
</style>
