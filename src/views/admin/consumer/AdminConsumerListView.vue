<template>
  <div class="admin-product-list">
    <h2>회원 정보 조회하기</h2>
    <div class="button-box">
      <button @click="triggerConsumerMatch" class="blue" :disabled="isBusy">
        회원 정보 가져오기
      </button>
      <input
        type="file"
        ref="consumerMatchRef"
        accept=".csv"
        @change="handleConsumerMatchFileChange"
        style="display: none"
      />
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
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { matchConsumerByEmail } from "@/lib/cafe24";

const tableRef = ref(null);
const dataTable = ref(null);
const isBusy = ref(false);
const originData = ref([]);
const consumerMatchRef = ref(null);

const triggerConsumerMatch = () => {
  consumerMatchRef.value.click();
};

const handleConsumerMatchFileChange = async (event) => {
  try {
    const file = event.target.files[0];
    isBusy.value = true;
    if (file && file.type === "text/csv") {
      await matchConsumerByEmail(file); // 원하는 함수로 전달
      isBusy.value = false;
      alert("회원 정보를 불러왔습니다!");
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

onMounted(async () => {
  // 1. Firebase에서 데이터 가져오기
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  // 2. 문서들을 배열로 변환
  originData.value = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  const data = querySnapshot.docs.map((doc) => {
    const item = doc.data();
    return [
      {
        content: `<a href="${window.location.origin}/admin/consumer/detail?id=${doc.id}">${item.userId}</a>`,
        editable: false,
      },
      {
        content: item.userEmail,
        editable: false,
      },
      {
        content: item.userName,
        editable: false,
      },
      {
        content: item.userAge,
        editable: false,
      },
      {
        content: item.userBirthday,
        editable: false,
      },
      {
        content: item.userGender,
        editable: false,
      },
      {
        content: item.userCarrier,
        editable: false,
      },
      {
        content: item.userPhone,
        editable: false,
      },
      {
        content: item.userGrade,
        editable: false,
      },
      {
        content: item.userPostCode,
        editable: false,
      },
      {
        content: item.userAddress1,
        editable: false,
      },
      {
        content: item.userAddress2,
        editable: false,
      },
      {
        content: item.userActualPaymentAmount,
        editable: false,
      },
      {
        content: item.userTotalActualOrderCount,
        editable: false,
      },
      {
        content: item.userAvailablePoint,
        editable: false,
      },
      {
        content: item.userTotalUsedPoint,
        editable: false,
      },
      {
        content: item.userTotalPoint,
        editable: false,
      },
      {
        content: item.userReferralId,
        editable: false,
      },
      {
        content: item.userRefundAccount,
        editable: false,
      },
      {
        content: item.visitedAt,
        editable: false,
      },
      {
        content: item.createdAt,
        editable: false,
      },
    ];
  });

  // 3. frappe-datatable 생성
  dataTable.value = new DataTable(tableRef.value, {
    columns: [
      {
        name: "아이디",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "이메일",
        editable: false,
        resizable: false,
        width: 192,
        align: "center",
      },
      {
        name: "이름",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
      },
      {
        name: "나이",
        editable: false,
        resizable: false,
        width: 72,
        align: "center",
      },
      {
        name: "생년월일",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "성별",
        editable: false,
        resizable: false,
        width: 72,
        align: "center",
      },
      {
        name: "통신사",
        editable: false,
        resizable: false,
        width: 160,
        align: "center",
      },
      {
        name: "전화번호",
        editable: false,
        resizable: false,
        width: 144,
        align: "center",
      },
      {
        name: "회원등급",
        editable: false,
        resizable: false,
        width: 192,
        align: "center",
      },
      {
        name: "우편번호",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "주소1",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "주소2",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "실결제금액",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "총 실주문건",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "사용가능 적립금",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "총 사용 적립금",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "총 적립금",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "추천인 아이디",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "환불계좌 정보",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "최근 접속일",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "회원 가입일",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
    ],
    data: data,
    checkboxColumn: true,
    serialNoColumn: false,
    inlineFilters: true,
    cellHeight: 48,
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
