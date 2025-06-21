import { createRouter, createWebHistory } from "vue-router";
import { auth, db } from "../lib/firebase";
import AdminMainView from "../views/admin/AdminMainView.vue";
import LoginView from "@/views/LoginView.vue";
import { doc, getDoc } from "firebase/firestore";
import AdminProductDashboardView from "@/views/admin/product/AdminProductDashboardView.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AdminProductAddView from "@/views/admin/product/AdminProductAddView.vue";
import AdminProductListView from "@/views/admin/product/AdminProductListView.vue";
import AdminProductDeletedListView from "@/views/admin/product/AdminProductDeletedListView.vue";
import AdminProductCategoryView from "@/views/admin/product/AdminProductCategoryView.vue";
import AdminProductCategoryDetailView from "@/views/admin/product/AdminProductCategoryDetailView .vue";
import ConsumerHomeView from "@/views/consumer/ConsumerHomeView.vue";
import ConsumerLayout from "@/layouts/ConsumerLayout.vue";
import ConsumerProductList from "@/views/consumer/ConsumerProductList.vue";
import JoinView from "@/views/JoinView.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: ConsumerLayout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "consumer-home",
        component: ConsumerHomeView,
      },
      {
        path: "/login",
        name: "login",
        component: LoginView,
      },
      {
        path: "/join",
        name: "join",
        component: JoinView,
      },
      {
        path: "list",
        name: "consumer-product-list",
        component: ConsumerProductList,
      },
    ],
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminLayout,
    redirect: "/admin/dashboard",
    meta: { requiresAuthAdmin: true },
    children: [
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: AdminMainView,
      },
      {
        path: "product",
        name: "admin-product",
        redirect: "/admin/product/dashboard",
        children: [
          {
            path: "dashboard",
            name: "admin-product-dashboard",
            component: AdminProductDashboardView,
          },
          {
            path: "list",
            name: "admin-product-list",
            component: AdminProductListView,
          },
          {
            path: "add",
            name: "admin-product-add",
            component: AdminProductAddView,
          },
          {
            path: "category",
            name: "admin-product-category",
            component: AdminProductCategoryView,
          },
          {
            path: "category/detail",
            name: "admin-product-category-detail",
            component: AdminProductCategoryDetailView,
          },
          {
            path: "deleted-list",
            name: "admin-product-deleted-list",
            component: AdminProductDeletedListView,
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuthAdmin)) {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe(); // Unsubscribe the listener immediately after getting the result
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "managers", user.uid));
          if (userDoc.exists()) {
            next();
          } else {
            console.warn(`No document found for user ID: ${user.uid}`);
            alert("관리자만 접근할 수 있습니다.");
            next({ path: "/" });
          }
        } catch (error) {
          alert("관리자만 접근할 수 있습니다.");
          next({ path: "/" });
        }
      } else {
        alert("관리자 로그인 후 이용가능합니다.");
        next({ path: "/login" });
      }
    });
  } else {
    next();
  }
});

export default router;
