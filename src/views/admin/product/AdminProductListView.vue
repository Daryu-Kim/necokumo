<template>
  <div class="admin-product-list">
    <h2>상품 목록보기</h2>
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

const tableRef = ref(null);

onMounted(async () => {
  // 1. Firebase에서 데이터 가져오기
  const q = query(collection(db, "product"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  // 2. 문서들을 배열로 변환
  const data = querySnapshot.docs.map((doc) => {
    const item = doc.data();
    return [
      {
        content: `<a href="${window.location.origin}/admin/product/edit?id=${doc.id}">${item.productName}</a>`,
        editable: false,
      },
      {
        content: item.productSellPrice,
        editable: false,
        format: (value) => {
          return `${value.toLocaleString()}원`;
        },
      },
      item.createdAt?.toDate().toLocaleString() || "",
    ];
  });

  // 3. frappe-datatable 생성
  new DataTable(tableRef.value, {
    columns: [
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
        name: "소비자가",
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
    ],
    data: data,
    checkboxColumn: true,
    inlineFilters: true,
  });
});
</script>

<style scoped lang="scss">
.admin-product-list {
  margin-top: 36px;

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
