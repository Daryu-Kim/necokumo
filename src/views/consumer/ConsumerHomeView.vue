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
      <div>
        <div class="top-banner-box">
          <swiper class="banner-container">
            <swiper-slide
              class="banner-slide"
              v-for="(item, index) in topBannerDatas"
              :key="index"
            >
              <router-link :to="item.redirect">
                <img :src="item.url" />
              </router-link>
            </swiper-slide>
          </swiper>
          <div class="topic-box">
            <ul>
              <li>
                <router-link to=""
                  >testouqwefpoijqweffoiuqwhofuiwehuoif</router-link
                >
              </li>
              <li>
                <router-link to=""
                  >testouiqhwfoiuqwhefoiuqwhofuiwehuoif</router-link
                >
              </li>
              <li>
                <router-link to=""
                  >testouiqhwfoiuqwhefoiuqwhofuiwehuoif</router-link
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="top-news-box">
          <div class="news-container"></div>
          <div class="sale-container">
            <div class="sale-box"></div>
            <div class="sale-banner"></div>
          </div>
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
  max-width: 1200px;
  > .main-content-box {
    display: flex;
    gap: 24px;

    > nav {
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      background-color: #007bff;
      min-width: 180px;
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

    > div {
      display: flex;
      flex-direction: column;
      > .top-banner-box {
        flex: 1;
        display: flex;
        gap: 16px;
        height: fit-content;

        > .banner-container {
          height: fit-content;
          .banner-slide {
            > a {
              width: fit-content;
              height: fit-content;
              > img {
                width: 720px;
                border-radius: 8px;
                object-fit: cover;
              }
            }
          }
        }

        > .topic-box {
          padding: 8px;
          background-color: #efefef;
          border-radius: 8px;
          width: 212px;
          height: 128px;

          > ul {
            list-style: disc;
            padding-left: 24px;
            font-size: 14px;

            > li {
              word-wrap: break-word;
              white-space: normal;
              overflow-wrap: break-word;
              word-break: break-word;
              &:not(:first-child) {
                margin-top: 2px;
              }

              > a:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }

      > .top-news-box {
        display: flex;
        gap: 16px;
        flex: 1;
        > .news-container {
          border-radius: 8px;
          flex: 2;
          border: 1px solid #efefef;
          height: 100%;
        }

        > .sale-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          height: 100%;
          > .sale-box {
            flex: 1;
            border-radius: 8px;
            border: 1px solid #efefef;
          }

          > .sale-banner {
            border-radius: 8px;
            height: 42px;
            > a {
              width: fit-content;
              height: fit-content;
              > img {
                width: 720px;
                border-radius: 8px;
                object-fit: cover;
              }
            }
          }
        }
      }
    }
  }
}
</style>
