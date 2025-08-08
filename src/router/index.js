import { createRouter, createWebHistory } from "vue-router";
import { auth, db } from "../lib/firebase";
import AdminMainView from "../views/admin/AdminMainView.vue";
import LoginView from "@/views/template/LoginView.vue";
import { collection, where, getDocs, query } from "firebase/firestore";
import AdminProductDashboardView from "@/views/admin/product/AdminProductDashboardView.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AdminProductAddView from "@/views/admin/product/AdminProductAddView.vue";
import AdminProductListView from "@/views/admin/product/AdminProductListView.vue";
import AdminProductDeletedListView from "@/views/admin/product/AdminProductDeletedListView.vue";
import AdminProductCategoryView from "@/views/admin/product/AdminProductCategoryView.vue";
import AdminProductCategoryDetailView from "@/views/admin/product/AdminProductCategoryDetailView .vue";
import ConsumerHomeView from "@/views/template/consumer/ConsumerHomeView.vue";
import ConsumerProductList from "@/views/template/consumer/ConsumerProductList.vue";
import AdminConsumerDashboardView from "@/views/admin/consumer/AdminConsumerDashboardView.vue";
import AdminConsumerListView from "@/views/admin/consumer/AdminConsumerListView.vue";
import ConsumerProductDetail from "@/views/template/consumer/ConsumerProductDetailView.vue";
import ConsumerCheckoutView from "@/views/template/consumer/ConsumerCheckoutView.vue";
import ConsumerOrderCompleteView from "@/views/template/consumer/ConsumerOrderCompleteView.vue";
import ConsumerMypageProfileView from "@/views/template/consumer/mypage/ConsumerMypageProfileView.vue";
import ConsumerMypageWishListView from "@/views/template/consumer/mypage/ConsumerMypageWishListView.vue";
import ConsumerSearchResultView from "@/views/template/consumer/ConsumerSearchView.vue";
import ConsumerCartView from "@/views/template/consumer/ConsumerCartView.vue";
import ConsumerMypageEditView from "@/views/template/consumer/mypage/ConsumerMypageEditView.vue";
import ConsumerMypageOrderView from "@/views/template/consumer/mypage/ConsumerMypageOrderView.vue";
import ConsumerMypageOrderDetailView from "@/views/template/consumer/mypage/ConsumerMypageOrderDetailView.vue";
import ConsumerLayout from "@/layouts/template/ConsumerLayout.vue";
import NotFoundView from "@/views/template/NotFoundView.vue";
import ConsumerCategoryView from "@/views/template/consumer/ConsumerCategoryView.vue";
import AdminOrderDashboardView from "@/views/admin/order/AdminOrderDashboardView.vue";
import AdminOrderListView from "@/views/admin/order/AdminOrderListView.vue";
import AdminOrderListBeforeDepositView from "@/views/admin/order/AdminOrderListBeforeDepositView.vue";
import AdminOrderListPaymentCompletedView from "@/views/admin/order/AdminOrderListPaymentCompletedView.vue";
import AdminOrderListPrepraringProductView from "@/views/admin/order/AdminOrderListPrepraringProductView.vue";
import AdminOrderListPreparingDeliveryView from "@/views/admin/order/AdminOrderListPreparingDeliveryView.vue";
import AdminOrderListShippingProgressView from "@/views/admin/order/AdminOrderListShippingProgressView.vue";
import AdminOrderListDeliveryCompletedView from "@/views/admin/order/AdminOrderListDeliveryCompletedView.vue";
import AdminConsumerAddView from "@/views/admin/consumer/AdminConsumerAddView.vue";
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
        path: "category",
        name: "consumer-category",
        component: ConsumerCategoryView,
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
      {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: NotFoundView,
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
        path: "order",
        name: "admin-order",
        redirect: "/admin/order/dashboard",
        children: [
          {
            path: "dashboard",
            name: "admin-order-dashboard",
            component: AdminOrderDashboardView,
          },
          {
            path: "list",
            name: "admin-order-list",
            redirect: "/admin/order/list/all",
            children: [
              {
                path: "all",
                name: "admin-order-list-all",
                component: AdminOrderListView,
              },
              {
                path: "before-deposit",
                name: "admin-order-list-before-deposit",
                component: AdminOrderListBeforeDepositView,
              },
              {
                path: "payment-completed",
                name: "admin-order-list-payment-completed",
                component: AdminOrderListPaymentCompletedView,
              },
              {
                path: "preparing-product",
                name: "admin-order-list-preparing-product",
                component: AdminOrderListPrepraringProductView,
              },
              {
                path: "preparing-delivery",
                name: "admin-order-list-preparing-delivery",
                component: AdminOrderListPreparingDeliveryView,
              },
              {
                path: "shipping-progress",
                name: "admin-order-list-shipping-progress",
                component: AdminOrderListShippingProgressView,
              },
              {
                path: "delivery-completed",
                name: "admin-order-list-delivery-completed",
                component: AdminOrderListDeliveryCompletedView,
              },
            ],
          },
        ],
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
          {
            path: "add",
            name: "admin-consumer-add",
            component: AdminConsumerAddView,
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
