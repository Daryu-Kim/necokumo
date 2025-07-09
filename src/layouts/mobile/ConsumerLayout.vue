<template>
  <div class="consumer-layout">
    <header>
      <router-link to="/" class="home-btn">
        <img src="@/assets/logo.png" alt="logo" />
      </router-link>
    </header>
    <div class="content">
      <router-view></router-view>
      <footer>
        <div class="footer-content">
          <div>
            <h2>네코쿠모 폐쇄몰</h2>
            <p class="f-info">회사명: 냥이네구름가게 / 대표자: 김원재</p>
            <p class="f-info">
              사업자등록번호: 228-15-02857 / 통신판매업 신고: 간이과세자
            </p>
            <p class="f-info">
              전화: 010-5577-9069 / 주소: 인천광역시 남동구 예술로258번길 24
            </p>
            <p class="f-info">
              개인정보관리책임: 김원재 (necokumo23@gmail.com) Hosting by Gabia
            </p>
            <p class="f-cont">
              고객센터: 010-5577-9069 / 상담시간: 평일 10:00 ~ 19:00
            </p>
          </div>
        </div>
      </footer>
    </div>
    <a
      href="https://open.kakao.com/o/sUuhRGDh"
      target="_blank"
      style="position: fixed; bottom: 72px; right: 24px; z-index: 100"
    >
      <img
        src="https://cdn.imweb.me/upload/S201612155852553de8738/636646a526ac3.png"
        width="64px"
        height="64px"
      />
    </a>
  </div>
</template>

<script setup lang="js">
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, onMounted } from 'vue';

const currentUser = ref(null);

onMounted(async () => {
  auth.onAuthStateChanged(async (user) => {
    currentUser.value = user;
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        visitedAt: Timestamp.fromDate(new Date()),
      });
    }
  });
});
</script>

<style lang="scss" scoped>
.consumer-layout {
  > header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 24px;
    gap: 16px;

    > .home-btn {
      > img {
        width: 72px;
      }
    }
  }

  > .content {
    display: flex;
    flex-direction: column;
    > div {
      flex: 1;
    }

    > footer {
      background-color: #efefef;
      border-top: 1px solid #cccccc;
      > div.footer-content {
        margin: auto;
        min-width: 1200px;
        padding: 36px 24px;
        display: flex;
        max-width: 1200px;
        justify-content: space-between;
        gap: 16px;

        > div {
          &:nth-child(2) {
            width: 420px;
            word-break: keep-all;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          > h2 {
            margin-bottom: 16px;
          }

          > p.f-info {
            min-height: 24px;
            font-size: 14px;
          }

          > p.f-cont {
            font-size: 16px;
            padding-top: 16px;
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>
