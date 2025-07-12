<template>
  <div class="consumer-category">
    <h2>카테고리</h2>
    <hr />
    <div>
      <div class="parent-category-container">
        <div v-for="item in parentCategoryDatas" :key="item.categoryId">
          <input
            type="radio"
            v-model="selectedParentCategoryId"
            :id="item.categoryId"
            name="parentCategory"
            :value="item.categoryId"
          />
          <label :for="item.categoryId">{{ item.categoryName }}</label>
        </div>
      </div>
      <div class="child-category-container">
        <h3>
          <router-link :to="`/list?category=${selectedParentCategoryId}`">
            {{ selectedParentCategoryName }} >
          </router-link>
        </h3>
        <div v-for="item in childCategoryDatas" :key="item.categoryId">
          <router-link :to="`/list?category=${item.categoryId}`">
            {{ item.categoryName }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed, onMounted, ref, watch } from 'vue';
import { db } from "@/lib/firebase";
import { getDocs, query, collection, where, orderBy } from "firebase/firestore";

const parentCategoryDatas = ref([]);
const selectedParentCategoryId = ref("43");
const childCategoryDatas = ref([]);
const selectedParentCategoryName = computed(() => parentCategoryDatas.value.find(item => item.categoryId === selectedParentCategoryId.value)?.categoryName);

const fetchChildCategoryData = async () => {
  try {
    console.log("Fetching Child Category Data..");
    const childCategoryRef = await getDocs(query(collection(db, "category"), where("categoryParentId", "==", selectedParentCategoryId.value), orderBy("categoryOrder", "asc")));
    childCategoryDatas.value = childCategoryRef.docs.map(doc => doc.data());
    console.log("Fetched Child Category Data:", childCategoryDatas.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

onMounted(async () => {
    try {
      console.log("Fetching Parent Category Datas..");
      const parentCategoryRef = await getDocs(query(collection(db, "category"), where("categoryGrade", "==", 0), orderBy("categoryOrder", "asc")));
      parentCategoryDatas.value = parentCategoryRef.docs.map(doc => doc.data());
      console.log("Fetched Parent Category Datas:", parentCategoryDatas.value);

      await fetchChildCategoryData();
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});

watch(() => selectedParentCategoryId.value, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await fetchChildCategoryData();
  }
});
</script>

<style lang="scss" scoped>
.consumer-category {
  height: 100%;
  > h2 {
    text-align: center;
    margin-top: 16px;
  }

  > hr {
    margin-top: 16px;
    border: none;
    border-top: 1px solid #999;
  }

  > div {
    display: flex;
    height: 100%;

    > .parent-category-container {
      min-width: 128px;
      max-width: 128px;
      background: #efefef;
      height: 100%;

      input[type="radio"] {
        display: none;
      }

      label {
        height: 48px;
        cursor: pointer;
        background: #efefef;
        display: flex;
        align-items: center;
        padding: 0 24px;
      }

      input:checked + label {
        background: white;
        color: #007bff;
        font-weight: 700;
      }
    }

    > .child-category-container {
      padding: 12px 16px;
      flex: 1;

      > div {
        &:nth-child(2) {
          margin-top: 8px;
        }

        > a {
          width: 100%;
          height: 42px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
