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
      <div>
        <h4>PC 배너 이미지</h4>
        <input
          type="file"
          accept="image/*"
          @change="(e) => (categoryPcImageFile.value = e.target.files[0])"
        />
      </div>
      <div>
        <h4>모바일 배너 이미지</h4>
        <input
          type="file"
          accept="image/*"
          @change="(e) => (categoryMobileImageFile.value = e.target.files[0])"
        />
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
import { db, storage } from "@/lib/firebase";
import router from "@/router";
import { useRoute } from "vue-router";
import { getDownloadURL, uploadBytes } from "firebase/storage";

const route = useRoute();

const isBusy = ref(false);
const categoryOriginData = ref([]);

const categoryId = ref("");
const categoryName = ref("");
const categoryParentId = ref("");

const categoryPcImageFile = ref(null);
const categoryMobileImageFile = ref(null);

const conditionCategoryAdd = computed(() => {
  return categoryId.value && categoryName.value;
});

async function uploadCategoryImage(file, type, categoryId) {
  try {
    if (!file) return "";

    const fileRef = ref(
      storage,
      `category/${categoryId}/${type}-${Date.now()}.jpg`
    );

    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error uploading category image: ", error);
    throw error;
  }
}

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

    // 🔥 이미지 업로드 처리 (필요할 때만 업로드)
    let pcImageUrl = "";
    let mobileImageUrl = "";

    if (categoryPcImageFile.value) {
      pcImageUrl = await uploadCategoryImage(
        categoryPcImageFile.value,
        "pc",
        categoryId.value
      );
    } else if (isExistCategory.exists()) {
      pcImageUrl = isExistCategory.data().categoryPcImage || "";
    }

    if (categoryMobileImageFile.value) {
      mobileImageUrl = await uploadCategoryImage(
        categoryMobileImageFile.value,
        "mobile",
        categoryId.value
      );
    } else if (isExistCategory.exists()) {
      mobileImageUrl = isExistCategory.data().categoryMobileImage || "";
    }

    const categoryData = {
      categoryId: categoryId.value.toString(),
      categoryName: categoryName.value,
      categoryParentId: categoryParentId.value,
      categoryOrder: categoryOrder,
      categoryGrade: categoryGrade,
      categoryProductCount: 0,
      categoryPcImage: pcImageUrl,
      categoryMobileImage: mobileImageUrl,
    };

    console.log("categoryData", categoryData);

    await setDoc(
      doc(db, "category", categoryId.value.toString()),
      categoryData,
      { merge: true }
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
