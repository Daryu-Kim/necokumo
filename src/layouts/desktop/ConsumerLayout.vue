<template>
  <div class="consumer-layout">
    <div class="main-header">
      <div class="header">
        <a href="https://instagram.com/necokumo.shop" target="_blank"
          >인스타그램</a
        >
        <a href="https://discord.gg/mGWqRdz4bN" target="_blank">디스코드</a>
        <router-link to="/company">판매자</router-link>
        <router-link to="/admin">관리자</router-link>
      </div>
      <hr />
      <header>
        <div class="main-header">
          <router-link to="/" class="home-btn">
            <img src="@/assets/logo.png" alt="logo" />
          </router-link>
          <div class="search-bar">
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
            />
            <button @click="handleSearch">
              <span class="material-icons-outlined"> search </span>
            </button>
          </div>
          <div class="user-info">
            <router-link to="/mypage" v-if="isLogged">
              <span class="material-icons-outlined"> person </span>
              <p>MY</p>
            </router-link>
            <router-link to="/cart" v-if="isLogged">
              <span class="material-icons-outlined"> shopping_cart </span>
              <p>CART</p>
            </router-link>
            <button @click="logout" v-if="isLogged">
              <span class="material-icons-outlined"> logout </span>
              <p>LOGOUT</p>
            </button>
            <router-link to="/login" v-else>
              <span class="material-icons-outlined"> login </span>
              <p>LOGIN</p>
            </router-link>
          </div>
        </div>
        <hr />
        <div class="category-container">
          <nav class="main-category-nav">
            <router-link
              v-for="item in categoryDatas"
              :key="item.id"
              :to="`/list?category=${item.id}`"
              >{{ item.title }}</router-link
            >
          </nav>
          <nav class="sub-category-nav" v-if="subCategoryDatas.length > 0">
            <router-link
              v-for="item in subCategoryDatas"
              :key="item.id"
              :to="`/list?category=${item.id}`"
              >{{ item.title }}</router-link
            >
          </nav>
        </div>
      </header>
    </div>
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
import router from '@/router';
import { doc, updateDoc, Timestamp, getDocs, query, collection, where, orderBy } from 'firebase/firestore';
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const categoryDatas = ref([]);
const subCategoryDatas = ref([]);
const currentUser = ref(null);
const searchKeyword = ref("");

const route = useRoute();

onMounted(async () => {
  console.log("Fetching Category Data...");
  const category = await getDocs(query(collection(db, "category"), where("categoryGrade", "==", 0), orderBy("categoryOrder", "asc")));
  categoryDatas.value = category.docs.filter(doc => doc.id !== '1').map(doc => ({ id: doc.id,title: doc.data().categoryName }));
  console.log("Category Data Fetched Successfully!: ", categoryDatas.value);

  if (route.query.category) {
    console.log("Fetching Sub Category Data...");
    const subCategory = await getDocs(query(collection(db, "category"), where("categoryParentId", "==", route.query.category), orderBy("categoryOrder", "asc")));
    subCategoryDatas.value = subCategory.docs.filter(doc => doc.id !== '1').map(doc => ({ id: doc.id,title: doc.data().categoryName }));
    console.log("Sub Category Data Fetched Successfully!: ", subCategoryDatas.value);
  } else {
    subCategoryDatas.value = [];
  }

  auth.onAuthStateChanged(async (user) => {
    currentUser.value = user;
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        visitedAt: Timestamp.fromDate(new Date()),
      });
    }
  });
});

const isLogged = computed(() => currentUser.value !== null);

const logout = async () => {
  try {
    await auth.signOut();
    router.push("/");
  } catch (error) {
    console.error('Failed to log out:', error);
  }
}

const handleSearch = () => {
  if (searchKeyword.value.trim() === "") {
    alert("검색어를 입력하세요.");
    return;
  } else {
    const encodedKeyword = encodeURIComponent(searchKeyword.value);
    router.push(`/search?keyword=${encodedKeyword}`);
  }
}

watch(() => route.query.category, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    if (route.query.category) {
      console.log("Fetching Sub Category Data...");
      const subCategory = await getDocs(query(collection(db, "category"), where("categoryParentId", "==", route.query.category), orderBy("categoryOrder", "asc")));
      subCategoryDatas.value = subCategory.docs.filter(doc => doc.id !== '1').map(doc => ({ id: doc.id,title: doc.data().categoryName }));
      console.log("Sub Category Data Fetched Successfully!: ", subCategoryDatas.value);
    } else {
      subCategoryDatas.value = [];
    }
  }
});
</script>

<style lang="scss" scoped>
.consumer-layout {
  > .main-header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 20;
    width: 100%;
    box-shadow: 0px 2px 6px rgba($color: #000000, $alpha: 0.25);

    > .header {
      display: flex;
      align-items: center;
      justify-content: end;
      padding: 8px 24px;
      margin: auto;
      min-width: 1200px;
      gap: 8px;

      > a {
        font-size: 12px;
      }
    }

    > hr {
      border: none;
      border-bottom: 1px solid #efefef;
    }

    > header {
      padding: 16px 24px;
      margin: auto;
      max-width: 1200px;
      min-width: 1200px;

      > .main-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
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

          > a,
          button {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            background: none;
            border: none;
            cursor: pointer;

            > span {
              font-size: 36px;
            }

            > p {
              font-size: 14px;
            }
          }
        }
      }

      > hr {
        margin: 16px 0;
        border: none;
        border-top: 1px solid #efefef;
      }

      > .category-container {
        > .main-category-nav {
          display: flex;
          align-items: center;
          gap: 24px;
          > a {
            font-weight: 700;
            font-size: 18px;

            &:hover {
              color: #007bff;
            }
          }
        }

        > .sub-category-nav {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 24px;
          > a {
            font-weight: 500;

            &:hover {
              color: #007bff;
            }
          }
        }
      }
    }
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

    > div.copyright {
      background-color: black;
      padding: 6px;
      margin: auto;
      min-width: 1200px;
      > p {
        color: white;
        font-size: 12px;
        text-align: center;
      }
    }
  }
}
</style>
