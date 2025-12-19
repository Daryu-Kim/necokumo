<template>
  <div class="consumer-home">
    <div class="main-content-box">
      <swiper
        class="banner-container"
        :space-between="24"
        :loop="true"
        :navigation="true"
        :pagination="{
          clickable: true,
        }"
        :autoplay="{
          delay: 4000,
          disableOnInteraction: false,
        }"
        :modules="[Navigation, Pagination, Autoplay]"
      >
        <swiper-slide
          class="banner-slide"
          v-for="(item, index) in topBannerDatas"
          :key="index"
        >
          <router-link :to="item.redirect">
            <img :src="item.pcUrl" />
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
    <div class="event-products-box">
      <h2>현재 진행중인 <span>이벤트 특가</span> 상품</h2>
      <div class="event-products-container">
        <router-link
          :to="`/product?id=${item.productId}`"
          v-for="(item, index) in eventProductDatas"
          :key="index"
        >
          <img :src="item.productThumbnailUrl.originalUrl" />
          <p class="name">{{ item.productName }}</p>
          <p class="price">
            {{ item.productBankSellPrice.toLocaleString() }}원 ({{
              item.productSellPrice.toLocaleString()
            }}원)
          </p>
        </router-link>
      </div>
    </div>
    <div class="event-products-box">
      <h2>새로 출시된 <span>따끈따끈한</span> 신상품</h2>
      <div class="event-products-container">
        <router-link
          :to="`/product?id=${item.productId}`"
          v-for="(item, index) in newProductDatas"
          :key="index"
        >
          <img :src="item.productThumbnailUrl.originalUrl" />
          <p class="name">{{ item.productName }}</p>
          <p class="price">
            {{ item.productBankSellPrice.toLocaleString() }}원 ({{
              item.productSellPrice.toLocaleString()
            }}원)
          </p>
        </router-link>
      </div>
    </div>
    <div class="popular-products-box">
      <h2>지금 가장 <span>인기 있는</span> 상품</h2>
      <div
        class="products-container"
        v-for="(products, categoryId) in saleDatasByCategory"
        :key="categoryId"
      >
        <div class="title-container">
          <h3>{{ categoryId }}</h3>
        </div>
        <div class="grid-container" v-if="products.length > 0">
          <router-link
            :to="`/product?id=${item.productId}`"
            v-for="(item, index) in products"
            :key="index"
          >
            <img :src="item.productThumbnailUrl.originalUrl" />
            <p class="name">{{ item.productName }}</p>
            <p class="price">
              {{ item.productBankSellPrice.toLocaleString() }}원 ({{
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
import { getDocs, query, collection, where, orderBy, limit, getDoc, doc } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const topBannerDatas = ref([]);
const eventProductDatas = ref([]);
const newProductDatas = ref([]);
const saleDatasByCategory = ref({});
const mainNewsDatas = ref([]);

const saleCategoryIds = [
  "97",
  "49",
  "50",
  "51",
  "52",
  "58",
  "59",
  "70",
  "76",
  "84"
];

onMounted(async () => {
    try {
        console.log("Fetching Top Banner Data...");
        const topBanner = await getDocs(query(collection(db, "banners"), where("category", "==", "MAIN_TOP_BANNER"), orderBy("order", "asc")));
        topBannerDatas.value = topBanner.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
          where("isActive", "==", true),
          where("productCategory", "array-contains", "43"),
          orderBy("popularScore", "desc"),
          orderBy("createdAt", "desc"),
          limit(6)
        ));
        eventProductDatas.value = eventProductSnap.docs.map(doc => ({
          id: doc.id,
         ...doc.data()
        }));
        console.log("Event Product Data Fetched Successfully!: ", eventProductDatas.value);

        console.log("Fetching New Product Data...");
        const newProductSnap = await getDocs(query(
          collection(db, "product"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(6)
        ));
        newProductDatas.value = newProductSnap.docs.map(doc => ({
          id: doc.id,
         ...doc.data()
        }));
        console.log("New Product Data Fetched Successfully!: ", newProductDatas.value);

        console.log("Fetching Sale Data...");
        for (const categoryId of saleCategoryIds) {
          const categoryName = (await getDoc(doc(db, "category", categoryId))).data().categoryName || "";
          const saleSnap = await getDocs(query(
            collection(db, "product"),
            where("isActive", "==", true),
            where("productCategory", "array-contains", categoryId),
            orderBy("popularScore", "desc"),
            orderBy("createdAt", "desc"),
            limit(5)
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
  margin: auto;
  max-width: 1200px;
  min-height: 70vh;

  > div {
    &:not(:first-child) {
      margin-top: 48px;
    }
    > h2 {
      > span {
        color: #007bff;
      }
    }
  }

  > .main-content-box {
    > .banner-container {
      width: calc(1200px - 48px);

      .banner-slide {
        width: 100%;
        height: 100%;

        > a {
          width: fit-content;
          height: fit-content;
          > img {
            width: calc(1200px - 48px);
            border-radius: 8px;
            object-fit: cover;
          }
        }
      }
    }
  }

  > .event-products-box {
    > h2 {
      margin-bottom: 24px;
    }

    > .event-products-container {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
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
    > h2 {
      margin-bottom: 24px;
    }

    > .products-container {
      border-top: 2px solid black;
      display: flex;
      > .title-container {
        padding: 24px;
        border-right: 1px solid #999;
        width: 240px;
      }
      > .grid-container {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
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
