<template>
  <div class="admin-product-list">
    <h2>상품 목록보기</h2>
    <div class="button-box">
      <button @click="createItems" class="blue" :disabled="isBusy">
        상품 등록
      </button>
      <button @click="deleteSelectedItems" class="red" :disabled="isBusy">
        상품 삭제
      </button>
      <button @click="recommendSelectedItems(true)" :disabled="isBusy">
        추천 설정
      </button>
      <button @click="recommendSelectedItems(false)" :disabled="isBusy">
        추천 해제
      </button>
      <button @click="syncSearchScore" :disabled="isBusy">
        검색 스코어 갱신
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
import { db } from "@/lib/firebase";

const router = useRouter();
const tableRef = ref(null);
const dataTable = ref(null);
const isBusy = ref(false);
const originData = ref([]);

const createItems = () => {
  router.push("/admin/product/add");
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
              isSellOnline: false,
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

const recommendSelectedItems = async (checked) => {
  try {
    isBusy.value = true;
    const checkedItems = await getCheckedItems();
    if (!checkedItems.length) {
      console.log("No items selected to delete.");
      alert("상품이 선택되지 않았습니다!");
      isBusy.value = false;
      return;
    }

    if (confirm("선택한 상품의 추천 정보를 처리하시겠습니까?")) {
      await Promise.all(
        checkedItems.map(async (item) => {
          try {
            await updateDoc(doc(db, "product", item.productId), {
              isRecommend: checked,
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
    alert("상품이 처리되었습니다!");
    isBusy.value = false;
    window.location.reload();
    console.log("Selected items recommend successfully.");
  } catch (error) {
    console.error("Error deleting recommend items:", error);
    isBusy.value = false;
  }
};

const syncSearchScore = async () => {
  try {
    isBusy.value = true;
    const productDocs = await getDocs(collection(db, "product"));
    productDocs.forEach(async (doc) => {
      try {
        const productData = doc.data();

        const ordersSnap = await getDocs(
          query(
            collection(db, "productOrder"),
            where("productId", "==", productData.productId)
          )
        );
        const purchaseCount = ordersSnap.size;

        const score =
          (productData.productLikeCount || 0) * 5 +
          purchaseCount * 10 +
          (productData.productViewCount || 0) * 2;

        await updateDoc(doc.ref, {
          popularScore: score,
          purchaseCount: purchaseCount,
          updatedAt: Timestamp.fromDate(new Date()),
        });
        console.log(`Search score updated for product ${doc.id}: ${score}`);
      } catch (error) {
        console.error(`Error updating item ${doc.id}:`, error);
      }
    });
    alert("검색 스코어 갱신 성공!");
    isBusy.value = false;
    window.location.reload();
  } catch (error) {
    console.error("Error syncing search score:", error);
    alert("검색 스코어 갱신 실패!");
    isBusy.value = false;
    window.location.reload();
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
        content: `<a href="${window.location.origin}/admin/product/add?id=${doc.id}">${item.productName}</a>`,
        editable: false,
      },
      {
        content: item.viewMinUserGrade,
        editable: false,
      },
      {
        content: item.isRecommend ? "O" : "X",
        editable: false,
      },
      {
        content: item.productOriginPrice,
        editable: false,
        format: (value) => {
          return `${value.toLocaleString()}원`;
        },
      },
      {
        content: item.productBankSellPrice,
        editable: false,
        format: (value) => {
          return `${value.toLocaleString()}원`;
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
            (o) => `${o.optionName} | ${o.optionStock.toLocaleString()}개`
          );
          return `<p>${lines.join("<br/>")}</p>`;
        },
      },
      item.productViewCount.toLocaleString() || "",
      item.productLikeCount.toLocaleString() || "",
      item.purchaseCount.toLocaleString() || "",
      item.popularScore.toLocaleString() || "",
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
        width: 192,
        align: "center",
        format: (value) => {
          return `<p style="color: #007bff;">${value}</p>`;
        },
      },
      {
        name: "최소 구매 등급",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "추천 여부",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
      },
      {
        name: "소비자가",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
      },
      {
        name: "계좌이체가",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
      },
      {
        name: "카드결제가",
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
        name: "조회수",
        editable: false,
        resizable: false,
        width: 72,
        align: "center",
      },
      {
        name: "좋아요수",
        editable: false,
        resizable: false,
        width: 84,
        align: "center",
      },
      {
        name: "구매수",
        editable: false,
        resizable: false,
        width: 72,
        align: "center",
      },
      {
        name: "검색 스코어",
        editable: false,
        resizable: false,
        width: 96,
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
