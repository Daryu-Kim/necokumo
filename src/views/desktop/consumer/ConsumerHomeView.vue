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
          <swiper class="banner-container" :space-between="16">
            <swiper-slide class="banner-slide usd-price">
              <div>
                <h2>실시간 카드결제 환율</h2>
                <span>({{ formatDate(new Date()) }} 한국 표준시 기준)</span>
              </div>
              <h3>1.00 USD</h3>
              <div>
                <h4>KRW</h4>
                <div>
                  <h1>{{ parseInt(usdPrice[0]).toLocaleString() }}</h1>
                  <span>.</span>
                  <h1>{{ parseInt(usdPrice[1]) }}</h1>
                </div>
              </div>
            </swiper-slide>
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
                <router-link to="">
                  현재 게시판에 등록된 토픽이 없습니다.
                </router-link>
              </li>
              <li>
                <router-link to="">
                  현재 게시판에 등록된 토픽이 없습니다.
                </router-link>
              </li>
              <li>
                <router-link to="">
                  현재 게시판에 등록된 토픽이 없습니다.
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <div class="top-news-box">
          <div class="news-container">
            <h4>최신 토픽</h4>
            <div class="news-box">
              <router-link
                :to="`/board?id=${item.id}`"
                v-for="(item, index) in mainNewsDatas"
                :key="index"
              >
                <img :src="item.thumbnail" />
                <p>{{ item.title }}</p>
              </router-link>
            </div>
          </div>
          <div class="sale-container">
            <div class="sale-box">
              <h4>펀스퀘어 공식 사이트</h4>
              <a href="" target="_blank">
                <img src="https://picsum.photos/144/72" />
                <div class="slogan">
                  <p>빠르게 맞춤 제작 가능한 영상!</p>
                </div>
              </a>
              <a href="" target="_blank">
                <div class="company-container">
                  <img src="https://picsum.photos/20" />
                  <p class="company">펀스퀘어</p>
                </div>
                <p class="btn">지금 바로가기 ></p>
              </a>
            </div>
          </div>
        </div>
      </div>
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
            {{ (item.productSellPrice * 0.95).toLocaleString() }}원 ({{
              (
                Math.ceil(
                  ((item.productSellPrice * 0.97) /
                    (Number(usdPrice[0]) + Number(usdPrice[1]) / 100)) *
                    100
                ) / 100
              ).toLocaleString()
            }}$)
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
              {{ (item.productSellPrice * 0.95).toLocaleString() }}원 ({{
                (
                  Math.ceil(
                    ((item.productSellPrice * 0.97) /
                      (Number(usdPrice[0]) + Number(usdPrice[1]) / 100)) *
                      100
                  ) / 100
                ).toLocaleString()
              }}$)
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
import { fetchExchangeRate } from '@/lib/paypal';
import { formatDate } from '@/lib/utils';

const categoryDatas = ref([]);
const topBannerDatas = ref([]);
const eventProductDatas = ref([]);
const saleDatasByCategory = ref({});
const usdPrice = ref([]);
const mainNewsDatas = ref([]);

const saleCategoryNames = [
  "고농도",
  "입호흡 기기",
  "폐호흡 기기",
  "입 / 폐호흡 기기",
  "일회용 기기",
  "입호흡 액상",
  "폐호흡 액상",
  "무화기",
  "팟 / 코일",
  "악세사리"
];

const fetchUSDPrice = async () => {
  console.log("Fetching USD Price...");
  const usd = await fetchExchangeRate();
  usdPrice.value = usd.toFixed(2).split(".");
  console.log(typeof usdPrice.value[0])
  console.log("USD Price Fetched Successfully!: ", usdPrice.value);
}

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
          where("isActive", "==", true),
          where("productCategory", "array-contains", "43"),
          orderBy("productLikeCount", "desc"),
          orderBy("createdAt", "desc"),
          limit(6)
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
            where("isActive", "==", true),
            where("productCategory", "array-contains", categoryId),
            orderBy("productLikeCount", "desc"),
            orderBy("createdAt", "desc"),
            limit(10)
          ));

          // 각 카테고리 ID를 키로 하여 데이터 저장
          saleDatasByCategory.value[categoryName] = saleSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }
        console.log("Sale Data Fetched Successfully!: ", saleDatasByCategory.value);

        await fetchUSDPrice();

        setInterval(async () => {
          await fetchUSDPrice();
        }, 60000); // 10 minutes
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
        height: 44px;
        line-height: 44px;
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
          width: 720px;
          height: 128px;

          .banner-slide {
            width: 100%;
            height: 100%;
            &.usd-price {
              background-color: #000;
              border-radius: 8px;
              color: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 12px 24px;
              > h3 {
                margin-top: 4px;
                align-self: flex-end;
              }

              > div {
                display: flex;
                align-items: end;
                gap: 8px;

                > div {
                  display: flex;
                  gap: 4px;

                  > h1 {
                    background-color: white;
                    color: #000;
                    padding: 2px 4px;
                  }

                  > span {
                    font-weight: 700;
                    font-size: 32px;
                  }
                }
              }
            }

            > a {
              width: fit-content;
              height: fit-content;
              > img {
                width: 720px;
                height: 128px;
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
          padding: 16px;

          > .news-box {
            margin-top: 8px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            > a {
              display: flex;
              align-items: center;
              gap: 8px;
              > img {
                height: 102px;
                aspect-ratio: 5 / 3;
                border-radius: 8px;
                object-fit: cover;
                border: 1.5px solid #efefef;
                padding: 4px;
              }

              > p {
                flex: 1;
                font-size: 14px;
                color: #333;
                font-weight: 700;
              }
            }
          }
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
            padding: 16px;

            > a {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-top: 8px;
              gap: 16px;

              > img {
                width: 144px;
                height: 72px;
                border-radius: 4px;
              }

              > .company-container {
                display: flex;
                align-items: center;
                gap: 8px;

                > img {
                  border-radius: 50%;
                }

                > p {
                  font-size: 14px;
                  color: #666;
                }
              }

              > .btn {
                font-size: 14px;
                color: #666;
              }

              > .slogan {
                height: 72px;
                font-size: 14px;
                font-weight: 500;
                border-top: 1px solid #efefef;
                border-bottom: 1px solid #efefef;
                flex: 1;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
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
