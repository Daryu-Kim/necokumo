<template>
  <div class="consumer-home">
    <div class="main-content-box">
      <nav>
        <router-link
          v-for="item in categoryDatas"
          :key="item.id"
          :to="`/list?category=${item.id}`"
          >{{ item.title }}</router-link
        >
      </nav>
      <div class="top-banner-box">
        <swiper :space-between="24">
          <swiper-slide v-for="item in topBannerDatas" :key="item.id">
            <router-link :to="item.redirect">
              <img :src="item.url" />
            </router-link>
          </swiper-slide>
        </swiper>
        <div class="topic-box">
          <ul>
            <li>test</li>
            <li>test</li>
            <li>test</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref } from 'vue';
import { db } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

const categoryDatas = ref([]);
const topBannerDatas = ref([]);

onMounted(async () => {
    try {
        console.log("Fetching Category Data...");
        const category = await getDocs(query(collection(db, "category"), where("categoryGrade", "==", 0), orderBy("categoryOrder", "asc")));
        categoryDatas.value = category.docs.filter(doc => doc.id !== '1').map(doc => ({ id: doc.id,title: doc.data().categoryName }));
        console.log("Category Data Fetched Successfully!: ", categoryDatas.value);

        console.log("Fetching Top Banner Data...");
        const topBanner = await getDocs(query(collection(db, "banners"), where("category", "==", "MAIN_TOP_BANNER"), orderBy("order", "asc")));
        topBannerDatas.value = topBanner.docs.map(doc => ({ id: doc.id, url: doc.data().url, redirect: doc.data().redirect }));
        console.log("Top Banner Data Fetched Successfully!: ", topBannerDatas.value);

    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});
</script>

<style lang="scss" scoped>
.consumer-home {
  padding: 16px 24px;
  margin: auto;
  max-width: 1280px;
  > .main-content-box {
    display: flex;
    gap: 24px;

    > nav {
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      background-color: #007bff;
      width: 180px;
      > a {
        width: 100%;
        height: 42px;
        line-height: 42px;
        padding: 0 16px;
        font-weight: 700;
        color: white;
        font-size: 14px;

        &:hover {
          background-color: #0069d9;
        }

        &:first-child {
          &:hover {
            border-radius: 8px 8px 0 0;
            background-color: #0069d9;
          }
        }

        &:last-child {
          &:hover {
            border-radius: 0 0 8px 8px;
            background-color: #0069d9;
          }
        }
      }
    }

    > .top-banner-box {
      display: flex;
      gap: 8px;
      img {
        border-radius: 8px;
        width: 640px;
      }
    }
  }
}
</style>
