<template>
  <div class="user-dashboard">
    <!-- Sidebar -->
    <aside :class="['sidebar', { active: sidebarOpen }]">
      <div class="sidebar-header">
        <h2>User Panel</h2>
      </div>

      <ul class="menu">
        <li @click="showSection('dashboard')">
          <a href="#"><i class="fas fa-home"></i> Dashboard</a>
        </li>
        <li @click="showSection('profile')">
          <a href="#"><i class="fas fa-user"></i> Profile</a>
        </li>
        <li @click="showSection('cart')">
          <a href="#">
            <i class="fas fa-shopping-cart"></i>
            Cart ({{ cartCount }})
          </a>
        </li>
        <li>
          <a href="#" @click.prevent="logout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </a>
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="main">
      <header class="header">
        <div class="logo-title">
          <button class="hamburger" @click="toggleSidebar">
            <i class="fas fa-bars"></i>
          </button>
          <img src="@/assets/logo.jpeg" alt="Logo" class="logo" />
          <h1>User Dashboard</h1>
        </div>
        <button class="logout-btn" @click="logout">Logout</button>
      </header>

      <main class="content">
        <!-- ✅ Dashboard Section -->
        <section v-if="activeSection === 'dashboard'">
          <h2 class="section-title">Available Products</h2>

          <div v-if="products.length > 0" class="products-grid">
            <div v-for="p in products" :key="p._id" class="product-card">
              <div class="product-media">
                <img :src="`http://localhost:5000${p.image}`" :alt="p.name" />
              </div>

              <div class="product-info">
                <h3>{{ p.name }}</h3>
                <p class="description">{{ p.description }}</p>
              </div>

              <div class="price-section">
                <span class="discount-price">₹{{ p.discountPrice }}</span>
                <span
                  class="original-price"
                  v-if="p.discountPrice < p.originalPrice"
                >
                  ₹{{ p.originalPrice }}
                </span>
              </div>

              <div class="quantity-status">
                <span v-if="p.quantity === 0" class="out-of-stock">
                  Out of Stock
                </span>
                <span v-else-if="p.quantity < 10" class="few-left">
                  Few left ({{ p.quantity }})
                </span>
                <span v-else class="in-stock">Available: {{ p.quantity }}</span>
              </div>

              <button
                class="cart-btn"
                :disabled="p.quantity === 0"
                @click="addToCart(p._id)"
              >
                <i class="fas fa-cart-plus"></i>
                {{ p.quantity === 0 ? "Out of Stock" : "Add to Cart" }}
              </button>
            </div>
          </div>

          <div v-else class="no-products">No products available.</div>

          <!-- ✅ Recommended Products Section -->
          <div
            v-if="recommendedProducts.length > 0"
            class="recommended-section"
          >
            <h3 class="section-title">Recommended for You</h3>
            <div class="products-grid">
              <div
                v-for="r in recommendedProducts"
                :key="r._id"
                class="product-card"
              >
                <div class="product-media">
                  <img :src="`http://localhost:5000${r.image}`" :alt="r.name" />
                </div>
                <div class="product-info">
                  <h3>{{ r.name }}</h3>
                  <p class="description">{{ r.description }}</p>
                </div>
                <div class="price-section">
                  <span class="discount-price">₹{{ r.discountPrice }}</span>
                  <span
                    class="original-price"
                    v-if="r.discountPrice < r.originalPrice"
                  >
                    ₹{{ r.originalPrice }}
                  </span>
                </div>
                <button class="cart-btn" @click="addToCart(r._id)">
                  <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ✅ Profile Section -->
        <section v-else-if="activeSection === 'profile'">
          <ProfilePage />
        </section>

        <!-- ✅ Cart Section -->
        <section v-else-if="activeSection === 'cart'">
          <CartPage />
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import api from "@/axios";
import "@/assets/styles/UserPage.css";
import ProfilePage from "@/views/ProfilePage.vue";
import CartPage from "@/views/CartPage.vue";

export default {
  name: "UserPage",
  components: { ProfilePage, CartPage },
  data() {
    return {
      products: [],
      recommendedProducts: [], // ✅ new
      cartCount: 0,
      sidebarOpen: false,
      activeSection: "dashboard",
    };
  },
  async created() {
    await this.loadCartCount();
    await this.fetchProducts();
  },
  methods: {
    showSection(section) {
      this.activeSection = section;
      this.closeSidebar();
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login");
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },

    closeSidebar() {
      if (window.innerWidth <= 768) this.sidebarOpen = false;
    },

    // ✅ Fetch all products
    async fetchProducts() {
      try {
        const res = await api.get("/products/getproduct");
        this.products = res.data.success ? res.data.products : [];
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    },

    // ✅ Fetch recommendations for selected product
    async fetchRecommendations(productId) {
      try {
        const res = await api.get(`/recommend/${productId}`);
        if (res.data.success) {
          this.recommendedProducts = res.data.recommendations;
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    },

    // ✅ Add product to cart and trigger recommendations
    async addToCart(productId) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id || user?.id;

        if (!userId) {
          alert("Please log in first!");
          return this.$router.push("/login");
        }

        const res = await api.post("/cart/add", {
          userId,
          productId,
          quantity: 1,
        });

        if (res.data.success) {
          await this.loadCartCount();
          alert("✅ Item added to cart!");
          await this.fetchRecommendations(productId); // ✅ show similar items
        } else {
          alert("⚠️ Could not add item to cart.");
        }
      } catch (err) {
        console.error("Error adding to cart:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          this.logout();
        }
      }
    },

    // ✅ Load cart count
    async loadCartCount() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id || user?.id;

        if (!userId) {
          this.cartCount = 0;
          return;
        }

        const res = await api.get(`/cart/${userId}`);
        this.cartCount = res.data.cart
          ? res.data.cart.items.reduce((sum, i) => sum + i.quantity, 0)
          : 0;
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    },
  },
};
</script>

<style scoped>
.recommended-section {
  margin-top: 2rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}

.recommended-section h3 {
  margin-bottom: 1rem;
  font-weight: 600;
}
</style>
