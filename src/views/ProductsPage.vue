<template>
  <div class="products-page">
    <h1>All Products</h1>

    <div class="products-grid">
      <div v-for="product in products" :key="product._id" class="product-card">
        <img
          :src="`http://localhost:5000${product.image}`"
          :alt="product.name"
        />
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p>
          <strong>₹{{ product.discountPrice }}</strong>
          <span
            class="old"
            v-if="product.discountPrice < product.originalPrice"
          >
            ₹{{ product.originalPrice }}
          </span>
          <span
            v-if="product.discountPrice < product.originalPrice"
            class="discount"
          >
            ({{
              calculateDiscount(product.originalPrice, product.discountPrice)
            }}% off)
          </span>
        </p>
        <button
          class="add-cart-btn"
          :disabled="product.quantity === 0"
          @click="addToCart(product._id)"
        >
          <i class="fas fa-cart-plus"></i>
          {{ product.quantity === 0 ? "Out of Stock" : "Add to Cart" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductsPage",
  data() {
    return {
      products: [],
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/getproduct",
        );
        if (res.data.success) {
          this.products = res.data.products;
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    },
    calculateDiscount(original, discount) {
      return Math.round(((original - discount) / original) * 100);
    },
    async addToCart(productId) {
      try {
        const userId = this.$store.state.user._id;
        await axios.post("http://localhost:5000/api/cart/add", {
          userId,
          productId,
          quantity: 1,
        });
        alert("Item added to cart!");
      } catch (err) {
        console.error(
          "Error adding to cart:",
          err.response?.data || err.message,
        );
      }
    },
  },
};
</script>

<style scoped>
.products-page {
  padding: 30px;
  background: #f7f7f7;
  min-height: 100vh;
}

h1 {
  margin-bottom: 25px;
  font-size: 28px;
  color: #2d3436;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: center;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.product-card h3 {
  margin: 10px 0 5px;
  font-size: 18px;
  color: #2d3436;
}

.product-card p {
  margin: 5px 0;
  color: #636e72;
}

.old {
  text-decoration: line-through;
  color: #888;
  margin-left: 5px;
}

.discount {
  color: #00b894;
  margin-left: 5px;
  font-weight: bold;
}

.add-cart-btn {
  margin-top: 12px;
  background: #0984e3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.add-cart-btn:hover {
  background: #74b9ff;
}

.add-cart-btn:disabled {
  background: #b2bec3;
  cursor: not-allowed;
}
</style>
