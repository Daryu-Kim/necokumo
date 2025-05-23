<template>
  <div class="admin-product-add">
    <h2>상품 등록하기</h2>
    <div class="add-box">
      <h3>기본 정보</h3>
      <div>
        <h4>상품명</h4>
        <input
          type="text"
          v-model="productName"
          placeholder="예시) 긱베이프 피크 입호흡 전자담배 기기"
        />
      </div>
      <div>
        <h4>상품 요약설명</h4>
        <input
          type="text"
          v-model="productName"
          placeholder="예시) 발라리안을 잡으려고 긱베이프가 작정했다!"
        />
      </div>
      <div>
        <h4>상품 상세설명</h4>
        <textarea
          type="text"
          v-model="productName"
          rows="10"
          placeholder="예시) <img src='https://picsum.photos/600' style='width: 100%;' />"
        ></textarea>
      </div>
    </div>
    <div class="add-box">
      <h3>판매 정보</h3>
      <div>
        <h4>판매가</h4>
        <input type="number" v-model="productName" placeholder="예시) 19,800" />
        <span>원</span>
      </div>
      <div>
        <h4>매입가</h4>
        <input type="number" v-model="productName" placeholder="예시) 9,900" />
        <span>원</span>
      </div>
      <div>
        <h4>매입 운송비</h4>
        <input type="number" v-model="productName" placeholder="예시) 3,000" />
        <span>원</span>
      </div>
    </div>
    <div class="category-box">
      <h3>카테고리 설정</h3>
      <div>
        <div>
          <h4>대분류</h4>
          <div>
            <div v-for="(item, index) in category0List" :key="index">
              <input
                :value="item"
                :id="item.categoryId"
                type="radio"
                name="0"
                v-model="category0Select"
                @change="changeCategory0"
              />
              <label :for="item.categoryId">{{ item.categoryName }}</label>
            </div>
          </div>
        </div>
        <div>
          <h4>중분류</h4>
          <div>
            <div v-for="(item, index) in category1List" :key="index">
              <input
                :value="item"
                :id="item.categoryId"
                type="radio"
                name="1"
                v-model="category1Select"
                @change="changeCategory1"
              />
              <label :for="item.categoryId">{{ item.categoryName }}</label>
            </div>
          </div>
        </div>
        <div>
          <h4>소분류</h4>
          <div>
            <div v-for="(item, index) in category2List" :key="index">
              <input
                :value="item"
                :id="item.categoryId"
                type="radio"
                name="2"
                v-model="category2Select"
              />
              <label :for="item.categoryId">{{ item.categoryName }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="option-box">
      <h3>옵션 / 재고 설정</h3>
    </div>
    <div class="image-box">
      <h3>이미지 정보</h3>
    </div>
    <div class="button-box">
      <button @click="addProduct">상품 등록하기</button>
    </div>
  </div>
</template>

<script setup>
import { getDocs, collection, where, query } from "firebase/firestore";
import { onMounted, ref } from "vue";
import { db } from "@/lib/firebase";

const category0List = ref([]);
const category1List = ref([]);
const category2List = ref([]);

const category0Select = ref();
const category1Select = ref();
const category2Select = ref();

const changeCategory0 = async () => {
  try {
    console.log(category0Select.value);
    const categoryDatas = await getDocs(
      query(
        collection(db, "category"),
        where("categoryGrade", "==", 1),
        where("categoryParentId", "==", category0Select.value.categoryId)
      )
    );
    category1List.value = categoryDatas.docs.map((doc) => doc.data());
    category2List.value = [];
    console.log(category1List.value);
  } catch (error) {
    console.error(error);
  }
};

const changeCategory1 = async () => {
  try {
    console.log(category1Select.value);
    const categoryDatas = await getDocs(
      query(
        collection(db, "category"),
        where("categoryGrade", "==", 2),
        where("categoryParentId", "==", category1Select.value.categoryId)
      )
    );
    category2List.value = categoryDatas.docs.map((doc) => doc.data());
    console.log(category2List.value);
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  try {
    const categoryDatas = await getDocs(
      query(collection(db, "category"), where("categoryGrade", "==", 0))
    );
    category0List.value = categoryDatas.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(error);
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
      textarea {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        margin-left: 8px;
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
    }
  }

  > .category-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;
    > div {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      margin-top: 16px;
      gap: 16px;

      > div {
        > div {
          border: 1px solid rgba(0, 0, 0, 0.25);
          height: 216px;
          border-radius: 8px;
          overflow-y: scroll;
          margin-top: 8px;
          padding: 8px 12px;

          > div {
            > input {
              display: none;
            }

            > label {
              cursor: pointer;
              font-size: 14px;
            }

            > input:checked + label {
              color: #007bff;
              font-weight: 700;
            }
          }
        }
      }
    }
  }

  > .option-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;
  }

  > .image-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;
  }

  > .button-box {
    margin-top: 36px;
    display: flex;
    align-items: center;
    justify-content: center;

    > button {
      border-radius: 4px;
      padding: 12px 24px;
      background-color: #007bff;
      border: none;
      color: #fff;
      font-weight: 700;
      font-size: 16px;
    }
  }
}
</style>
