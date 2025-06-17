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
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted, ref } from 'vue';
import { db } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy } from "firebase/firestore";

const categoryDatas = ref([]);

onMounted(async () => {
    try {
        console.log("Fetching Category Data...");
        const category = await getDocs(query(collection(db, "category"), where("categoryGrade", "==", 0), orderBy("categoryOrder", "asc")));
        categoryDatas.value = category.docs.filter(doc => doc.id !== '1').map(doc => ({ id: doc.id,title: doc.data().categoryName }));
        console.log("Category Data Fetched Successfully!: ", categoryDatas.value);
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
  }
}
</style>
