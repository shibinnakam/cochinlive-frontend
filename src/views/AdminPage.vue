<template>
  <div class="admin-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
      <div class="toggle-btn" @click="toggleSidebar">
        <i class="bi bi-list"></i>
      </div>
      <h2 class="sidebar-title" v-if="!isSidebarCollapsed">Master Admin</h2>

      <ul class="menu">
        <!-- Dashboard -->
        <li>
          <a
            href="#"
            @click.prevent="selectedMenu = 'dashboard'"
            :class="{ active: selectedMenu === 'dashboard' }"
            :title="isSidebarCollapsed ? 'Dashboard' : ''"
          >
            <i class="bi bi-speedometer2"></i>
            <span v-if="!isSidebarCollapsed">Dashboard</span>
          </a>
        </li>

        <!-- Add Product -->
        <li>
          <a
            href="#"
            @click.prevent="selectedMenu = 'addProduct'"
            :class="{ active: selectedMenu === 'addProduct' }"
            :title="isSidebarCollapsed ? 'Add Products' : ''"
          >
            <i class="bi bi-box-seam"></i>
            <span v-if="!isSidebarCollapsed">Add Products</span>
          </a>
        </li>

        <!-- Add Category -->
        <li>
          <a
            href="#"
            @click.prevent="selectedMenu = 'addCategory'"
            :class="{ active: selectedMenu === 'addCategory' }"
            :title="isSidebarCollapsed ? 'Add Category' : ''"
          >
            <i class="bi bi-tags"></i>
            <span v-if="!isSidebarCollapsed">Add Category</span>
          </a>
        </li>

        <!-- Staff -->
        <li>
          <a
            href="#"
            @click.prevent="selectedMenu = 'staffManagement'"
            :class="{ active: selectedMenu === 'staffManagement' }"
            :title="isSidebarCollapsed ? 'Staff Management' : ''"
          >
            <i class="bi bi-people"></i>
            <span v-if="!isSidebarCollapsed">Staff Management</span>
          </a>
        </li>

        <!-- Approve Leaves -->
        <li>
          <a
            href="#"
            @click.prevent="selectedMenu = 'approve-leaves'"
            :class="{ active: selectedMenu === 'approve-leaves' }"
            :title="isSidebarCollapsed ? 'Approve Leaves' : ''"
          >
            <i class="bi bi-calendar-check"></i>
            <span v-if="!isSidebarCollapsed">Approve Leaves</span>
          </a>
        </li>

        <!-- 🧾 Resignation Requests (New) -->
        <li>
          <a
            href="#"
            @click.prevent="selectedMenu = 'resignationRequests'"
            :class="{ active: selectedMenu === 'resignationRequests' }"
            :title="isSidebarCollapsed ? 'Resignation Requests' : ''"
          >
            <i class="bi bi-person-x"></i>
            <span v-if="!isSidebarCollapsed">Resignation Requests</span>
          </a>
        </li>

        <!-- List Products -->
        <li>
          <a
            href="#"
            @click.prevent="selectedMenu = 'listProducts'"
            :class="{ active: selectedMenu === 'listProducts' }"
            :title="isSidebarCollapsed ? 'List Products' : ''"
          >
            <i class="bi bi-list-ul"></i>
            <span v-if="!isSidebarCollapsed">List Products</span>
          </a>
        </li>

        <!-- 🧑‍💼 Manage Users -->
        <li>
          <a
            href="#"
            @click.prevent="selectedMenu = 'userList'"
            :class="{ active: selectedMenu === 'userList' }"
            :title="isSidebarCollapsed ? 'Manage Users' : ''"
          >
            <i class="bi bi-person-lines-fill"></i>
            <span v-if="!isSidebarCollapsed">Manage Users</span>
          </a>
        </li>
      </ul>
    </aside>

    <!-- Main Section -->
    <div class="main">
      <!-- Header -->
      <header class="header">
        <div class="header-content-wrapper">
          <img src="@/assets/logo.jpeg" alt="Logo" class="header-logo" />
          <h1>Dashboard <span class="small">Control panel</span></h1>
        </div>
        <div class="admin-menu">
          <span>Laravel Admin ▾</span>
          <button class="logout-btn" @click="logout">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="content">
        <AddProduct v-if="selectedMenu === 'addProduct'" />
        <ProductCategory v-if="selectedMenu === 'addCategory'" />
        <ProductList v-if="selectedMenu === 'listProducts'" />
        <StaffManagement v-if="selectedMenu === 'staffManagement'" />
        <AdminLeaves v-if="selectedMenu === 'approve-leaves'" />
        <AdminUserList v-if="selectedMenu === 'userList'" />
        <AdminResignationList v-if="selectedMenu === 'resignationRequests'" />
        <!-- ✅ New Component -->

        <!-- Dashboard Cards -->
        <template v-if="selectedMenu === 'dashboard' || !selectedMenu">
          <div class="card blue">
            <h2>{{ totalProducts }}</h2>
            <p>Total Products</p>
          </div>
          <div class="card orange">
            <h2>{{ totalStaff }}</h2>
            <p>Total Staff</p>
          </div>
          <div
            class="card red"
            @click="selectedMenu = 'approve-leaves'"
            style="cursor: pointer"
          >
            <h2>{{ pendingLeaves }}</h2>
            <p>Pending Leaves</p>
          </div>
          <div
            class="card green"
            @click="selectedMenu = 'addCategory'"
            style="cursor: pointer"
          >
            <h2>{{ totalCategories }}</h2>
            <p>Total Categories</p>
          </div>

          <div
            class="card pink"
            @click="selectedMenu = 'userList'"
            style="cursor: pointer"
          >
            <h2>{{ totalUsers }}</h2>
            <p>Total Users</p>
          </div>

          <!-- 🧾 New Card: Resignation Requests -->
          <div
            class="card purple"
            @click="selectedMenu = 'resignationRequests'"
            style="cursor: pointer"
          >
            <h2>{{ pendingResignations }}</h2>
            <p>Pending Resignations</p>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script>
import "@/assets/styles/AdminPage.css";
import AddProduct from "@/views/AddProduct.vue";
import ProductList from "@/views/ProductList.vue";
import ProductCategory from "@/views/AddCategory.vue";
import StaffManagement from "@/views/StaffManagement.vue";
import AdminLeaves from "@/views/AdminLeaves.vue";
import AdminUserList from "@/views/AdminUserList.vue";
import AdminResignationList from "@/views/AdminResignationList.vue"; // ✅ new import
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

export default {
  name: "AdminPage",
  components: {
    AddProduct,
    ProductList,
    ProductCategory,
    StaffManagement,
    AdminLeaves,
    AdminUserList,
    AdminResignationList, // ✅ register
  },
  data() {
    return {
      selectedMenu: "dashboard",
      isSidebarCollapsed: false,
      totalProducts: 0,
      totalStaff: 0,
      pendingLeaves: 0,
      totalCategories: 0,
      totalUsers: 0,
      pendingResignations: 0, // ✅ new
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    async fetchTotals() {
      try {
        const [
          productsRes,
          staffRes,
          leavesRes,
          categoriesRes,
          usersRes,
          resignationsRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/products/totalproducts"),
          axios.get("http://localhost:5000/api/staff/totalstaff"),
          axios.get("http://localhost:5000/api/leaves/count/pending"),
          axios.get("http://localhost:5000/api/categories/totalcategories"),
          axios.get("http://localhost:5000/api/auth/users/count"),
          axios.get("http://localhost:5000/api/resignations/all"),
        ]);

        this.totalProducts = productsRes.data.total;
        this.totalStaff = staffRes.data.total;
        this.pendingLeaves = leavesRes.data.totalPending;
        this.totalCategories = categoriesRes.data.total;
        this.totalUsers = usersRes.data.totalUsers;

        // ✅ count only pending resignations
        this.pendingResignations = resignationsRes.data.filter(
          (r) => r.status === "pending",
        ).length;
      } catch (err) {
        console.error("Error fetching totals:", err);
      }
    },
  },
  mounted() {
    this.fetchTotals();
  },
};
</script>

<style scoped>
.card.purple {
  background-color: #b27cf5;
  color: #fff;
}
</style>
