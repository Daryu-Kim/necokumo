<template>
  <div class="consumer-home">
    <div class="main-content-box">
      <div class="top-banner-box">
        <swiper class="banner-container" :space-between="16">
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
      </div>
      <nav>
        <router-link
          v-for="item in categoryDatas"
          :key="item.id"
          :to="`/list?category=${item.id}`"
          >{{ item.title }}</router-link
        >
      </nav>
    </div>
    <hr />
    <div class="event-products-box">
      <h3>현재 진행중인 <span>이벤트 특가</span> 상품</h3>
      <div class="event-products-container">
        <router-link
          :to="`/product?id=${item.productId}`"
          v-for="(item, index) in eventProductDatas"
          :key="index"
        >
          <img :src="item.productThumbnailUrl.originalUrl" />
          <p class="name">{{ item.productName }}</p>
          <p class="price">
            {{ (item.productSellPrice * 0.95).toLocaleString() }}원 ({{
              item.productSellPrice.toLocaleString()
            }}원)
          </p>
        </router-link>
      </div>
    </div>
    <hr />
    <div class="popular-products-box">
      <h3>지금 가장 <span>인기 있는</span> 상품</h3>
      <div
        class="products-container"
        v-for="(products, categoryId) in saleDatasByCategory"
        :key="categoryId"
      >
        <div class="title-container">
          <h3>{{ categoryId }}</h3>
        </div>
        <hr />
        <div class="grid-container" v-if="products.length > 0">
          <router-link
            :to="`/product?id=${item.productId}`"
            v-for="(item, index) in products"
            :key="index"
          >
            <img :src="item.productThumbnailUrl.originalUrl" />
            <p class="name">{{ item.productName }}</p>
            <p class="price">
              {{ (item.productSellPrice * 0.95).toLocaleString() }}원 ({{
                item.productSellPrice.toLocaleString()
              }}원)
            </p>
          </router-link>
        </div>
        <div class="empty-container" v-else>
          <span class="material-icons-outlined"> error_outline </span>
          <p>추천 상품이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref } from 'vue';
import { db } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy, limit } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

const categoryDatas = ref([]);
const topBannerDatas = ref([]);
const eventProductDatas = ref([]);
const saleDatasByCategory = ref({});
const mainNewsDatas = ref([]);

const saleCategoryNames = [
  "고농도",
  "입호흡 기기",
  "폐호흡 기기",
  "입 / 폐호흡 기기",
  "일회용 기기",
  "궐련형 기기",
  "입호흡 액상",
  "폐호흡 액상",
  "무화기",
  "팟 / 코일",
  "악세사리"
];

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

        console.log("Fetching Main News Data...");
        const mainNewsSnap = await getDocs(query(collection(db, "mainNews"), orderBy("createdAt", "desc"), limit(2)));
        mainNewsDatas.value = mainNewsSnap.docs.map(doc => ({
          id: doc.id,
         ...doc.data()
        }));
        console.log("Main News Data Fetched Successfully!: ", mainNewsDatas.value);

        console.log("Fetching Event Product Data...");
        const eventProductSnap = await getDocs(query(
          collection(db, "product"),
          where("productCategory", "array-contains", "43"),
          orderBy("productLikeCount", "desc"),
          orderBy("createdAt", "desc"),
          limit(2)
        ));
        eventProductDatas.value = eventProductSnap.docs.map(doc => ({
          id: doc.id,
         ...doc.data()
        }));
        console.log("Event Product Data Fetched Successfully!: ", eventProductDatas.value);

        console.log("Fetching Sale Data...");
        for (const categoryName of saleCategoryNames) {
          const categoryDocs = await getDocs(query(collection(db, "category"), where("categoryName", "==", categoryName)));
          const categoryId = categoryDocs.docs[0].data().categoryId;
          const saleSnap = await getDocs(query(
            collection(db, "product"),
            where("productCategory", "array-contains", categoryId),
            orderBy("productLikeCount", "desc"),
            orderBy("createdAt", "desc"),
            limit(6)
          ));

          // 각 카테고리 ID를 키로 하여 데이터 저장
          saleDatasByCategory.value[categoryName] = saleSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }
        console.log("Sale Data Fetched Successfully!: ", saleDatasByCategory.value);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});
</script>

<style lang="scss" scoped>
.consumer-home {
  padding: 16px 24px;

  > div {
    > h3 {
      text-align: center;
      > span {
        color: #007bff;
      }
    }
  }

  > hr {
    margin: 24px 0;
    border: none;
    border-top: 1px solid #efefef;
  }

  > .main-content-box {
    > .top-banner-box {
      width: 100%;
      > .banner-container {
        width: 100%;
        aspect-ratio: 3 / 1;

        .banner-slide {
          width: 100%;
          height: 100%;

          > a {
            width: fit-content;
            height: fit-content;
            > img {
              width: 100%;
              aspect-ratio: 3 / 1;
              border-radius: 8px;
              object-fit: cover;
            }
          }
        }
      }
    }
    > nav {
      margin-top: 24px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      > a {
        width: 100%;
        padding: 12px 8px;
        font-weight: 500;
        font-size: 12px;
        border-radius: 8px;
        border: 1px solid #999;
        text-align: center;
      }
    }
  }

  > .event-products-box {
    > h3 {
      margin-bottom: 24px;
    }

    > .event-products-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;

      > a {
        &:hover {
          > .name {
            text-decoration: underline;
          }
        }
        > img {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 8px;
          object-fit: cover;
          border: 1.5px solid #efefef;
          padding: 4px;
        }

        > p {
          text-align: center;
        }

        > .name {
          font-size: 14px;
          color: #666;
          margin-top: 8px;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: keep-all;

          line-height: 1.5;
          height: 42px;
        }

        > .price {
          font-weight: 800;
          margin-top: 4px;
          font-size: 14px;
        }
      }
    }
  }

  > .popular-products-box {
    > h3 {
      margin-bottom: 24px;
    }

    > .products-container {
      border-top: 2px solid black;
      > .title-container {
        margin-top: 24px;
        text-align: center;
      }
      > hr {
        margin-top: 24px;
        border: none;
        border-top: 1px solid #efefef;
      }
      > .grid-container {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        padding: 24px;
        gap: 24px;

        > a {
          &:hover {
            > .name {
              text-decoration: underline;
            }
          }
          > img {
            width: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 8px;
            object-fit: cover;
            border: 1.5px solid #efefef;
            padding: 4px;
          }

          > p {
            text-align: center;
          }

          > .name {
            font-size: 14px;
            color: #666;
            margin-top: 8px;

            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: keep-all;

            line-height: 1.5;
            height: 42px;
          }

          > .price {
            font-weight: 800;
            margin-top: 4px;
            font-size: 14px;
          }
        }
      }

      > .empty-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 16px;
        padding: 24px;
        border-bottom: 1px solid #efefef;

        > span {
          font-size: 96px;
          color: #999;
        }

        > p {
          color: #999;
          font-size: 18px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
