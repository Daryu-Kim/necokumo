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
      <p>{{ selectedCategory }}</p>
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
      <div>
        <h4>옵션1</h4>
        <input
          type="text"
          placeholder="Enter 키로 구분 (색상, 맛 등 1차 옵션)"
          @keydown.enter="insertOption1"
          v-model="option1Text"
        />
        <div>
          <button
            v-for="(item, index) in option1List"
            :key="index"
            :value="item"
            @click="deleteOption1"
          >
            {{ item }}
            <span class="material-icons-round">close</span>
          </button>
        </div>
      </div>
      <div>
        <h4>옵션2</h4>
        <input
          type="text"
          placeholder="Enter 키로 구분 (수량 등 2차 옵션)"
          @keydown.enter="insertOption2"
          v-model="option2Text"
        />
        <div>
          <button
            v-for="(item, index) in option2List"
            :key="index"
            :value="item"
            @click="deleteOption2"
          >
            {{ item }}
            <span class="material-icons-round">close</span>
          </button>
        </div>
      </div>
      <button @click="addOptionList">모든 옵션 품목추가</button>
      <table v-if="optionList.length > 0">
        <thead>
          <tr>
            <th>No</th>
            <th>품목코드</th>
            <th>품목명</th>
            <th>추가금액</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in optionList" :key="index">
            <td>{{ index + 1 }}</td>
            <td>자동등록</td>
            <td>{{ item.optionName }}</td>
            <td>
              <input type="number" :value="item.optionPrice" />
              <span>원</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="image-box">
      <h3>이미지 정보</h3>
      <div>
        <div>
          <div :style="`background-image: url(${productThumbnail})`"></div>
          <input
            type="file"
            accept="image/*"
            @change="uploadImages"
            id="thumbnail"
          />
          <label for="thumbnail">
            <span class="material-icons-round">add</span>
            <p>등록</p>
          </label>
        </div>
        <p>- 권장 이미지: 500px * 500px / 5mb 이하 / gif, png, jpg(jpeg)</p>
      </div>
    </div>
    <div class="button-box">
      <button @click="addProduct">상품 등록하기</button>
    </div>
  </div>
</template>

<script setup>
import { getDocs, collection, where, query } from "firebase/firestore";
import { onMounted, ref, computed } from "vue";
import { db } from "@/lib/firebase";

const productName = ref("");
const productSummary = ref("");
const productDetail = ref("");
const productSellPrice = ref(0);
const productBuyPrice = ref(0);
const productBuyDeliveryPrice = ref(0);

const category0List = ref([]);
const category1List = ref([]);
const category2List = ref([]);

const category0Select = ref();
const category1Select = ref();
const category2Select = ref();

const selectedCategory = computed(() => {
  if (category0Select.value && category1Select.value && category2Select.value) {
    return `선택한 카테고리: ${category0Select.value.categoryName} > ${category1Select.value.categoryName} > ${category2Select.value.categoryName}`;
  } else if (category0Select.value && category1Select.value) {
    return `선택한 카테고리: ${category0Select.value.categoryName} > ${category1Select.value.categoryName}`;
  } else if (category0Select.value) {
    return `선택한 카테고리: ${category0Select.value.categoryName}`;
  } else {
    return "";
  }
});

const option1Text = ref("");
const option2Text = ref("");

const option1List = ref([]);
const option2List = ref([]);

const optionList = ref([]);

const productThumbnail = ref(null);

const conditionProductAdd = computed(() => {
  return (
    productName.value &&
    productSummary.value &&
    productDetail.value &&
    productSellPrice.value > 0 &&
    productBuyPrice.value > 0 &&
    productBuyDeliveryPrice.value > 0 &&
    category0Select.value &&
    option1List.value.length > 0 &&
    option2List.value.length > 0 &&
    productThumbnail.value
  );
});

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

const insertOption1 = async () => {
  try {
    optionList.value = [];
    const option = option1Text.value;
    option1List.value = [...option1List.value, option];
    option1Text.value = "";
  } catch (error) {
    console.error(error);
  }
};

const insertOption2 = async () => {
  try {
    optionList.value = [];
    const option = option2Text.value;
    option2List.value = [...option2List.value, option];
    option2Text.value = "";
  } catch (error) {
    console.error(error);
  }
};

const deleteOption1 = (element) => {
  try {
    optionList.value = [];
    option1List.value = option1List.value.filter(
      (item) => item !== element.target.value
    );
  } catch (error) {
    console.error(error);
  }
};

const deleteOption2 = (element) => {
  try {
    optionList.value = [];
    option2List.value = option2List.value.filter(
      (item) => item !== element.value
    );
  } catch (error) {
    console.error(error);
  }
};

const addOptionList = async () => {
  try {
    optionList.value = [];
    option1List.value.forEach((option1) => {
      option2List.value.forEach((option2) => {
        optionList.value.push({
          optionName: `${option1}/${option2}`,
          optionPrice: 0,
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const uploadImages = async (event) => {
  try {
    const file = event.target.files[0];
    productThumbnail.value = URL.createObjectURL(file);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const addProduct = async () => {
  try {
    if (!conditionProductAdd.value) {
      alert("모든 항목을 채워주세요.");
      return;
    }
    const productData = {
      productName: productName.value,
      productSummary: productSummary.value,
      productDetail: productDetail.value,
      productSellPrice: productSellPrice.value,
      productBuyPrice: productBuyPrice.value,
      productBuyDeliveryPrice: productBuyDeliveryPrice.value,
      categoryId: category0Select.value.categoryId,
      optionList: optionList.value,
      productThumbnail: productThumbnail.value,
    };

    await collection(db, "product").add(productData);
    console.log("Product added!");
  } catch (error) {
    console.error("Error adding product:", error);
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

    > p {
      margin-top: 16px;
      font-size: 14px;
      font-weight: 700;
      color: #007bff;
    }

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

    > div {
      > h4 {
        margin-top: 16px;
      }

      > input {
        width: 100%;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        background-color: #efefef;
        margin-top: 8px;
        font-size: 14px;

        ::placeholder {
          color: rgba(0, 0, 0, 0.6);
        }

        &:focus {
          outline: 2px solid #007bff;
        }
      }

      > div {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;

        > button {
          padding: 4px 12px;
          border: none;
          border-radius: 100px;
          background-color: #007bff;
          color: #fff;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;

          > span {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }

    > table,
    th,
    td {
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-collapse: collapse;
    }

    > table {
      width: 100%;
      margin-top: 16px;
      display: table;

      > thead {
        background-color: #efefef;
        > tr {
          display: flex;
          > th {
            padding: 8px;
            font-weight: 700;
            font-size: 14px;
          }

          > th:nth-child(1) {
            width: 52px;
          }
          > th:nth-child(2) {
            width: 96px;
          }
          > th:nth-child(4) {
            width: 180px;
          }

          > th:nth-child(3) {
            flex: 1;
          }
        }
      }

      > tbody {
        > tr {
          display: flex;
          align-items: center;
          > td {
            text-align: center;
            padding: 8px;
            font-size: 14px;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          > td:nth-child(1) {
            width: 52px;
          }
          > td:nth-child(2) {
            width: 96px;
          }
          > td:nth-child(4) {
            width: 180px;
            > input {
              width: 100%;
              padding: 8px 12px;
              border: none;
              border-radius: 4px;
              background-color: #efefef;
              font-size: 14px;
              width: 96px;

              &:focus {
                outline: 2px solid #007bff;
              }
            }

            > span {
              font-weight: 700;
              margin-left: 8px;
            }
          }

          > td:nth-child(3) {
            flex: 1;
          }
        }
      }
    }

    > button {
      margin-top: 16px;
      border-radius: 4px;
      padding: 8px 16px;
      background-color: #007bff;
      border: none;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
    }
  }

  > .image-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;

    > div {
      margin-top: 16px;
      display: flex;
      gap: 16px;
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
        > div {
          width: 128px;
          height: 128px;
          background-color: #efefef;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        > input[type="file"] {
          display: none;
        }

        > label {
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.25);
          width: fit-content;
          padding: 2px 8px 2px 4px;
          margin-top: 8px;
        }
      }

      > p {
        font-size: 14px;
      }
    }
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
      cursor: pointer;
    }
  }
}
</style>
