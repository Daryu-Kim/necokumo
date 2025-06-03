<template>
  <div class="admin-product-list">
    <h2>카테고리 관리하기</h2>
    <div class="button-box">
      <router-link to="/admin/product/category/detail" class="blue">
        카테고리 추가하기
      </router-link>
    </div>
    <div class="table-box">
      <h3>상품 목록 테이블</h3>
      <div ref="tableRef"></div>
    </div>
    <dialog ref="dialogRef">
      <header></header>
      <main>
        <div>
          <h3>ekdldjffhrm</h3>
        </div>
      </main>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "frappe-datatable/dist/frappe-datatable.min.css";
import DataTable from "frappe-datatable";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const tableRef = ref(null);
const dataTable = ref(null);
const dialogRef = ref(null);

onMounted(async () => {
  // 1. Firebase에서 카테고리 가져오기
  const snapshot = await getDocs(collection(db, "category"));
  const categories = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // 2. Map 생성 및 초기화
  const map = new Map();
  const roots = [];

  categories.forEach((item) => {
    item.children = [];
    map.set(item.categoryId, item);
  });

  // 3. 부모-자식 연결
  categories.forEach((item) => {
    if (item.categoryParentId) {
      const parent = map.get(item.categoryParentId);
      if (parent) {
        parent.children.push(item);
      } else {
        roots.push(item);
      }
    } else {
      roots.push(item);
    }
  });

  // 4. 정렬 함수 (categoryOrder 기준)
  function sortTree(nodes) {
    nodes.sort((a, b) => a.categoryOrder - b.categoryOrder);
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        sortTree(node.children);
      }
    });
  }

  sortTree(roots);

  // 5. 트리 평탄화 + 들여쓰기 적용
  const flattened = [];

  function flatten(nodes, depth = 0, parentId = null) {
    nodes.forEach((node) => {
      flattened.push({
        ID: node.categoryId,
        카테고리명: `${"-".repeat(depth)} ${node.categoryName}`,
        "SEO 제목": node.seoTitle,
        "SEO 설명": node.seoDescription,
        "SEO 키워드": node.seoKeywords,
        indent: depth,
        parent: parentId,
      });
      if (node.children.length > 0) {
        flatten(node.children, depth + 1, node.categoryId);
      }
    });
  }

  flatten(roots);

  // 6. DataTable 생성
  dataTable.value = new DataTable(tableRef.value, {
    columns: [
      {
        name: "ID",
        editable: false,
        resizable: false,
        align: "center",
        width: 72,
        format: (value) => {
          return `<a style="font-weight: 700; color: #007bff;" href="/admin/product/category/detail?id=${value}">${value}</a>`;
        },
      },
      {
        name: "카테고리명",
        editable: false,
        resizable: false,
        width: 192,
        align: "left",
      },
      {
        name: "SEO 제목",
        editable: false,
        resizable: false,
        width: 192,
        align: "center",
      },
      {
        name: "SEO 설명",
        editable: false,
        resizable: false,
        width: 256,
        align: "center",
      },
      {
        name: "SEO 키워드",
        editable: false,
        resizable: false,
        width: 256,
        align: "center",
      },
    ],
    data: flattened,
    treeView: true,
    cellHeight: 48,
    serialNoColumn: false,
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

    > a {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      font-size: 14px;
      background-color: #007bff;
      color: white;

      &:hover {
        background-color: #0056b3;
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
