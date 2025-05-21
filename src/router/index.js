import { createRouter, createWebHistory } from "vue-router";
import { auth, db } from "../lib/firebase";
import HomeView from "../views/HomeView.vue";
import AdminMainView from "../views/admin/AdminMainView.vue";
import AdminLoginView from "@/views/admin/AdminLoginView.vue";
import { doc, getDoc } from "firebase/firestore";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminMainView,
    meta: { requiresAuthAdmin: true },
    children: [],
  },
  {
    path: "/admin/login",
    name: "admin-login",
    component: AdminLoginView,
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
        next({ path: "/admin/login" });
      }
    });
  } else {
    next();
  }
});

export default router;
