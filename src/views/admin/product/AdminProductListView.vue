<template>
  <div class="admin-product-list">
    <h2>상품 목록보기</h2>
    <div class="button-box">
      <button @click="createItems" class="blue" :disabled="isBusy">
        상품 등록
      </button>
      <button @click="deleteSelectedItems" class="red" :disabled="isBusy">
        삭제
      </button>
      <button class="blue" @click="uploadProducts" :disabled="isBusy">
        카페24 업로드하기
      </button>
      <button @click="triggerProductMatch" class="blue" :disabled="isBusy">
        카페24 상품 매칭하기
      </button>
      <input
        type="file"
        ref="productMatchRef"
        accept=".csv"
        @change="handleProductMatchFileChange"
        style="display: none"
      />
      <button
        @click="triggerProductOptionMatch"
        class="blue"
        :disabled="isBusy"
      >
        카페24 상품 옵션 매칭하기
      </button>
      <input
        type="file"
        ref="productOptionMatchRef"
        accept=".csv"
        @change="handleProductOptionMatchFileChange"
        style="display: none"
      />
      <button @click="unsetSellCafe24" class="secondary" :disabled="isBusy">
        카페24 판매금지 처리
      </button>
      <button @click="setSellCafe24" class="secondary" :disabled="isBusy">
        카페24 판매금지 해제
      </button>
      <button @click="openImportDialog" :disabled="isBusy">
        엑셀 자동화 툴
      </button>
    </div>
    <div class="table-box">
      <h3>상품 목록 테이블</h3>
      <div ref="tableRef"></div>
    </div>
    <dialog ref="dialogRef">
      <header>
        <h2>엑셀 자동화 툴</h2>
        <button @click="closeImportDialog">
          <span class="material-icons-round">close</span>
        </button>
      </header>
      <main>
        <textarea v-model="importHtmlText"></textarea>
        <div class="button-box">
          <button @click="convertHtmlToTable('medusa_liquid')">
            메두사 액상
          </button>
        </div>
      </main>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import "frappe-datatable/dist/frappe-datatable.min.css";
import DataTable from "frappe-datatable";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import {
  uploadProduct,
  matchProductByCode,
  matchProductOptionsByCode,
} from "@/lib/cafe24";
import { db } from "@/lib/firebase";

const router = useRouter();

const productMatchRef = ref(null);
const productOptionMatchRef = ref(null);
const tableRef = ref(null);
const dataTable = ref(null);
const isBusy = ref(false);
const originData = ref([]);
const dialogRef = ref(null);
const importHtmlText = ref("");

const openImportDialog = () => {
  importHtmlText.value = "";
  dialogRef.value.showModal();
};

const closeImportDialog = () => {
  dialogRef.value.close();
};

const convertHtmlToTable = (url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(importHtmlText.value, "text/html");
  let convertDatas = "";
  switch (url) {
    case "medusa_liquid": {
      const items = doc.querySelectorAll(".item.DB_rate.xans-record-");
      console.log(items);
      items.forEach((item) => {
        const itemName = item
          .querySelector("div.description > p.name > a > span:nth-child(2)")
          .textContent.split("(")[0]
          .replace("기성액상", "입호흡 액상")
          .replace("모드액상", "폐호흡 액상")
          .trim();
        const consumerPrice = item
          .querySelector("div.description > ul > li:nth-child(1) > span")
          .textContent.replaceAll("원", "")
          .replaceAll(",", "")
          .trim();
        const sellingPrice = item
          .querySelector(
            "div.description > ul > li:nth-child(2) > span:nth-child(2)"
          )
          .textContent.replaceAll("원", "")
          .replaceAll(",", "")
          .trim();
        convertDatas += `${itemName}\t\t${consumerPrice}\t${sellingPrice}\n`;
      });
      navigator.clipboard.writeText(convertDatas).then(() => {
        alert("데이터가 클립보드에 복사되었습니다!");
      });
      break;
    }

    default:
      break;
  }
};

const createItems = () => {
  router.push("/admin/product/add");
};

const triggerProductMatch = () => {
  productMatchRef.value.click();
};

const triggerProductOptionMatch = () => {
  productOptionMatchRef.value.click();
};

const handleProductMatchFileChange = async (event) => {
  try {
    const file = event.target.files[0];
    isBusy.value = true;
    if (file && file.type === "text/csv") {
      await matchProductByCode(file); // 원하는 함수로 전달
      isBusy.value = false;
      alert("상품 매칭이 완료되었습니다!");
      window.location.reload();
    } else {
      alert("CSV 파일만 업로드해주세요.");
      isBusy.value = false;
    }
  } catch (error) {
    console.error("Error matching product by code:", error);
    isBusy.value = false;
  }
};

const handleProductOptionMatchFileChange = async (event) => {
  try {
    const file = event.target.files[0];
    isBusy.value = true;
    if (file && file.type === "text/csv") {
      await matchProductOptionsByCode(file); // 원하는 함수로 전달
      isBusy.value = false;
      alert("상품 옵션 매칭이 완료되었습니다!");
      window.location.reload();
    } else {
      alert("CSV 파일만 업로드해주세요.");
      isBusy.value = false;
    }
  } catch (error) {
    console.error("Error matching product options by code:", error);
    isBusy.value = false;
  }
};

const uploadProducts = async () => {
  try {
    isBusy.value = true;
    await uploadProduct();
    isBusy.value = false;
    console.log("Selected items deleted successfully.");
  } catch (error) {
    console.error("Error deleting selected items:", error);
    isBusy.value = false;
  }
};

const deleteSelectedItems = async () => {
  try {
    isBusy.value = true;
    const checkedItems = await getCheckedItems();
    if (!checkedItems.length) {
      console.log("No items selected to delete.");
      alert("상품이 선택되지 않았습니다!");
      isBusy.value = false;
      return;
    }

    if (confirm("선택한 상품을 삭제하시겠습니까?")) {
      await Promise.all(
        checkedItems.map(async (item) => {
          try {
            await updateDoc(doc(db, "product", item.productId), {
              isSellCafe24: false,
              isSellYoutube: false,
              isSellVue: false,
              isActive: false,
              updatedAt: Timestamp.fromDate(new Date()),
            });
          } catch (error) {
            console.error(`Error updating item ${item.productId}:`, error);
          }
        })
      );
    } else {
      isBusy.value = false;
      return;
    }
    alert("상품이 삭제되었습니다!");
    isBusy.value = false;
    window.location.reload();
    console.log("Selected items deleted successfully.");
  } catch (error) {
    console.error("Error deleting selected items:", error);
    isBusy.value = false;
  }
};

const setSellCafe24 = async () => {
  try {
    isBusy.value = true;
    const checkedItems = await getCheckedItems();
    if (!checkedItems.length) {
      console.log("No items selected to sell on Cafe24.");
      alert("상품이 선택되지 않았습니다!");
      isBusy.value = false;
      return;
    }

    if (confirm("선택한 상품을 Cafe24 판매중으로 설정하시겠습니까?")) {
      await Promise.all(
        checkedItems.map(async (item) => {
          try {
            await updateDoc(doc(db, "product", item.productId), {
              isSellCafe24: true,
              updatedAt: Timestamp.fromDate(new Date()),
            });
          } catch (error) {
            console.error(`Error updating item ${item.productId}:`, error);
          }
        })
      );
    } else {
      isBusy.value = false;
      return;
    }
    alert("상품이 Cafe24 판매중으로 설정되었습니다!");
    isBusy.value = false;
    window.location.reload();
  } catch (error) {
    console.error("Error selling selected items on Cafe24:", error);
    isBusy.value = false;
  }
};

const unsetSellCafe24 = async () => {
  try {
    isBusy.value = true;
    const checkedItems = await getCheckedItems();
    if (!checkedItems.length) {
      console.log("No items selected to sell on Cafe24.");
      alert("상품이 선택되지 않았습니다!");
      isBusy.value = false;
      return;
    }

    if (confirm("선택한 상품을 Cafe24 판매중지로 설정하시겠습니까?")) {
      await Promise.all(
        checkedItems.map(async (item) => {
          try {
            await updateDoc(doc(db, "product", item.productId), {
              isSellCafe24: false,
              updatedAt: Timestamp.fromDate(new Date()),
            });
          } catch (error) {
            console.error(`Error updating item ${item.productId}:`, error);
          }
        })
      );
    } else {
      isBusy.value = false;
      return;
    }
    alert("상품이 Cafe24 판매중지로 설정되었습니다!");
    isBusy.value = false;
    window.location.reload();
  } catch (error) {
    console.error("Error selling selected items on Cafe24:", error);
    isBusy.value = false;
  }
};

const getCheckedItems = () => {
  try {
    isBusy.value = true;
    const checkedItems = dataTable.value?.rowmanager.getCheckedRows() || [];
    const returnItems = [];
    checkedItems.forEach((item) => {
      const i = Number(item);
      returnItems.push(originData.value[i]);
      console.log("Checked item:", originData.value[i]);
    });
    isBusy.value = false;
    return returnItems;
  } catch (error) {
    console.error("Error getting checked items:", error);
    isBusy.value = false;
  }
};

onMounted(async () => {
  // 1. Firebase에서 데이터 가져오기
  const q = query(
    collection(db, "product"),
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  // 2. 문서들을 배열로 변환
  originData.value = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  console.log(originData.value);
  const data = querySnapshot.docs.map((doc) => {
    const item = doc.data();
    return [
      {
        content: item.productThumbnailUrl.originalUrl,
        editable: false,
      },
      {
        content: `<a href="${window.location.origin}/admin/product/edit?id=${doc.id}">${item.productName}</a>`,
        editable: false,
      },
      {
        content: item.isSellCafe24,
        editable: false,
        format: (value) => {
          if (value) {
            return "<p style='font-size: 24px'>❌</p>";
          } else {
            return "<p style='font-size: 24px'>✅</p>";
          }
        },
      },
      {
        content: item.productSellPrice,
        editable: false,
        format: (value) => {
          return `${value.toLocaleString()}원`;
        },
      },
      {
        content: item.productBuyPrice,
        editable: false,
        format: (value) => {
          return `${value.toLocaleString()}원`;
        },
      },
      {
        content: item.productBuyDeliveryPrice,
        editable: false,
        format: (value) => {
          return `${value.toLocaleString()}원`;
        },
      },
      {
        content: item.optionList,
        editable: false,
        format: (value) => {
          console.log(value);
          const lines = value.map(
            (o) => `${o.optionName} | ${o.optionPrice.toLocaleString()}원`
          );
          return `<p>${lines.join("<br/>")}</p>`;
        },
      },
      item.createdAt?.toDate().toLocaleString() || "",
      item.updatedAt?.toDate().toLocaleString() || "",
      item.updatedAt.toDate().getTime() !==
      item.updatedAtCafe24.toDate().getTime()
        ? "<span style='color: #007bff; font-weight: 700;'>변동사항 있음</span>"
        : "<span style='color: #ff0000; font-weight: 700;'>변동사항 없음</span>",
    ];
  });

  // 3. frappe-datatable 생성
  dataTable.value = new DataTable(tableRef.value, {
    columns: [
      {
        name: "상품 이미지",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
        format: (value) => {
          return `<img src="${value}" style="width: 112px; height: 112px: object-fit: cover; object-position: center center;" />`;
        },
      },
      {
        name: "상품명",
        editable: false,
        resizable: false,
        width: 192,
        align: "center",
        format: (value) => {
          return `<p style="color: #007bff;">${value}</p>`;
        },
      },
      {
        name: "판매금지 여부",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "판매가",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
      },
      {
        name: "매입가",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
      },
      {
        name: "매입운송비",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
      },
      {
        name: "옵션",
        editable: false,
        resizable: false,
        width: 280,
        align: "center",
      },
      {
        name: "등록일",
        editable: false,
        resizable: false,
        width: 192,
        align: "center",
      },
      {
        name: "수정일",
        editable: false,
        resizable: false,
        width: 192,
        align: "center",
      },
      {
        name: "상품 변동사항",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
    ],
    data: data,
    checkboxColumn: true,
    serialNoColumn: false,
    cellHeight: 128,
    inlineFilters: true,
  });
});
</script>

<style scoped lang="scss">
.admin-product-list {
  margin-top: 36px;

  > .button-box {
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    > button {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      font-size: 14px;

      &.red {
        background-color: #dc3545;
        color: white;

        &:hover {
          background-color: #c82333;
        }
      }

      &.blue {
        background-color: #007bff;
        color: white;

        &:hover {
          background-color: #0056b3;
        }
      }

      &.secondary {
        background-color: #6c757d;
        color: white;

        &:hover {
          background-color: #545b62;
        }
      }
    }
  }

  > .table-box {
    margin-top: 24px;
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;

    > div {
      margin-top: 16px;
      width: 100%;
      height: fit-content;
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
      padding: 16px;
      > textarea {
        width: 100%;
        height: 300px;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
      }

      button {
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        background-color: #007bff;
        color: #fff;
        font-weight: 500;
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
}
</style>
