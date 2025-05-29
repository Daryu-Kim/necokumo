<template>
  <div class="admin-product-list">
    <h2>카테고리 관리하기</h2>
    <div class="button-box">
      <button @click="recoveryProduct" class="blue" :disabled="isBusy">
        삭제 상품 복구하기
      </button>
    </div>
    <div class="table-box">
      <h3>상품 목록 테이블</h3>
      <div ref="tableRef"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
import { db } from "@/lib/firebase";

const tableRef = ref(null);
const dataTable = ref(null);
const isBusy = ref(false);
const originData = ref([]);

const recoveryProduct = async () => {
  try {
    isBusy.value = true;
    const checkedItems = await getCheckedItems();
    if (!checkedItems.length) {
      console.log("No items selected to sell on Cafe24.");
      alert("상품이 선택되지 않았습니다!");
      isBusy.value = false;
      return;
    }

    if (confirm("선택한 상품을 복구하시겠습니까?")) {
      await Promise.all(
        checkedItems.map(async (item) => {
          try {
            await updateDoc(doc(db, "product", item.productId), {
              isActive: true,
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
    alert("상품이 복구되었습니다!");
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
    where("isActive", "==", false),
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
        content: item.productThumbnailUrl.smallUrl,
        editable: false,
      },
      {
        content: `<a href="${window.location.origin}/admin/product/edit?id=${doc.id}">${item.productName}</a>`,
        editable: false,
      },
      {
        content: {
          cafe24: item.isSellCafe24,
          youtube: item.isSellYoutube,
          vue: item.isSellVue,
        },
        editable: false,
        format: (value) => {
          console.log(value);
          const labels = {
            cafe24: "카페24",
            youtube: "유튜브",
            vue: "Vue",
          };

          const lines = Object.keys(labels).map((key) => {
            console.log(value[key]);
            return `${labels[key]}: <span style="font-weight: 700;color: ${
              value[key] === true ? "#007bff" : "#dc3545"
            }">${value[key] === true ? "판매함" : "판매중지"}</span>`;
          });
          return `<p>${lines.join("<br/>")}</p>`;
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
        width: 320,
        align: "center",
        format: (value) => {
          return `<p style="color: #007bff;">${value}</p>`;
        },
      },
      {
        name: "판매 채널",
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
        width: 256,
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
}
</style>
