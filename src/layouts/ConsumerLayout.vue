<template>
  <div class="consumer-layout">
    <div class="header">
      <router-link to="">판매자</router-link>
      <hr />
      <router-link to="">관리자</router-link>
    </div>
    <header>
      <router-link to="/" class="home-btn">
        <img src="@/assets/logo.png" alt="logo" />
      </router-link>
      <div class="search-bar">
        <input type="text" placeholder="검색어를 입력해주세요." />
        <button @click="handleSearch">
          <span class="material-icons-outlined"> search </span>
        </button>
      </div>
      <div class="user-info">
        <router-link to="">
          <span class="material-icons-outlined"> schedule </span>
          <p>최근</p>
        </router-link>
        <router-link to="">
          <span class="material-icons-outlined"> favorite_border </span>
          <p>관심</p>
        </router-link>
        <router-link to="">
          <span class="material-icons-outlined"> person </span>
          <p>로그인</p>
        </router-link>
      </div>
    </header>
    <div class="content"><router-view></router-view></div>
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
        <div>
          <p class="f-info">
            19세 이미지와 "만 19세 미만 이용금지 이 사이트는 청소년에게 유해한
            정보를 포함하고 있어 성인 인증 절차를 거쳐야합니다.
          </p>
          <p class="f-info">
            이 사이트의 내용은 청소년 유해매체물로서 정보통신망 이용촉진 및
            정보보호등에 관한 법률 및 청소년 보호법의 규정에 의하여 19세 미만의
            청소년이 이용할 수 없습니다.
          </p>
          <p class="f-info">
            신분증 도용 및 개인 정보 도용은 법적 처벌 대상입니다.
          </p>
          <p class="f-info">
            신분증 및 개인 정보 도용 가입시 확인 후 무통보 탈퇴 처리됩니다.
          </p>
        </div>
      </div>
      <div class="copyright">
        <p>Copyrightⓒ 2025 네코쿠모 폐쇄몰. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="js"></script>

<style lang="scss" scoped>
.consumer-layout {
  > .header {
    display: flex;
    align-items: center;
    justify-content: end;
    border-bottom: 1px solid #efefef;
    padding: 8px 24px;
    gap: 8px;

    > hr {
      height: 10px;
    }

    > a {
      font-size: 12px;
    }
  }

  > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    gap: 16px;

    > .home-btn {
      > img {
        width: 128px;
      }
    }

    > .search-bar {
      padding: 8px 16px;
      width: 360px;
      border-radius: 100rem;
      border: 1px solid black;
      display: flex;
      align-items: center;
      gap: 8px;
      height: 44px;

      > input {
        flex: 1;
        height: 100%;
        font-size: 16px;
        border: none;

        &:focus {
          outline: none;
        }
      }

      > button {
        background: none;
        border: none;
        cursor: pointer;
      }
    }

    > .user-info {
      display: flex;
      align-items: center;
      gap: 36px;

      > a {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        > span {
          font-size: 36px;
        }

        > p {
          font-size: 14px;
        }
      }
    }
  }
  > footer {
    > div.footer-content {
      padding: 36px 24px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      background-color: #efefef;
      border-top: 1px solid #cccccc;

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

    > div.copyright {
      background-color: black;
      padding: 6px;
      > p {
        color: white;
        font-size: 12px;
        text-align: center;
      }
    }
  }
}
</style>
