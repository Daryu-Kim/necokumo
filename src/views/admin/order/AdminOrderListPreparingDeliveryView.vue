<template>
  <div class="admin-product-list">
    <h2>배송준비중 관리하기</h2>
    <div class="button-box">
      <button
        class="blue"
        @click="convertToStatus('PREPARING_DELIVERY', 'SHIPPING_PROGRESS')"
        :disabled="isBusy"
      >
        배송중 처리
      </button>
      <button
        @click="router.push('/admin/order/list/shipping-progress')"
        :disabled="isBusy"
      >
        배송중 페이지 이동
      </button>
    </div>
    <div class="table-box">
      <h3>전체 주문 목록 테이블</h3>
      <div ref="tableRef"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import "frappe-datatable/dist/frappe-datatable.min.css";
import DataTable from "frappe-datatable";
import {
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  deliveryCompanyFormatter,
  generateDeliveryTrackingLinkOrigin,
  generateOrderStatusLabel,
} from "@/lib/utils";
import router from "@/router";

const tableRef = ref(null);
const dataTable = ref(null);
const isBusy = ref(false);
const originData = ref([]);

const convertToStatus = async (before, after) => {
  try {
    isBusy.value = true;
    const checkedItems = await getCheckedItems();

    if (!checkedItems.length) {
      alert("주문 건이 선택되지 않았습니다!");
      isBusy.value = false;
      return;
    }

    const validItems = checkedItems.filter((item) => {
      return item.status === before && !item.claimStatus;
    });

    if (!validItems.length) {
      alert("선택된 주문 중 유효한 항목이 없습니다.");
      isBusy.value = false;
      return;
    }

    if (
      !confirm(`${validItems.length}건의 주문을 '${after}' 처리하시겠습니까?`)
    ) {
      isBusy.value = false;
      return;
    }

    // ✅ 병렬 업데이트 실행
    const promises = validItems
      .map((item) => {
        const docId = item.productOrderId || item.id;
        if (!docId) {
          console.warn("문서 ID 없음:", item);
          return null;
        }
        return updateDoc(doc(db, "productOrder", docId), {
          status: after,
        });
      })
      .filter(Boolean); // null 제거

    await Promise.all(promises); // 병렬로 처리 기다림

    alert(`${validItems.length}건의 주문을 '${after}' 처리하였습니다.`);
    window.location.reload();
  } catch (error) {
    console.error("주문 상태 병렬 처리 중 오류:", error);
    alert("상태 변경 중 오류가 발생했습니다.");
  } finally {
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

const handleSelectChange = async (e) => {
  const orderId = e.target.getAttribute("data-id");
  const value = e.target.value;

  try {
    await updateDoc(doc(db, "productOrder", orderId), {
      deliveryCompany: value,
    });
    console.log(`📦 배송업체 저장됨: ${value}`);
    setupDeliveryTrackingLink(orderId);
  } catch (err) {
    alert("저장 실패");
    console.error(err);
  }
};

const handleInputChange = async (e) => {
  const orderId = e.target.getAttribute("data-id");
  const value = e.target.value;

  try {
    await updateDoc(doc(db, "productOrder", orderId), {
      deliveryTrackingNumber: value,
    });
    console.log(`📦 운송장번호 저장됨: ${value}`);
    setupDeliveryTrackingLink(orderId);
  } catch (err) {
    alert("저장 실패");
    console.error(err);
  }
};

const setupDeliveryTrackingLink = async (orderId) => {
  try {
    const data = (await getDoc(doc(db, "productOrder", orderId))).data();
    const origin = generateDeliveryTrackingLinkOrigin(data.deliveryCompany);
    if (origin.length > 0) {
      const url = `${origin}${data.deliveryTrackingNumber}`;
      await updateDoc(doc(db, "productOrder", orderId), {
        deliveryTrackingLink: url,
      });
      console.log(`📦 배송조회 링크 저장됨: ${url}`);
    }
  } catch (err) {
    alert("저장 실패");
    console.error(err);
  }
};

// 바인딩 함수 정의
function bindDeliverySelects() {
  // 이전 바인딩 제거
  document.querySelectorAll(".delivery-select").forEach((select) => {
    select.removeEventListener("change", handleSelectChange);
    select.addEventListener("change", handleSelectChange);
  });
}

function bindDTNInputs() {
  // 이전 바인딩 제거
  document.querySelectorAll(".delivery-tracking-number").forEach((select) => {
    select.removeEventListener("blur", handleInputChange);
    select.addEventListener("blur", handleInputChange);
  });
}

onMounted(async () => {
  // 1. Firebase에서 데이터 가져오기
  const q = query(
    collection(db, "productOrder"),
    where("status", "==", "PREPARING_DELIVERY"),
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
        content: item.deliveryCompany,
        editable: false,
      },
      {
        content: item.deliveryTrackingNumber,
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
          if (value.currency == "KRW") {
            return `${value.productPrice.toLocaleString()}원`;
          } else {
            return `${value.productPrice.toLocaleString()}$`;
          }
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
        name: "배송업체",
        editable: true,
        resizable: false,
        width: 112,
        align: "center",
        format: deliveryCompanyFormatter,
      },
      {
        name: "운송장번호",
        editable: false,
        resizable: false,
        width: 180,
        align: "center",
        format: (value, row) => {
          const id = row[3].content;
          return `<input type="text" class="delivery-tracking-number" data-id="${id}" value="${value}" />`;
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

watch(
  () => dataTable.value,
  (newTable) => {
    if (!newTable) return;
    nextTick(() => {
      console.log("✅ dataTable 변경 감지됨. 이벤트 재바인딩");
      bindDeliverySelects();
      bindDTNInputs();
    });
  },
  { immediate: true }
);
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
