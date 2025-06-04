<template>
  <div class="admin-product-add">
    <h2>상품 등록하기</h2>
    <div class="channel-box">
      <h3>판매 채널</h3>
      <div>
        <div>
          <input id="cafe24" type="checkbox" v-model="isSellCafe24" />
          <label for="cafe24">카페24</label>
        </div>
        <div>
          <input id="youtube" type="checkbox" v-model="isSellYoutube" />
          <label for="youtube">유튜브</label>
        </div>
        <div>
          <input id="vue" type="checkbox" v-model="isSellVue" />
          <label for="vue">Vue.js</label>
        </div>
      </div>
    </div>
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
        <div>
          <input
            type="text"
            v-model="productSummary"
            placeholder="예시) 발라리안을 잡으려고 긱베이프가 작정했다!"
          />
          <div>
            <button @click="generateProductSummary" :disabled="isBusy">
              자동 완성
            </button>
          </div>
        </div>
      </div>
      <div>
        <h4>상품 검색 키워드</h4>
        <div>
          <input
            type="text"
            v-model="productSearchKeyword"
            placeholder="검색어는 콤마로 구분, 검색어 당 최대 125자까지 입력 가능"
          />
          <div>
            <button @click="generateProductSearchKeyword" :disabled="isBusy">
              자동 완성
            </button>
          </div>
        </div>
      </div>
      <div>
        <h4>상품 상세설명</h4>
        <div>
          <textarea
            type="text"
            v-model="productDetail"
            rows="10"
            placeholder="예시) <img src='https://picsum.photos/600' style='width: 100%;' />"
          ></textarea>
          <div>
            <button @click="crawlProduct('medusa')" :disabled="isBusy">
              메두사
            </button>
            <button
              @click="openDialog"
              :disabled="productDetailImages.length === 0"
            >
              미리보기
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="add-box">
      <h3>판매 정보</h3>
      <div>
        <h4>판매가</h4>
        <input
          type="number"
          v-model="productSellPrice"
          placeholder="예시) 19,800"
        />
        <span>원</span>
      </div>
      <div>
        <h4>매입가</h4>
        <input
          type="number"
          v-model="productBuyPrice"
          placeholder="예시) 9,900"
        />
        <span>원</span>
      </div>
      <div>
        <h4>매입 운송비</h4>
        <input
          type="number"
          v-model="productBuyDeliveryPrice"
          placeholder="예시) 3,000"
        />
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
                :disabled="isBusy"
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
                :disabled="isBusy"
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
                :disabled="isBusy"
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
          @compositionstart="isComposingOption1 = true"
          @compositionend="isComposingOption1 = false"
          v-model="option1Text"
        />
        <div>
          <button
            v-for="(item, index) in option1List"
            :key="index"
            :value="item"
            @click="deleteOption1"
            :disabled="isBusy"
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
          @compositionstart="isComposingOption2 = true"
          @compositionend="isComposingOption2 = false"
        />
        <div>
          <button
            v-for="(item, index) in option2List"
            :key="index"
            :value="item"
            @click="deleteOption2"
            :disabled="isBusy"
          >
            {{ item }}
            <span class="material-icons-round">close</span>
          </button>
        </div>
      </div>
      <button @click="addOptionList" :disabled="isBusy">
        모든 옵션 품목추가
      </button>
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
        <h4>썸네일 URL</h4>
        <input
          type="text"
          v-model="productThumbnail"
          placeholder="예시) https://picsum.photos/200"
        />
      </div>
    </div>
    <div class="button-box">
      <button @click="addProduct" :disabled="isBusy">상품 등록하기</button>
    </div>
    <dialog ref="dialogRef">
      <header>
        <h2>상품 상세이미지 미리보기</h2>
        <button @click="closeDialog">
          <span class="material-icons-round">close</span>
        </button>
      </header>
      <main>
        <img
          v-for="(image, index) in productDetailImages"
          :key="index"
          :src="image"
        />
      </main>
    </dialog>
  </div>
</template>

<script setup>
import {
  getDocs,
  collection,
  where,
  query,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { onMounted, ref, computed } from "vue";
import { db, auth } from "@/lib/firebase";
import { generateUUIDFromSeed } from "@/lib/utils";
import { uploadImageByUrl } from "@/lib/imgbb";
import { useDeepseek } from "@/lib/openrouter";
import router from "@/router";

const isBusy = ref(false);

const isSellCafe24 = ref(false);
const isSellYoutube = ref(false);
const isSellVue = ref(false);

const productName = ref("");
const productSummary = ref("");
const productSearchKeyword = ref("");
const productDetail = ref("");
const productSellPrice = ref(0);
const productBuyPrice = ref(0);
const productBuyDeliveryPrice = ref(0);
const dialogRef = ref(null);

const category0List = ref([]);
const category1List = ref([]);
const category2List = ref([]);

const category0Select = ref(null);
const category1Select = ref(null);
const category2Select = ref(null);

const productDetailImages = ref([]);

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

const isComposingOption1 = ref(false);
const isComposingOption2 = ref(false);

const option1List = ref([]);
const option2List = ref([]);

const optionList = ref([]);

const productThumbnail = ref("");

const conditionProductAdd = computed(() => {
  return (
    productName.value &&
    typeof productName.value === "string" &&
    productSummary.value &&
    productDetailImages.value.length > 0 &&
    productSellPrice.value > 0 &&
    productBuyPrice.value > 0 &&
    productBuyDeliveryPrice.value > 0 &&
    category0Select.value &&
    optionList.value.length > 0 &&
    productThumbnail.value
  );
});

const changeCategory0 = async () => {
  try {
    isBusy.value = true;
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
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const changeCategory1 = async () => {
  try {
    isBusy.value = true;
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
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const insertOption1 = async () => {
  try {
    if (!isComposingOption1.value) {
      isBusy.value = true;
      optionList.value = [];
      const option = option1Text.value;
      option1List.value = [...option1List.value, option];
      option1Text.value = "";
      isBusy.value = false;
    }
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const insertOption2 = async () => {
  try {
    if (!isComposingOption2.value) {
      isBusy.value = true;
      optionList.value = [];
      const option = option2Text.value;
      option2List.value = [...option2List.value, option];
      option2Text.value = "";
      isBusy.value = false;
    }
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const deleteOption1 = (element) => {
  try {
    isBusy.value = true;
    optionList.value = [];
    option1List.value = option1List.value.filter(
      (item) => item !== element.target.value
    );
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const deleteOption2 = (element) => {
  try {
    isBusy.value = true;
    optionList.value = [];
    option2List.value = option2List.value.filter(
      (item) => item !== element.target.value
    );
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const addOptionList = async () => {
  try {
    isBusy.value = true;
    optionList.value = [];
    option1List.value.forEach((option1) => {
      option2List.value.forEach((option2) => {
        optionList.value.push({
          optionName: `${option1}/${option2}`,
          optionPrice: 0,
        });
      });
    });
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const crawlProduct = async (buyer) => {
  try {
    isBusy.value = true;
    const parser = new DOMParser();
    const doc = parser.parseFromString(productDetail.value, "text/html");

    const images = doc.querySelectorAll("img");
    productDetailImages.value = Array.from(images).map((img) => {
      let replaceUrl = "";
      switch (buyer) {
        case "medusa":
          replaceUrl = "https://medusamall.com";
          break;
        default:
          replaceUrl = "";
          break;
      }

      return img.src.replace(window.location.origin, replaceUrl);
    });

    console.log(productDetailImages.value);
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const openDialog = () => {
  dialogRef.value.showModal();
};

const closeDialog = () => {
  dialogRef.value.close();
};

const generateProductSummary = async () => {
  try {
    isBusy.value = true;
    const prompt = `"${productName.value}" 이 문자열을 인터넷에 검색해서 나온 정확한 정보들을 바탕으로 다른 불필요한 대답 없이(상품 요약설명, 정리, 대답 필요없음, 보충설명 필요없음. 쓸데없는 말 부조건 제외.) 특장점을 바탕으로 소비자가 알기 쉽고 구매욕구가 들게 50글자 내의 1문장으로 마케팅 제안 문구만 간결하게 딱 말해줘. api로 content 받아낼거라 그냥 output만 내주면돼.`;
    const data = await useDeepseek(prompt);
    productSummary.value = data.choices[0].message.content.replaceAll(/"/g, "");
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const generateProductSearchKeyword = async () => {
  try {
    isBusy.value = true;
    const prompt = `"${productName.value}" 이 문자열을 인터넷에 검색해서 나온 정확한 정보들을 바탕으로 불필요한 상품 요약설명, 정리, 대답 필요없으니까 전부 제외하고 소비자가 알기 쉽고 구매욕구가 들게 SEO에 노출 잘되게 50개의 키워드를 콤마로 연결하고 띄어쓰기를 모두 없애서 딱 말해줘. 무조건 키워드의 총합은 50을 넘어가면 안되고, 50개의 키워드 중에서 무조건 "네코쿠모", "네코쿠모전자담배", "네코쿠모전담", "냥이네구름가게", "냥이네구름가게전자담배", "냥이네구름가게전담" 키워드들은 무조건 들어가야해.`;
    const data = await useDeepseek(prompt);
    productSearchKeyword.value = data.choices[0].message.content.replaceAll(
      /"/g,
      ""
    );
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

const addProduct = async () => {
  try {
    isBusy.value = true;
    if (!conditionProductAdd.value) {
      alert("모든 항목을 채워주세요.");
      isBusy.value = false;
      return;
    }

    const uuid = await generateUUIDFromSeed(productName.value);
    console.log(uuid);

    const thumbnailURL = await uploadImageByUrl(productThumbnail.value);

    const detailImageURL = await Promise.all(
      Array.from(productDetailImages.value).map(async (item) => {
        const data = await uploadImageByUrl(item);
        return {
          imageOriginUrl: data?.data?.image?.url || "",
          imageDeleteUrl: data?.data?.delete_url || "",
        };
      })
    );

    const category = [
      category0Select.value?.categoryId,
      category1Select.value?.categoryId,
      category2Select.value?.categoryId,
    ].filter((id) => id != null);

    const productData = {
      productId: uuid,
      productName: productName.value,
      productSummary: productSummary.value,
      productSearchKeyword: productSearchKeyword.value,
      productSellPrice: productSellPrice.value,
      productBuyPrice: productBuyPrice.value,
      productBuyDeliveryPrice: productBuyDeliveryPrice.value,
      productCategory: category,
      option1List: option1List.value,
      option2List: option2List.value,
      optionList: optionList.value,
      productThumbnailUrl: {
        originalUrl: thumbnailURL?.data?.image?.url || "",
        smallUrl: thumbnailURL?.data?.thumb?.url || "",
        deleteUrl: thumbnailURL?.data?.delete_url || "",
      },
      productDetailUrl: detailImageURL,
      createdBy: auth.currentUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      isSellCafe24: isSellCafe24.value,
      isSellYoutube: isSellYoutube.value,
      isSellVue: isSellVue.value,
      isActive: true,
    };

    await setDoc(doc(db, "product", uuid), productData);
    alert("상품이 성공적으로 등록되었습니다.");
    isBusy.value = false;
    router.push("/admin/product/list");
  } catch (error) {
    console.error("Error adding product:", error);
    isBusy.value = false;
  }
};

onMounted(async () => {
  try {
    isBusy.value = true;
    const categoryDatas = await getDocs(
      query(collection(db, "category"), where("categoryGrade", "==", 0))
    );
    category0List.value = categoryDatas.docs.map((doc) => doc.data());
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

  > .channel-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;

    > div {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-top: 16px;

      > div {
        display: flex;
        align-items: center;
        gap: 6px;

        > input[type="checkbox"] {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

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
        textarea {
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
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;

      > h4 {
        width: 160px;
        border-right: 1px solid rgba(0, 0, 0, 0.25);
      }

      > input {
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

  > dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 8px;
    width: 90%;
    height: 90%;
    max-width: 600px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);

    &::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    > header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      position: sticky;
      top: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);
      background: #efefef;

      > h2 {
        font-size: 18px;
      }

      > button {
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        background-color: #007bff;
        color: #fff;
        font-weight: 700;
        cursor: pointer;

        > span {
          font-size: 16px;
        }
      }
    }

    > main {
      > img {
        width: 100%;
      }
    }
  }
}
</style>
