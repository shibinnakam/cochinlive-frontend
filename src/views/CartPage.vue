<template>
  <div class="cart-container">
    <h2 class="page-title">🛒 My Cart</h2>

    <!-- ✅ Cart Items -->
    <div v-if="cartItems.length > 0" class="cart-content">
      <div v-for="item in cartItems" :key="item.product._id" class="cart-item">
        <img
          :src="`http://localhost:5000${item.product.image}`"
          alt="Product Image"
          class="cart-image"
        />

        <div class="cart-details">
          <h3>{{ formatText(item.product.name) }}</h3>
          <p class="description">{{ formatText(item.product.description) }}</p>
          <div class="price">₹{{ item.product.discountPrice }}</div>

          <!-- Quantity Control -->
          <div class="quantity-control">
            <button
              class="qty-btn"
              @click="updateQuantity(item.product._id, item.quantity - 1)"
              :disabled="item.quantity <= 1"
            >
              −
            </button>
            <span class="quantity">{{ item.quantity }}</span>
            <button
              class="qty-btn"
              @click="updateQuantity(item.product._id, item.quantity + 1)"
            >
              +
            </button>
          </div>
        </div>

        <button class="delete-btn" @click="removeFromCart(item.product._id)">
          🗑 Remove
        </button>
      </div>

      <!-- ✅ Summary -->
      <div class="cart-summary">
        <p><strong>Total Items:</strong> {{ cartCount }}</p>
        <p><strong>Total Price:</strong> ₹{{ totalPrice }}</p>
        <button class="purchase-btn" @click="purchaseItems">
          🛒 Proceed to Purchase
        </button>
      </div>
    </div>

    <!-- ❌ Empty Cart -->
    <div v-else class="no-products">
      <p>Your cart is empty 😢</p>
      <router-link to="/user" class="back-btn">Browse Products</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "@/assets/styles/CartPage.css";

export default {
  name: "CartPage",
  data() {
    return {
      cartItems: [],
      cartCount: 0,
    };
  },

  computed: {
    totalPrice() {
      return this.cartItems.reduce(
        (sum, item) => sum + item.product.discountPrice * item.quantity,
        0,
      );
    },
  },

  async created() {
    await this.loadCart();
  },

  methods: {
    // ✅ Clean text formatting
    formatText(text) {
      if (!text) return "";
      return text.replace(/^\s+/, "").trim();
    },

    // ✅ Load user's cart
    async loadCart() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        const userId = user?._id || user?.id || user?.user?._id;

        if (!userId) {
          console.warn("⚠ No user ID found — redirecting to login");
          return this.$router.push("/login");
        }

        const res = await axios.get(
          `http://localhost:5000/api/cart/${userId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );

        if (res.data.cart && Array.isArray(res.data.cart.items)) {
          this.cartItems = res.data.cart.items.map((item) => ({
            ...item,
            product: {
              ...item.product,
              name: this.formatText(item.product.name),
              description: this.formatText(item.product.description),
            },
          }));
          this.cartCount = this.cartItems.reduce(
            (sum, i) => sum + i.quantity,
            0,
          );
        } else {
          this.cartItems = [];
        }
      } catch (err) {
        console.error("❌ Error loading cart:", err);
      }
    },

    // ✅ Update quantity
    async updateQuantity(productId, newQuantity) {
      if (newQuantity < 1) return;
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id || user?.id || user?.user?._id;

        await axios.put("http://localhost:5000/api/cart/update", {
          userId,
          productId,
          quantity: newQuantity,
        });

        const item = this.cartItems.find((i) => i.product._id === productId);
        if (item) item.quantity = newQuantity;

        this.cartCount = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
      } catch (err) {
        console.error("Error updating quantity:", err);
      }
    },

    // ✅ Remove from cart
    async removeFromCart(productId) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id || user?.id || user?.user?._id;

        await axios.delete("http://localhost:5000/api/cart/remove", {
          data: { userId, productId },
        });

        this.cartItems = this.cartItems.filter(
          (item) => item.product._id !== productId,
        );

        this.cartCount = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);

        alert("❌ Item removed from cart");
      } catch (err) {
        console.error("Error removing item:", err);
      }
    },

    // ✅ Purchase button logic — checks DB for verification
    async purchaseItems() {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          alert("Please log in to proceed with purchase.");
          return this.$router.push("/login");
        }

        const parsedUser = JSON.parse(storedUser);
        const user = parsedUser.user || parsedUser;
        const userId = user?._id || user?.id;

        if (!userId) {
          alert("Please log in to proceed with purchase.");
          return this.$router.push("/login");
        }

        // ✅ STEP 1: Check DB for verification (correct backend route)
        const userRes = await axios.get(
          `http://localhost:5000/api/auth/user/${userId}`,
        );
        const dbUser = userRes.data.user;

        if (
          !dbUser ||
          dbUser.isVerified === false ||
          dbUser.verificationStatus !== "verified"
        ) {
          alert(
            "⚠️ Your account is not verified. You cannot purchase products.",
          );
          return;
        }

        // ✅ STEP 2: Ensure cart not empty
        if (this.cartItems.length === 0) {
          alert("Your cart is empty!");
          return;
        }

        // ✅ STEP 3: Confirm purchase
        const confirmPurchase = confirm(
          `Confirm purchase of ₹${this.totalPrice}?`,
        );
        if (!confirmPurchase) return;

        // ✅ STEP 4: Create order
        const orderRes = await axios.post(
          "http://localhost:5000/api/orders/create",
          {
            userId,
            items: this.cartItems,
            totalAmount: this.totalPrice,
          },
        );

        if (orderRes.data.success) {
          alert("✅ Purchase successful!");
          this.cartItems = [];
          this.cartCount = 0;
        } else {
          alert("❌ Purchase failed. Please try again.");
        }
      } catch (error) {
        console.error("❌ Error verifying user or completing purchase:", error);
        alert("Server error while verifying user. Please try again later.");
      }
    },
  },
};
</script>

<style scoped>
.cart-container {
  background: #ffffff;
  border-radius: 20px;
  padding: 25px 30px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
  max-width: 900px;
  margin: 30px auto;
  transition: all 0.3s ease;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
  color: #333;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #eaeaea;
  border-radius: 14px;
  padding: 15px;
  transition: 0.3s;
  background-color: #fafafa;
}

.cart-item:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.cart-image {
  width: 90px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 15px;
}

.cart-details {
  flex: 1;
  padding-right: 10px;
}

.cart-details h3 {
  font-size: 1rem;
  margin-bottom: 5px;
  color: #222;
}

.description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.price {
  color: #00a651;
  font-weight: bold;
  margin-top: 3px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.qty-btn {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: 0.2s;
}

.qty-btn:hover {
  background: #0056b3;
}

.qty-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.delete-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

.delete-btn:hover {
  background: #d93636;
}

.cart-summary {
  text-align: right;
  margin-top: 25px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.purchase-btn {
  background: #22bb33;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 22px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.purchase-btn:hover {
  background: #1da82f;
  transform: scale(1.03);
}

.no-products {
  text-align: center;
  padding: 50px;
  color: #777;
  font-size: 1.1rem;
}

.back-btn {
  display: inline-block;
  margin-top: 20px;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #0056b3;
}
</style>
