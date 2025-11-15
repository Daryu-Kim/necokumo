<template>
  <div class="admin-product-add">
    <h2>{{ route.query.id ? "상품 수정하기" : "상품 등록하기" }}</h2>
    <div class="channel-box">
      <h3>판매 채널</h3>
      <div>
        <div>
          <input id="cafe24" type="checkbox" checked v-model="isSellOnline" />
          <label for="cafe24">카페24</label>
        </div>
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
    <div class="add-box">
      <h3>엑셀 정보</h3>
      <div>
        <h4>엑셀 복사 내용</h4>
        <div>
          <input type="text" v-model="excelContent" />
          <div>
            <button @click="generateExcelContent" :disabled="isBusy">
              자동 완성
            </button>
          </div>
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
        <h4>상품 상세설명</h4>
        <div>
          <textarea
            type="text"
            v-model="productDetail"
            rows="10"
            placeholder="예시) <img src='https://picsum.photos/600' style='width: 100%;' />"
          ></textarea>
          <div style="display: grid; grid-template-columns: repeat(6, 1fr)">
            <button @click="crawlProduct('medusa')" :disabled="isBusy">
              메두사
            </button>
            <button @click="crawlProduct('vapetopia')" :disabled="isBusy">
              베이프토피아
            </button>
            <button @click="crawlProduct('purecloud')" :disabled="isBusy">
              퓨어클라우드
            </button>
            <button @click="crawlProduct('vapecompany')" :disabled="isBusy">
              베이프컴퍼니
            </button>
            <button @click="crawlProduct('0vape')" :disabled="isBusy">
              영베이프
            </button>
            <button @click="crawlProduct('emvape')" :disabled="isBusy">
              이엠베이프
            </button>
            <button @click="crawlProduct('siasiu')" :disabled="isBusy">
              샤슈베이프
            </button>
            <button @click="crawlProduct('vanom')" :disabled="isBusy">
              베놈
            </button>
            <button @click="crawlProduct('cigarman')" :disabled="isBusy">
              시가맨
            </button>
            <button @click="crawlProduct('bluemong')" :disabled="isBusy">
              블루몽
            </button>
            <button @click="crawlProduct('airvaper')" :disabled="isBusy">
              에어베이퍼
            </button>
            <button @click="crawlProduct('beba')" :disabled="isBusy">
              베이프바스켓
            </button>
            <button @click="crawlProduct('boomboom')" :disabled="isBusy">
              붐붐리퀴드
            </button>
            <button @click="crawlProduct('uwell')" :disabled="isBusy">
              용트림
            </button>
            <button @click="crawlProduct('cigapong')" :disabled="isBusy">
              시가퐁
            </button>
            <button @click="crawlProduct('manual')" :disabled="isBusy">
              수동
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
    <div class="option-box">
      <h3>옵션 / 재고 설정</h3>
      <div>
        <h4>옵션1</h4>
        <input
          type="text"
          placeholder="콤마(,)로 구분 (색상, 맛 등 1차 옵션)"
          @input="resetOption"
          @compositionstart="isComposingOption1 = true"
          @compositionend="isComposingOption1 = false"
          v-model="option1Text"
        />
      </div>
      <div>
        <h4>옵션2</h4>
        <input
          type="text"
          placeholder="콤마(,)로 구분 (수량 등 2차 옵션)"
          @input="resetOption"
          v-model="option2Text"
          @compositionstart="isComposingOption2 = true"
          @compositionend="isComposingOption2 = false"
        />
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
    <div class="add-box">
      <h3>선택 정보</h3>
      <div>
        <h4>상품 검색 키워드</h4>
        <div>
          <input
            type="text"
            v-model="productNameKeywords"
            placeholder="검색어는 콤마로 구분, 검색어 당 최대 125자까지 입력 가능"
          />
          <div>
            <button @click="generateProductNameKeywords" :disabled="isBusy">
              자동 완성
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="button-box">
      <button @click="addProduct" :disabled="isBusy">
        {{ route.query.id ? "상품 수정하기" : "상품 등록하기" }}
      </button>
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
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { onMounted, ref, computed } from "vue";
import { db, auth } from "@/lib/firebase";
import { generateUUIDFromSeed } from "@/lib/utils";
import { uploadImageByUrl } from "@/lib/imgbb";
import { useDeepseek } from "@/lib/openrouter";
import router from "@/router";
import { useRoute } from "vue-router";

const isBusy = ref(false);

const productOriginData = ref({});
const route = useRoute();

const isSellOnline = ref(true);

const excelContent = ref("");
const productName = ref("");
const productNameKeywords = ref("");
const productDetail = ref("");
const productSellPrice = ref(0);
const productBuyPrice = ref(0);
const productBuyDeliveryPrice = ref(3000);
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
    productSellPrice.value > 0 &&
    productBuyPrice.value > 0 &&
    productBuyDeliveryPrice.value > 0 &&
    category0Select.value &&
    optionList.value.length > 0 &&
    productThumbnail.value
  );
});

const resetOption = () => {
  option1List.value = [];
  option2List.value = [];
  optionList.value = [];
};

const generateExcelContent = () => {
  const data = excelContent.value.split(",");
  productName.value = data[0];
  option1Text.value = data[0];
  productSellPrice.value = parseInt(data[1]);
  productBuyPrice.value = parseInt(data[2]);
};

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

const addOptionList = async () => {
  try {
    isBusy.value = true;
    optionList.value = [];
    option1List.value = option1Text.value.split(",");
    option2List.value = option2Text.value.split(",");
    option1List.value.forEach((option1) => {
      option2List.value.forEach((option2) => {
        optionList.value.push({
          optionName: `${option1}/${option2}`,
          optionPrice: 0,
          optionStock: 0,
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

    let thumbnailImage = null;
    let detailImages = [];
    let options = [];

    let replaceUrl = "";
    switch (buyer) {
      case "medusa":
        replaceUrl = "https://medusamall.com";
        thumbnailImage = doc.querySelector("#big_img_box > div > img");
        detailImages = doc.querySelectorAll("#prdDetail > div.cont img");
        options = doc.querySelectorAll(
          "table.xans-element-.xans-product.xans-product-option.xans-record- optgroup > option"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll(
            "table.xans-element-.xans-product.xans-product-option.xans-record- option"
          );
        }
        break;
      case "vapetopia":
        replaceUrl = "";
        thumbnailImage = doc.querySelector(
          "#contents > div.xans-element-.xans-product.xans-product-detail.section > div.detailArea > div.xans-element-.xans-product.xans-product-image.imgArea > div.RW > div.prdImg > div > a > img"
        );
        detailImages = doc.querySelectorAll("#prdDetail img");
        options = doc.querySelectorAll(
          "table.xans-element-.xans-product.xans-product-option.xans-record- optgroup > option"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll(
            "table.xans-element-.xans-product.xans-product-option.xans-record- option"
          );
        }
        break;
      case "purecloud":
        replaceUrl = "";
        thumbnailImage = doc.querySelector("#sit_pvi_big > a > img");
        detailImages = doc.querySelectorAll("#sit_inf_explan img");
        options = doc.querySelectorAll("#it_option_1 option");
        if (options.length == 0) {
          options = doc.querySelectorAll("#it_option_1 > option");
        }
        break;
      case "vapecompany":
        replaceUrl = "https://vapecompany.co.kr";
        thumbnailImage = doc.querySelector(
          "#contents > div.xans-element-.xans-product.xans-product-detail.section > div.detailArea > div.xans-element-.xans-product.xans-product-image.imgArea > div.RW > div.prdImg > div > a > img"
        );
        detailImages = doc.querySelectorAll(
          "#prdDetail > div:nth-child(1) > div img"
        );
        if (detailImages.length == 0) {
          detailImages = doc.querySelectorAll("#prdDetail > div img");
        }
        options = doc.querySelectorAll(
          "table.xans-element-.xans-product.xans-product-option.xans-record- optgroup > option"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll(
            "table.xans-element-.xans-product.xans-product-option.xans-record- option"
          );
        }
        break;
      case "0vape":
        replaceUrl = "";
        thumbnailImage = doc.querySelector(
          "#shopProductImgsMainDiv > div.shopProductImgMainWrapper.type_thumbnails.sequence_0.on > div"
        );
        detailImages = doc.querySelectorAll("div.productDetailSection img");
        options = doc.querySelectorAll(
          "#shopProductContentInfo > div.shopProductOptionListDiv.row.selectOptions.designSettingElement.text-body > div.productOption.custom-select-wrapper > div > div > div.custom-select-box-list-inner > div > div"
        );
        break;
      case "emvape":
        replaceUrl = "";
        thumbnailImage = doc.querySelector(
          "#contents > div.xans-element-.xans-product.xans-product-detail.section > div.detailArea > div.xans-element-.xans-product.xans-product-image.imgArea > div.RW > div.prdImg > div > a > img"
        );
        detailImages = doc.querySelectorAll("#prdDetail img");
        options = doc.querySelectorAll(
          "table.xans-element-.xans-product.xans-product-option.xans-record- optgroup > option"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll(
            "table.xans-element-.xans-product.xans-product-option.xans-record- option"
          );
        }
        break;
      case "siasiu":
        replaceUrl = "";
        thumbnailImage = doc.querySelector("div.thumb-item__main-img > img");
        detailImages = doc.querySelectorAll("#PRODUCT_DETAIL img");
        options = doc.querySelectorAll("div.select optgroup option");
        if (options.length == 0) {
          options = doc.querySelectorAll("div.select option");
        }
        break;
      case "vanom":
        replaceUrl = "";
        thumbnailImage = doc.querySelector("img.ThumbImage");
        detailImages = doc.querySelectorAll("#prdDetail img");
        options = doc.querySelectorAll(
          "#M_mode > div.in > table optgroup option"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll("#M_mode > div.in > table option");
        }
        break;
      case "cigarman":
        replaceUrl = "https://cigarman.co.kr/";
        thumbnailImage = doc.querySelector("img.ThumbImage");
        detailImages = doc.querySelectorAll("#prdDetail > div.cont img");
        options = doc.querySelectorAll(
          "table.xans-element-.xans-product.xans-product-option.xans-record- optgroup > option"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll(
            "table.xans-element-.xans-product.xans-product-option.xans-record- option"
          );
        }
        break;
      case "bluemong":
        replaceUrl = "https://blumongvape.com";
        thumbnailImage = doc.querySelector("#prdDetailImg > img");
        detailImages = doc.querySelectorAll("#prdDetail img");
        options = doc.querySelectorAll(
          "#product_option_id1 > optgroup > option"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll("#product_option_id1 > option");
        }
        break;
      case "airvaper":
        replaceUrl = "https://airvaper.com";
        thumbnailImage = doc.querySelector("#contents .thumbnail img");
        detailImages = doc.querySelectorAll("#prdDetail > div.cont img");
        options = doc.querySelectorAll(
          "#product_option_id1 > optgroup > option"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll("#product_option_id1 > option");
        }
        break;
      case "beba":
        replaceUrl = "";
        thumbnailImage = doc.querySelector("#mainImage > img");
        detailImages = doc.querySelectorAll(
          "#detail > div.detail_cont > div img"
        );
        options = doc.querySelectorAll(
          "#frmView > div > div > div.item_detail_list > div > dl > dd > select > optgroup > option"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll(
            "#frmView > div > div > div.item_detail_list > div > dl > dd > select > option"
          );
        }
        break;
      case "boomboom":
        replaceUrl = "https://boomboomliquid.com";
        thumbnailImage = doc.querySelector(
          "#contents > div.xans-element-.xans-product.xans-product-detail > div.detailArea > div.xans-element-.xans-product.xans-product-image.imgArea > div.keyImg > div > a > img"
        );
        detailImages = doc.querySelectorAll("#prdDetail > div > div img");
        options = doc.querySelectorAll(
          "#product_option_id1 > optgroup > option"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll("#product_option_id1 > option");
        }
        break;
      case "uwell":
        replaceUrl = "https://boomboomliquid.com";
        thumbnailImage = doc.querySelector(
          "#content > div > div._2-I30XS1lA > div._3rXou9cfw2 > div.bd_23RhM.bd_2Yw8f > div.bd_1uFKu.bd_2PG3r > img"
        );
        detailImages = doc.querySelectorAll(
          "#INTRODUCE div.se-main-container img"
        );
        options = doc.querySelectorAll(
          "#content > div > div._2-I30XS1lA > div._2QCa6wHHPy > fieldset > div.bd_2dy3Y > div > ul > li > a"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll(
            "#content > div > div._2-I30XS1lA > div._2QCa6wHHPy > fieldset > div.bd_2dy3Y > div > ul > li > a"
          );
        }
        break;
      case "cigapong":
        replaceUrl = "https://boomboomliquid.com";
        thumbnailImage = doc.querySelector(
          "#content > div > div._2-I30XS1lA > div._3rXou9cfw2._3SDVmcn7nN > div.bd_23RhM.bd_2Yw8f > div.bd_1uFKu > img"
        );
        detailImages = doc.querySelectorAll(
          "#INTRODUCE div.se-main-container img"
        );
        options = doc.querySelectorAll(
          "#content > div > div._2-I30XS1lA > div._2QCa6wHHPy > fieldset > div.bd_2dy3Y > div > ul > li > a"
        );
        if (options.length == 0) {
          options = doc.querySelectorAll(
            "#content > div > div._2-I30XS1lA > div._2QCa6wHHPy > fieldset > div.bd_2dy3Y > div > ul > li > a"
          );
        }
        break;
      case "manual":
        replaceUrl = "";
        detailImages = doc.querySelectorAll("img");
        break;
      default:
        replaceUrl = "";
        break;
    }

    switch (buyer) {
      case "0vape": {
        console.log(thumbnailImage);
        const backgroundImage = thumbnailImage.style.backgroundImage;
        productThumbnail.value = backgroundImage.match(
          /url\(["']?(.*?)["']?\)/
        )[1];
        break;
      }
      case "manual": {
        productThumbnail.value = "";
        break;
      }
      default: {
        productThumbnail.value = thumbnailImage.src.replace(
          window.location.origin,
          replaceUrl
        );
        break;
      }
    }

    productDetailImages.value = Array.from(detailImages).map((img) => {
      switch (buyer) {
        case "vapecompany":
          img.getAttribute("ec-data-src")
            ? (img.src = replaceUrl + img.getAttribute("ec-data-src"))
            : "";
          break;
        case "0vape":
          img.getAttribute("data-src")
            ? (img.src = replaceUrl + img.getAttribute("data-src"))
            : "";
          break;
        default:
          break;
      }
      return img.src.replace(window.location.origin, replaceUrl);
    });

    option1Text.value = productName.value;
    option2Text.value = Array.from(options)
      .filter((opt) => {
        if (opt.value === "" || opt.value === "*" || opt.value === "**")
          return false;

        let text = opt.textContent.replace("[품절]", "").trim();

        if (text.includes("[")) return false;
        if (text.includes("제조")) return false;

        return true;
      })
      .map((opt) => {
        let text = opt.textContent;

        // [품절] 제거
        text = text.replace("[품절]", "").trim();

        // (…원) 패턴을 임시 치환
        const pricePatterns = [];
        text = text.replace(/\(-?\d{1,3}(,\d{3})*원\)/g, (match) => {
          pricePatterns.push(match);
          return `__PRICE${pricePatterns.length - 1}__`;
        });

        // 나머지 괄호 및 괄호 안 내용 제거
        text = text.replace(/\([^()]*\)/g, "");

        // 가격 패턴 복원
        pricePatterns.forEach((price, idx) => {
          const placeholder = `__PRICE${idx}__`;
          text = text.replace(placeholder, price);
        });

        // 남은 공백 정리
        return text.trim();
      })
      .join(",");
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

const generateProductNameKeywords = async () => {
  try {
    if (!category1Select.value) {
      alert("카테고리를 선택하세요.");
      return;
    }
    isBusy.value = true;
    const prompt = `"${productName.value}${
      category2Select.value ? " " + category2Select.value.categoryName : ""
    }${
      category1Select.value ? " " + category1Select.value.categoryName : ""
    }}" 이 문자열을 인터넷에 검색해서 나온 정확한 정보들을 바탕으로 불필요한 상품 요약설명, 정리, 대답 필요없으니까 전부 제외하고 소비자가 알기 쉽고 구매욕구가 들게 SEO에 노출 잘되게 50개의 키워드를 콤마로 연결하고 띄어쓰기를 모두 없애서 딱 말해줘. 무조건 키워드의 총합은 50을 넘어가면 안되고, 50개의 키워드 중에서 무조건 "네코쿠모", "네코쿠모전자담배", "네코쿠모전담", "냥이네구름가게", "냥이네구름가게전자담배", "냥이네구름가게전담" 키워드들은 무조건 들어가야해.`;
    const data = await useDeepseek(prompt);
    productNameKeywords.value = data.choices[0].message.content.replaceAll(
      /"/g,
      ""
    );
    isBusy.value = false;
  } catch (error) {
    console.error(error);
    isBusy.value = false;
  }
};

function isDifferentArrays(arr1, arr2) {
  return (
    arr1.length !== arr2.length || arr1.some((url, idx) => url !== arr2[idx])
  );
}

const addProduct = async () => {
  try {
    isBusy.value = true;
    if (!conditionProductAdd.value) {
      alert("모든 항목을 채워주세요.");
      isBusy.value = false;
      return;
    }

    if (route.query.id) {
      // 상품 수정 로직
      const uuid = route.query.id;
      let updateData = {};

      if (isSellOnline.value !== productOriginData.value.isSellOnline) {
        updateData.isSellOnline = isSellOnline.value;
      }

      if (
        category0Select.value?.categoryId !==
          productOriginData.value.productCategory[0] ||
        category1Select.value?.categoryId !==
          productOriginData.value.productCategory[1] ||
        category2Select.value?.categoryId !==
          productOriginData.value.productCategory[2]
      ) {
        updateData.productCategory = [
          category0Select.value?.categoryId,
          category1Select.value?.categoryId,
          category2Select.value?.categoryId,
        ].filter((id) => id != null);
      }

      if (productName.value !== productOriginData.value.productName) {
        updateData.productName = productName.value;
      }

      const originDetailUrls = (productOriginData.value.productDetailUrl || [])
        .map((detail) => detail.imageOriginUrl)
        .filter(Boolean);
      if (isDifferentArrays(productDetailImages.value, originDetailUrls)) {
        const detailImageURL = await Promise.all(
          Array.from(productDetailImages.value).map(async (item, index) => {
            const data = await uploadImageByUrl("detail", item, uuid, index);
            return {
              imageOriginUrl: data?.imageOriginUrl,
            };
          })
        );
        updateData.productDetailUrl = detailImageURL;
        console.log(detailImageURL);
      }

      if (
        isDifferentArrays(
          productOriginData.value.option1List,
          option1List.value
        ) ||
        isDifferentArrays(
          productOriginData.value.option2List,
          option2List.value
        )
      ) {
        updateData.option1List = option1List.value;
        updateData.option2List = option2List.value;
        updateData.optionList = optionList.value;
      }

      const thumbnailURL = await uploadImageByUrl(
        "thumbnail",
        productThumbnail.value,
        uuid,
        0
      );
      if (
        productOriginData.value.productThumbnailUrl.originalUrl !==
        thumbnailURL.originalUrl
      ) {
        updateData.productThumbnailUrl = thumbnailURL;
      }

      const cleanProductName = productName.value
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        .toLowerCase();

      const productNameKeywords = cleanProductName
        .split(" ")
        .map((kw) => kw.trim())
        .filter(Boolean);

      if (
        isDifferentArrays(
          productOriginData.value.productNameKeywords,
          productNameKeywords
        )
      ) {
        updateData.productNameKeywords = [...new Set(productNameKeywords)];
      }

      updateData.updatedAt = Timestamp.fromDate(new Date());

      await updateDoc(doc(db, "product", uuid), updateData);
      alert("상품이 성공적으로 수정되었습니다.");
    } else {
      // 상품 신규 등록 로직
      const uuid = await generateUUIDFromSeed(productName.value);

      const thumbnailURL = await uploadImageByUrl(
        "thumbnail",
        productThumbnail.value,
        uuid,
        0
      );

      const detailImageURL = await Promise.all(
        Array.from(productDetailImages.value).map(async (item, index) => {
          const data = await uploadImageByUrl("detail", item, uuid, index);
          return {
            imageOriginUrl: data?.imageOriginUrl,
          };
        })
      );

      const category = [
        category0Select.value?.categoryId,
        category1Select.value?.categoryId,
        category2Select.value?.categoryId,
      ].filter((id) => id != null);

      const cleanProductName = productName.value
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        .toLowerCase();

      const productNameKeywords = cleanProductName
        .split(" ")
        .map((kw) => kw.trim())
        .filter(Boolean);

      const cleanedOptionList = optionList.value.map((opt, index) => {
        // 🔢 index를 4자리 문자열로 (예: 1 → "0001")
        const paddedIndex = String(index + 1).padStart(4, "0");

        return {
          ...opt,
          optionCode: `${uuid}${paddedIndex}`,
        };
      });

      const productData = {
        productId: uuid,
        productName: productName.value,
        productNameKeywords: [...new Set(productNameKeywords)],
        productSellPrice: productSellPrice.value,
        productBuyPrice: productBuyPrice.value,
        productBuyDeliveryPrice: productBuyDeliveryPrice.value,
        productCategory: category,
        option1List: option1List.value,
        option2List: option2List.value,
        optionList: cleanedOptionList,
        productThumbnailUrl: thumbnailURL,
        productDetailUrl: detailImageURL,
        productLikeCount: 0,
        productViewCount: 0,
        createdBy: auth.currentUser.uid,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        isSellOnline: isSellOnline.value,
        isActive: true,
      };

      await setDoc(doc(db, "product", uuid), productData);
      alert("상품이 성공적으로 등록되었습니다.");
    }
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
    if (route.query.id) {
      const originData = await (
        await getDoc(doc(db, "product", route.query.id))
      ).data();
      productOriginData.value = originData;

      // 데이터 가공
      const detailUrls = (originData.productDetailUrl || [])
        .map((detail) => detail.imageOriginUrl)
        .filter(Boolean); // originUrl이 없는 경우 제외

      // 기존 Product Data 매치
      isSellOnline.value = originData.isSellOnline;

      if (originData.productCategory[0]) {
        const category0Data = (
          await getDoc(doc(db, "category", originData.productCategory[0]))
        ).data();
        category0Select.value = category0Data;
      }

      if (originData.productCategory[1]) {
        const category1Data = (
          await getDoc(doc(db, "category", originData.productCategory[1]))
        ).data();
        category1Select.value = category1Data;
      }

      if (originData.productCategory[2]) {
        const category2Data = (
          await getDoc(doc(db, "category", originData.productCategory[2]))
        ).data();
        category2Select.value = category2Data;
      }

      await changeCategory0();
      await changeCategory1();

      productName.value = originData.productName;

      productDetailImages.value = detailUrls;

      productSellPrice.value = originData.productSellPrice;
      productBuyPrice.value = originData.productBuyPrice;
      productBuyDeliveryPrice.value = originData.productBuyDeliveryPrice;

      option1Text.value = originData.option1List.join(",");
      option2Text.value = originData.option2List.join(",");
      addOptionList();

      productThumbnail.value = originData.productThumbnailUrl.originalUrl;

      productNameKeywords.value = originData.productNameKeywords.join(",");
    }
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
