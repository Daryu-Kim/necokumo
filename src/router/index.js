import { createRouter, createWebHistory } from "vue-router";
import { auth, db } from "../lib/firebase";
import AdminMainView from "../views/admin/AdminMainView.vue";
import LoginView from "@/views/LoginView.vue";
import { collection, where, getDocs, query } from "firebase/firestore";
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
import AdminConsumerDashboardView from "@/views/admin/consumer/AdminConsumerDashboardView.vue";
import AdminConsumerListView from "@/views/admin/consumer/AdminConsumerListView.vue";
import ConsumerProductDetail from "@/views/consumer/ConsumerProductDetailView.vue";
import ConsumerCheckoutView from "@/views/consumer/ConsumerCheckoutView.vue";
import ConsumerOrderCompleteView from "@/views/consumer/ConsumerOrderCompleteView.vue";
import ConsumerMypageProfileView from "@/views/consumer/mypage/ConsumerMypageProfileView.vue";
import ConsumerMypageWishListView from "@/views/consumer/mypage/ConsumerMypageWishListView.vue";
import ConsumerSearchResultView from "@/views/consumer/ConsumerSearchView.vue";
import ConsumerCartView from "@/views/consumer/ConsumerCartView.vue";
import ConsumerMypageEditView from "@/views/consumer/mypage/ConsumerMypageEditView.vue";
import ConsumerMypageOrderView from "@/views/consumer/mypage/ConsumerMypageOrderView.vue";
import ConsumerMypageOrderDetailView from "@/views/consumer/mypage/ConsumerMypageOrderDetailView.vue";
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
        path: "login",
        name: "login",
        component: LoginView,
      },
      {
        path: "list",
        name: "consumer-product-list",
        component: ConsumerProductList,
      },
      {
        path: "search",
        name: "consumer-search",
        component: ConsumerSearchResultView,
      },
      {
        path: "product",
        name: "consumer-product-detail",
        component: ConsumerProductDetail,
        meta: { requiresAuthConsumer: true },
      },
      {
        path: "checkout",
        name: "consumer-checkout",
        component: ConsumerCheckoutView,
        meta: { requiresAuthConsumer: true },
      },
      {
        path: "order-complete",
        name: "consumer-order-complete",
        component: ConsumerOrderCompleteView,
        meta: { requiresAuthConsumer: true },
      },
      {
        path: "cart",
        name: "consumer-cart",
        component: ConsumerCartView,
        meta: { requiresAuthConsumer: true },
      },
      {
        path: "mypage",
        name: "consumer-mypage",
        meta: { requiresAuthConsumer: true },
        redirect: "/mypage/profile",
        children: [
          {
            path: "profile",
            name: "consumer-mypage-profile",
            component: ConsumerMypageProfileView,
            meta: { requiresAuthConsumer: true },
          },
          {
            path: "wishlist",
            name: "consumer-mypage-wishlist",
            component: ConsumerMypageWishListView,
            meta: { requiresAuthConsumer: true },
          },
          {
            path: "edit",
            name: "consumer-mypage-edit",
            component: ConsumerMypageEditView,
            meta: { requiresAuthConsumer: true },
          },
          {
            path: "order",
            name: "consumer-mypage-order",
            component: ConsumerMypageOrderView,
            meta: { requiresAuthConsumer: true },
          },
          {
            path: "order/detail",
            name: "consumer-mypage-order-detail",
            component: ConsumerMypageOrderDetailView,
            meta: { requiresAuthConsumer: true },
          },
        ],
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
      {
        path: "consumer",
        name: "admin-consumer",
        redirect: "/admin/consumer/dashboard",
        children: [
          {
            path: "dashboard",
            name: "admin-consumer-dashboard",
            component: AdminConsumerDashboardView,
          },
          {
            path: "list",
            name: "admin-consumer-list",
            component: AdminConsumerListView,
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
  if (to.matched.some((record) => record.meta.requiresAuthConsumer)) {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe(); // Unsubscribe the listener immediately after getting the result
      if (user) {
        next();
      } else {
        alert("로그인 후 이용가능합니다.");
        next({ path: "/login" });
      }
    });
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuthCompany)) {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe(); // Unsubscribe the listener immediately after getting the result
      if (user) {
        try {
          const userDocs = await getDocs(
            query(
              collection(db, "managers"),
              where("uid", "==", user.uid),
              where("role", "==", "company")
            )
          );
          if (userDocs.size > 0) {
            next();
          } else {
            console.warn(`No document found for user ID: ${user.uid}`);
            alert("협력사만 접근할 수 있습니다.");
            next({ path: "/" });
          }
        } catch (error) {
          alert("협력사만 접근할 수 있습니다.");
          next({ path: "/" });
        }
      } else {
        alert("협력사 로그인 후 이용가능합니다.");
        next({ path: "/login" });
      }
    });
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuthAdmin)) {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe(); // Unsubscribe the listener immediately after getting the result
      if (user) {
        try {
          const userDocs = await getDocs(
            query(
              collection(db, "managers"),
              where("uid", "==", user.uid),
              where("role", "==", "admin")
            )
          );
          if (userDocs.size > 0) {
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
