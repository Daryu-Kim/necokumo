<template>
  <div class="consumer-layout">
    <header>
      <router-link to="/" class="home-btn">
        <img src="@/assets/logo.png" alt="logo" />
      </router-link>
    </header>
    <div class="content">
      <router-view></router-view>
    </div>
    <footer>
      <router-link
        to="/"
        :class="$route.name === 'consumer-home' ? 'active' : ''"
      >
        <span class="material-icons-outlined">home</span>
      </router-link>
      <router-link
        to="/category"
        :class="$route.name === 'consumer-category' ? 'active' : ''"
      >
        <span class="material-icons-outlined">category</span>
      </router-link>
      <router-link
        to="/search"
        :class="$route.name === 'consumer-search' ? 'active' : ''"
      >
        <span class="material-icons-outlined">search</span>
      </router-link>
      <router-link
        to="/mypage/profile"
        :class="$route.name === 'consumer-mypage-profile' ? 'active' : ''"
      >
        <span class="material-icons-outlined">person</span>
      </router-link>
      <router-link
        to="/cart"
        :class="$route.name === 'consumer-cart' ? 'active' : ''"
      >
        <span class="material-icons-outlined">shopping_cart</span>
      </router-link>
    </footer>
    <a
      href="https://open.kakao.com/o/sUuhRGDh"
      target="_blank"
      style="position: fixed; bottom: 72px; right: 24px; z-index: 100"
    >
      <img
        src="https://cdn.imweb.me/upload/S201612155852553de8738/636646a526ac3.png"
        width="48px"
        height="48px"
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
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVh();
  window.addEventListener('resize', setVh);
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
  display: flex;
  flex-direction: column;
  height: calc(var(--vh, 1vh) * 100);
  padding-bottom: env(safe-area-inset-bottom);
  > header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 24px;
    z-index: 1;
    box-shadow: 2px 0 8px 0 rgba($color: #000000, $alpha: 0.25);

    > .home-btn {
      height: 36px;
      > img {
        width: 72px;
      }
    }
  }

  > .content {
    flex: 1;
    overflow: scroll;
    padding-bottom: calc(72px + env(safe-area-inset-bottom));
  }

  > footer {
    box-shadow: 2px 0 8px 0 rgba($color: #000000, $alpha: 0.25);
    padding: 0 16px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding-bottom: env(safe-area-inset-bottom);

    > a {
      text-align: center;
      padding: 8px 0;
      > span {
        font-size: 28px;
      }

      &.active {
        * {
          color: #007bff;
        }
      }
    }
  }
}
</style>
