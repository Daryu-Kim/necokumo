<template>
  <div class="admin-product-list">
    <h2>회원 정보 조회하기</h2>
    <div class="button-box">
      <button @click="router.push('/admin/consumer/add')" :disabled="isBusy">
        회원 정보 등록하기
      </button>
      <button @click="syncConsumerGrade" :disabled="isBusy">
        회원 등급 동기화하기
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
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { convertPriceToUserGradeCode, formatDate } from "@/lib/utils";
import router from "@/router";

const tableRef = ref(null);
const dataTable = ref(null);
const isBusy = ref(false);
const originData = ref([]);

const gradeOrder = [
  "N1",
  "N2",
  "N3",
  "N4",
  "N5",
  "N6",
  "N7",
  "N8",
  "N9",
  "N10",
]; // 필요하면 확장 가능

const normalizeGrade = (grade, minGrade) => {
  return gradeOrder.indexOf(grade) < gradeOrder.indexOf(minGrade)
    ? minGrade
    : grade;
};

const getSyncDateRange = (currentDate = new Date()) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // 3개월 전 1일
  let startMonth = month - 3;
  let startYear = year;
  if (startMonth <= 0) {
    startMonth += 12;
    startYear -= 1;
  }
  const start = new Date(startYear, startMonth - 1, 1);

  // 직전 달 말일
  let endMonth = month - 1;
  let endYear = year;
  if (endMonth <= 0) {
    endMonth += 12;
    endYear -= 1;
  }
  const end = new Date(endYear, endMonth, 0);

  return {
    start: Timestamp.fromDate(start),
    end: Timestamp.fromDate(end),
    periodLabel: `${startYear}년 ${startMonth}월 ~ ${endYear}년 ${endMonth}월`,
  };
};

const syncConsumerGrade = async () => {
  try {
    const currentDate = new Date();
    const { start, end, periodLabel } = getSyncDateRange(currentDate);

    if (!confirm(`${periodLabel} 기준으로 등급 동기화를 진행하시겠습니까?`)) {
      return;
    }

    isBusy.value = true;

    const USERS = await getDocs(collection(db, "users"));
    const batch = writeBatch(db);

    for (const userDoc of USERS.docs) {
      const userData = userDoc.data();

      // 구매 확정된 주문(3개월 기준 데이터)
      const productOrders = await getDocs(
        query(
          collection(db, "productOrder"),
          where("userId", "==", userData.userId),
          where("status", "==", "CONFIRM_PURCHASE"),
          where("createdAt", ">=", start),
          where("createdAt", "<=", end)
        )
      );

      // 총 구매금액 계산
      const totalPrice = productOrders.docs.reduce(
        (acc, doc) => acc + Number(doc.data().productPrice || 0),
        0
      );

      // 새 등급 계산
      const calculatedGrade = convertPriceToUserGradeCode(totalPrice);

      // userMinGrade 보정 적용
      const finalGrade = normalizeGrade(calculatedGrade, userData.userMinGrade);

      // 변경 필요할 때만 업데이트
      if (finalGrade !== userData.userGrade) {
        batch.update(userDoc.ref, {
          userGrade: finalGrade,
        });
      }
    }

    // 저장
    await batch.commit();

    alert("회원 등급 동기화가 완료되었습니다!");
    isBusy.value = false;
    window.location.reload();
  } catch (error) {
    console.error("Error syncing consumer grade:", error);
    alert("회원 등급 동기화에 실패하였습니다!");
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
        content: `<a href="${window.location.origin}/admin/consumer/detail?id=${doc.id}" style="color: #007bff; font-weight: 700">${item.userPhone}</a>`,
        editable: false,
      },
      {
        content: item.userName,
        editable: false,
      },
      {
        content: item.userBirthday,
        editable: false,
      },
      {
        content: item.userMinGrade,
        editable: false,
      },
      {
        content: item.userGrade,
        editable: false,
      },
      {
        content: item.isAdmin ? "관리자" : "일반 회원",
        editable: false,
      },
      {
        content: item.userSalespersonCode,
        editable: false,
      },
      {
        content: formatDate(item.visitedAt.toDate()),
        editable: false,
      },
      {
        content: formatDate(item.createdAt.toDate()),
        editable: false,
      },
    ];
  });

  // 3. frappe-datatable 생성
  dataTable.value = new DataTable(tableRef.value, {
    columns: [
      {
        name: "휴대폰 번호",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "이름",
        editable: false,
        resizable: false,
        width: 72,
        align: "center",
      },
      {
        name: "생일",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "최소 회원 등급",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "현재 회원 등급",
        editable: false,
        resizable: false,
        width: 128,
        align: "center",
      },
      {
        name: "관리자 여부",
        editable: false,
        resizable: false,
        width: 96,
        align: "center",
      },
      {
        name: "영업자 코드",
        editable: false,
        resizable: false,
        width: 112,
        align: "center",
      },
      {
        name: "마지막 방문일자",
        editable: false,
        resizable: false,
        width: 180,
        align: "center",
      },
      {
        name: "가입일자",
        editable: false,
        resizable: false,
        width: 180,
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
