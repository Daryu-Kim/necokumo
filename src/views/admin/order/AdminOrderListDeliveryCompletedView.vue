<template>
  <div class="admin-product-list">
    <h2>배송완료 관리하기</h2>
    <div class="table-box">
      <h3>배송완료 목록 테이블</h3>
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
  getDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateOrderStatusLabel } from "@/lib/utils";

const tableRef = ref(null);
const dataTable = ref(null);
const originData = ref([]);

onMounted(async () => {
  // 1. Firebase에서 데이터 가져오기
  const q = query(
    collection(db, "productOrder"),
    where("status", "==", "DELIVERY_COMPLETED"),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  // 2. 문서들을 배열로 변환
  originData.value = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  for (const order of originData.value) {
    const userRef = await getDoc(doc(db, "users", order.userId));
    let userData = null;
    if (userRef.exists()) {
      const tempData = userRef.data();
      tempData.id = userRef.id;
      userData = tempData;
    }

    order.userData = userData;
  }

  const data = originData.value.map((item) => {
    return [
      {
        content: item.orderChannel,
        editable: false,
      },
      {
        content: item.orderId,
        editable: false,
      },
      {
        content: item.productOrderId,
        editable: false,
      },
      {
        content: item.userData,
        editable: false,
      },
      {
        content: item.productName,
        editable: false,
      },
      {
        content: item.optionName,
        editable: false,
      },
      {
        content: item,
        editable: false,
      },
      {
        content: item.currency,
        editable: false,
      },
      {
        content: item,
        editable: false,
      },
      {
        content: item.createdAt.toDate().toLocaleString(),
        editable: false,
      },
    ];
  });

  // 3. frappe-datatable 생성
  dataTable.value = new DataTable(tableRef.value, {
    columns: [
      {
        name: "쇼핑몰",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
        format: (value) => {
          switch (value) {
            case "NECOKUMO":
              return "폐쇄몰";
            case "CAFE24":
              return "카페24";
            default:
              return "알 수 없음";
          }
        },
      },
      {
        name: "주문번호",
        editable: false,
        resizable: false,
        width: 224,
        align: "center",
      },
      {
        name: "상품 주문번호",
        editable: false,
        resizable: false,
        width: 256,
        align: "center",
        format: (value) => {
          return `<a style="color: #007bff; font-weight: 700" href="${window.location.origin}/admin/order/detail?id=${value}">${value}</a>`;
        },
      },
      {
        name: "주문자",
        editable: false,
        resizable: false,
        width: 160,
        align: "center",
        format: (value) => {
          return `<a style="color: #007bff; font-weight: 700" href="${window.location.origin}/admin/consumer/detail?id=${value.id}">${value.userName} <span style="font-weight: 400; color: black">(${value.userId})</span></a>`;
        },
      },
      {
        name: "상품명",
        editable: false,
        resizable: false,
        width: 192,
        align: "center",
      },
      {
        name: "옵션",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "실결제금액",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
        format: (value) => {
          return `${value.productPrice.toLocaleString()}원`;
        },
      },
      {
        name: "결제수단",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
        format: (value) => {
          if (value == "KRW") {
            return "무통장입금";
          } else {
            return "신용/체크카드";
          }
        },
      },
      {
        name: "결제상태",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
        format: (value) => {
          if (value.claimStatus !== "") {
            return generateOrderStatusLabel(value.claimStatus);
          } else {
            return generateOrderStatusLabel(value.status);
          }
        },
      },
      {
        name: "주문일",
        editable: false,
        resizable: false,
        width: 192,
        align: "center",
      },
    ],
    data: data,
    checkboxColumn: true,
    serialNoColumn: false,
    cellHeight: 64,
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
