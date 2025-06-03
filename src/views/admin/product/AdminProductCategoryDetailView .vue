<template>
  <div class="admin-product-add">
    <h2>{{ route.query.id ? "카테고리 수정하기" : "카테고리 등록하기" }}</h2>
    <div class="add-box">
      <h3>카테고리 정보</h3>
      <div>
        <h4>카테고리 ID</h4>
        <input
          type="number"
          v-model="categoryId"
          placeholder="예시) 99"
          :disabled="route.query.id"
        />
      </div>
      <div>
        <h4>카테고리명</h4>
        <input
          type="text"
          v-model="categoryName"
          placeholder="예시) 입호흡 기기"
        />
      </div>
      <div>
        <h4>상위 카테고리</h4>
        <select v-model="categoryParentId">
          <option value="">상위 카테고리 없음</option>
          <option
            v-for="category in categoryOriginData"
            :key="category.categoryId"
            :value="category.categoryId"
          >
            {{
              category.categoryGrade == 1
                ? "-"
                : category.categoryGrade == 2
                ? "--"
                : ""
            }}
            {{ category.categoryName }}
          </option>
        </select>
      </div>
    </div>
    <div class="add-box">
      <h3>SEO 정보</h3>
      <div>
        <h4>SEO 제목</h4>
        <input type="text" :value="`${categoryName} - 네코쿠모`" disabled />
      </div>
      <div>
        <h4>SEO 발행자</h4>
        <input type="text" value="네코쿠모" disabled />
      </div>
      <div>
        <h4>SEO 설명</h4>
        <div>
          <input
            type="text"
            v-model="seoDescription"
            placeholder="자동 완성 버튼을 눌러 SEO 전용 설명을 생성해보세요!"
          />
          <div>
            <button @click="generateSeoDescription" :disabled="isBusy">
              자동 완성
            </button>
          </div>
        </div>
      </div>
      <div>
        <h4>SEO 검색 키워드</h4>
        <div>
          <input
            type="text"
            v-model="seoKeywords"
            placeholder="검색어는 콤마로 구분, 검색어 당 최대 125자까지 입력 가능"
          />
          <div>
            <button @click="generateSeoKeywords" :disabled="isBusy">
              자동 완성
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="button-box">
      <button @click="confirmCategory" :disabled="isBusy">
        {{ route.query.id ? "카테고리 수정하기" : "카테고리 등록하기" }}
      </button>
      <button
        @click="deleteCategory"
        :disabled="isBusy"
        v-if="route.query.id"
        class="red"
      >
        카테고리 삭제하기
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  getDocs,
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onMounted, ref, computed } from "vue";
import { db } from "@/lib/firebase";
import { useDeepseek } from "@/lib/openrouter";
import router from "@/router";
import { useRoute } from "vue-router";

const route = useRoute();

const isBusy = ref(false);
const categoryOriginData = ref([]);

const categoryId = ref("");
const categoryName = ref("");
const categoryParentId = ref("");
const seoDescription = ref("");
const seoKeywords = ref("");

const conditionCategoryAdd = computed(() => {
  return (
    categoryId.value &&
    categoryName.value &&
    seoDescription.value &&
    seoKeywords.value
  );
});

const generateSeoDescription = async () => {
  try {
    isBusy.value = true;
    const prompt = `"네코쿠모"라는 전자담배 쇼핑몰을 운영중이야. "${categoryName.value}" 이 카테고리 이름을 바탕으로 다른 불필요한 대답 없이(상품 요약설명, 정리, 대답 필요없음, 보충설명 필요없음. 쓸데없는 말 부조건 제외.) 소비자가 알기 쉽고 구매욕구가 들게 50글자 내의 1문장으로 마케팅 제안 문구만 간결하게 딱 말해줘. api로 content 받아낼거라 그냥 output만 내주면돼.`;
    const data = await useDeepseek(prompt);
    seoDescription.value = data.choices[0].message.content.replaceAll(/"/g, "");
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const generateSeoKeywords = async () => {
  try {
    isBusy.value = true;
    const prompt = `"네코쿠모"라는 전자담배 사이트를 운영중이야. "${categoryName.value}" 이 카테고리 이름을 바탕으로 불필요한 상품 요약설명, 정리, 대답 필요없으니까 전부 제외하고 소비자가 알기 쉽고 구매욕구가 들게 SEO에 노출 잘되게 50개의 키워드를 콤마로 연결하고 띄어쓰기를 모두 없애서 딱 말해줘. 무조건 키워드의 총합은 50을 넘어가면 안되고, 50개의 키워드 중에서 무조건 "네코쿠모", "네코쿠모전자담배", "네코쿠모전담", "냥이네구름가게", "냥이네구름가게전자담배", "냥이네구름가게전담" 키워드들은 무조건 들어가야해.`;
    const data = await useDeepseek(prompt);
    seoKeywords.value = data.choices[0].message.content.replaceAll(/"/g, "");
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const deleteCategory = async () => {
  try {
    isBusy.value = true;
    if (
      confirm(
        "카테고리를 삭제하시겠습니까?\n하위 카테고리까지 모두 삭제됩니다!"
      )
    ) {
      let categoryIds = [route.query.id];
      // const categoryRef = await getDoc(doc(db, "category", route.query.id));
      const childCategoryRef = await getDocs(
        query(
          collection(db, "category"),
          where("categoryParentId", "==", route.query.id)
        )
      );
      if (!childCategoryRef.empty) {
        categoryIds = [
          ...categoryIds,
          ...childCategoryRef.docs.map((doc) => doc.id),
        ];
      }

      // 카테고리 내부 상품들 categoryId 1로 업데이트
      const updateProducts = await getDocs(
        query(
          collection(db, "product"),
          where("productCategory", "array-contains-any", categoryIds)
        )
      );

      const updatePromises = updateProducts.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const originalArray = data.productCategory || [];

        const updatedArray = originalArray.filter(
          (id) => !categoryIds.includes(id)
        );

        if (updatedArray.length === 0) {
          updatedArray.push("1");
        }

        await updateDoc(docSnapshot.ref, {
          productCategory: updatedArray,
        });
      });

      await Promise.all(updatePromises);

      const deletePromises = categoryIds.map((id) =>
        deleteDoc(doc(db, "category", id))
      );

      await Promise.all(deletePromises);

      isBusy.value = false;
      alert("카테고리를 성공적으로 삭제하였습니다.");
      router.push("/admin/product/category");
    } else {
      isBusy.value = false;
      return;
    }
  } catch (error) {
    console.error(error);
    isBusy.value = false;
    return;
  }
};

const confirmCategory = async () => {
  try {
    isBusy.value = true;
    if (!conditionCategoryAdd.value) {
      alert("모든 항목을 채워주세요.");
      isBusy.value = false;
      return;
    }

    let categoryGrade = 0;
    let categoryOrder = 0;

    if (categoryParentId.value) {
      const parentCategory = await getDoc(
        doc(db, "category", categoryParentId.value)
      );
      categoryGrade = parentCategory.data().categoryGrade + 1;
    } else {
      categoryGrade = 0;
    }

    console.log("categoryGrade", categoryGrade);

    const isExistCategory = await getDoc(
      doc(db, "category", categoryId.value.toString())
    );
    console.log("isExistCategory", isExistCategory.exists());
    if (isExistCategory.exists()) {
      console.log("카테고리 있");
      const existCategoryData = isExistCategory.data();
      if (categoryParentId.value == existCategoryData.categoryParentId) {
        categoryOrder = existCategoryData.categoryOrder;
      } else {
        const orderCategory = await getDocs(
          query(
            collection(db, "category"),
            where("categoryParentId", "==", categoryParentId.value)
          )
        );
        categoryOrder = orderCategory.docs.length;
      }
    } else {
      console.log("카테고리 없");
      const orderCategory = await getDocs(
        query(
          collection(db, "category"),
          where("categoryParentId", "==", categoryParentId.value)
        )
      );
      categoryOrder = orderCategory.docs.length;
    }

    console.log("categoryOrder", categoryOrder);

    const categoryData = {
      categoryId: categoryId.value.toString(),
      categoryName: categoryName.value,
      categoryParentId: categoryParentId.value,
      categoryOrder: categoryOrder,
      categoryGrade: categoryGrade,
      seoTitle: `${categoryName.value} - 네코쿠모`,
      seoAuthor: "네코쿠모",
      seoDescription: seoDescription.value,
      seoKeywords: seoKeywords.value,
    };

    console.log("categoryData", categoryData);

    await setDoc(
      doc(db, "category", categoryId.value.toString()),
      categoryData
    );
    alert(
      route.query.id
        ? "카테고리가 성공적으로 수정되었습니다!"
        : "카테고리가 성공적으로 등록되었습니다!"
    );
    isBusy.value = false;
    router.push("/admin/product/category");
  } catch (error) {
    console.error("Error adding product:", error);
    isBusy.value = false;
  }
};

onMounted(async () => {
  try {
    isBusy.value = true;
    const id = route.query.id;

    if (id) {
      const data = (await getDoc(doc(db, "category", id))).data();
      categoryId.value = Number(data.categoryId);
      categoryName.value = data.categoryName;
      categoryParentId.value = data.categoryParentId;
      seoDescription.value = data.seoDescription;
      seoKeywords.value = data.seoKeywords;
    }
    const categoryDatas = await getDocs(collection(db, "category"));

    // 1. 데이터 정제
    const rawList = categoryDatas.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. 정렬 및 트리 구성
    const buildTree = (items, parentId = "", depth = 0) => {
      return items
        .filter(
          (item) =>
            item.categoryParentId === parentId && item.categoryGrade === depth
        )
        .sort((a, b) => a.categoryOrder - b.categoryOrder)
        .map((item) => ({
          ...item,
          children: buildTree(items, item.id, depth + 1),
        }));
    };

    // 3. 트리 -> 평탄화 (트리뷰 UI용)
    const flattenTree = (nodes, depth = 0) => {
      return nodes.flatMap((node) => {
        const { children, ...rest } = node;
        const current = { ...rest, depth };
        const childItems = children ? flattenTree(children, depth + 1) : [];
        return [current, ...childItems];
      });
    };

    const tree = buildTree(rawList);
    const flattened = flattenTree(tree);

    // 4. 결과 할당
    categoryOriginData.value = flattened;
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
});
</script>

<style scoped lang="scss">
.admin-product-add {
  margin-top: 36px;

  > .add-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;

    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;

      > h4 {
        width: 160px;
        border-right: 1px solid rgba(0, 0, 0, 0.25);
      }

      > input,
      textarea,
      select {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        background-color: #efefef;
        font-size: 14px;

        ::placeholder {
          color: rgba(0, 0, 0, 0.6);
        }

        &:focus {
          outline: 2px solid #007bff;
        }
      }

      > span {
        font-size: 14px;
      }

      > div {
        flex: 1;
        > input,
        textarea,
        select {
          width: 100%;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          background-color: #efefef;
          font-size: 14px;

          ::placeholder {
            color: rgba(0, 0, 0, 0.6);
          }

          &:focus {
            outline: 2px solid #007bff;
          }
        }

        > div {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 8px;

          > button {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            background-color: #007bff;
            color: #fff;
            font-size: 14px;
            cursor: pointer;

            &:hover {
              background-color: #0069d9;
            }

            &:disabled {
              cursor: not-allowed;
              background-color: #efefef;
              color: rgba($color: #000000, $alpha: 0.5);
            }
          }
        }
      }
    }
  }

  > .button-box {
    margin-top: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;

    > button {
      border-radius: 4px;
      padding: 12px 24px;
      background-color: #007bff;
      border: none;
      color: #fff;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;

      &.red {
        background-color: #dc3546;
      }
    }
  }
}
</style>
