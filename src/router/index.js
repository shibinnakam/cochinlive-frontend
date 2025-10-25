import { createRouter, createWebHistory } from "vue-router";

// ---------- Public Pages ----------
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import AdminUserList from "@/views/AdminUserList.vue";

// ---------- Authenticated ----------
import ProfilePage from "@/views/ProfilePage.vue";

// ---------- Admin ----------
import AddProduct from "@/views/AddProduct.vue";
import AdminPage from "@/views/AdminPage.vue";
import ProductEdit from "@/views/ProductEdit.vue";

// ---------- User ----------
import UserPage from "@/views/UserPage.vue";
import CartPage from "@/views/CartPage.vue";

// ---------- Staff ----------
import StaffRegister from "@/views/StaffRegister.vue";
import StaffPage from "@/views/StaffPage.vue";
import StaffLeave from "@/views/StaffLeave.vue";

const routes = [
  // ---------- Public ----------
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "LoginPage", component: Login },
  { path: "/about", name: "AboutPage", component: About },
  { path: "/contact", name: "ContactPage", component: Contact },
  { path: "/profile", name: "ProfilePage", component: ProfilePage },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  { path: "/reset-password", name: "ResetPassword", component: ResetPassword },
  {
    path: "/set-password/:token",
    name: "SetPassword",
    component: () => import("@/views/SetPassword.vue"),
  },
  {
    path: "/google-success",
    name: "GoogleSuccess",
    component: () => import("@/views/GoogleSuccess.vue"),
  },

  // ---------- Admin ----------
  {
    path: "/admin",
    name: "AdminPage",
    component: AdminPage,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      user?.role === "admin" ? next() : next("/login");
    },
  },
  {
    path: "/admin/users",
    name: "AdminUserList",
    component: AdminUserList,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/add-product",
    name: "AddProduct",
    component: AddProduct,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      user?.role === "admin" ? next() : next("/login");
    },
  },
  {
    path: "/admin/add-category",
    name: "AddCategory",
    component: () => import("@/views/AddCategory.vue"),
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      user?.role === "admin" ? next() : next("/login");
    },
  },
  {
    path: "/admin/products",
    name: "ProductList",
    component: () => import("@/views/ProductList.vue"),
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      user?.role === "admin" ? next() : next("/login");
    },
  },
  {
    path: "/admin/leaves",
    name: "AdminLeaves",
    component: () => import("@/views/AdminLeaves.vue"),
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      user?.role === "admin" ? next() : next("/login");
    },
  },
  { path: "/products/edit/:id", name: "ProductEdit", component: ProductEdit },

  // ---------- User ----------
  {
    path: "/user",
    name: "UserPage",
    component: UserPage,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      user?.role === "user" ? next() : next("/login");
    },
  },
  {
    path: "/cart",
    name: "CartPage",
    component: CartPage,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      user ? next() : next("/login");
    },
  },
  {
    path: "/admin/user/:userId",
    name: "AdminUserProfile",
    component: ProfilePage,
    meta: { requiresAdmin: true },
  },

  // ---------- Staff ----------
  {
    path: "/staff",
    name: "StaffPage",
    component: StaffPage,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      user?.role === "staff" ? next() : next("/login");
    },
  },
  {
    path: "/staff/staffregister",
    name: "StaffRegister",
    component: StaffRegister,
  },
  {
    path: "/staff/leave",
    name: "StaffLeave",
    component: StaffLeave,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      user?.role === "staff" ? next() : next("/login");
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
