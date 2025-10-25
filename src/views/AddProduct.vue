<template>
  <div class="form-wrapper">
    <div class="form-card">
      <div class="form-logo-container">
        <img src="@/assets/logo.jpeg" alt="Company Logo" class="form-logo" />
      </div>
      <h2 class="form-title">Add New Products</h2>
      <form @submit.prevent="addProduct">
        <label for="name">Item Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="e.g., Organic Apples"
        />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>

        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="description"
          placeholder="Brief description of the product"
        ></textarea>
        <p v-if="errors.description" class="error">{{ errors.description }}</p>

        <label for="originalPrice">Original Price (USD)</label>
        <input
          id="originalPrice"
          v-model.number="originalPrice"
          type="number"
          placeholder="e.g., 15.00"
        />
        <p v-if="errors.originalPrice" class="error">
          {{ errors.originalPrice }}
        </p>

        <label for="discountPrice">Discount Price (USD)</label>
        <input
          id="discountPrice"
          v-model.number="discountPrice"
          type="number"
          placeholder="e.g., 12.50"
        />
        <p v-if="errors.discountPrice" class="error">
          {{ errors.discountPrice }}
        </p>

        <label for="quantity">Quantity in Stock</label>
        <input
          id="quantity"
          v-model.number="quantity"
          type="number"
          min="0"
          placeholder="e.g., 100"
        />
        <p v-if="errors.quantity" class="error">{{ errors.quantity }}</p>

        <label for="manufacturingDate">Manufacturing Date</label>
        <input id="manufacturingDate" v-model="manufacturingDate" type="date" />
        <p v-if="errors.manufacturingDate" class="error">
          {{ errors.manufacturingDate }}
        </p>

        <label for="expiryDate">Expiry Date</label>
        <input id="expiryDate" v-model="expiryDate" type="date" />
        <p v-if="errors.expiryDate" class="error">{{ errors.expiryDate }}</p>

        <label for="batchNumber">Batch Number</label>
        <input
          id="batchNumber"
          v-model="batchNumber"
          type="text"
          placeholder="e.g., ABC123DEF"
        />
        <p v-if="errors.batchNumber" class="error">{{ errors.batchNumber }}</p>

        <label for="rackNumber">Rack Number (1-155)</label>
        <input
          id="rackNumber"
          v-model.number="rackNumber"
          type="number"
          min="1"
          max="155"
          placeholder="e.g., 42"
        />
        <p v-if="errors.rackNumber" class="error">{{ errors.rackNumber }}</p>

        <label for="category">Select Category</label>
        <select v-model="category" id="category">
          <option value="" disabled>Select Category</option>
          <option v-for="c in categories" :key="c._id" :value="c._id">
            {{ c.name }}
          </option>
        </select>
        <p v-if="errors.category" class="error">{{ errors.category }}</p>

        <label for="image">Product Image</label>
        <input
          id="image"
          type="file"
          @change="handleImageUpload"
          accept="image/*"
        />
        <p v-if="errors.image" class="error">{{ errors.image }}</p>

        <div v-if="preview" class="image-preview">
          <img :src="preview" alt="Preview" />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Adding..." : "Add Item" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "../assets/styles/AddProduct.css"; // ✅ Import external CSS

export default {
  name: "AddProduct",
  data() {
    return {
      name: "",
      description: "",
      originalPrice: "",
      discountPrice: "",
      quantity: "",
      manufacturingDate: "",
      expiryDate: "",
      batchNumber: "",
      rackNumber: "",
      category: "",
      categories: [],
      image: null,
      preview: null,
      loading: false,
      errors: {}, // ✅ field-level errors
    };
  },
  methods: {
    handleImageUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.image = file;
        this.preview = URL.createObjectURL(file);
      }
    },

    async loadCategories() {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        this.categories = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.categories)
            ? res.data.categories
            : [];
      } catch (err) {
        console.error("❌ Error loading categories:", err.message);
        this.categories = [];
      }
    },

    validateBatchNumber(batch) {
      const patterns = [
        /^[A-Z0-9]{3,10}$/,
        /^\d{3,8}$/,
        /^[A-Z]{1,2}\d{2,6}$/,
        /^\d{2}[A-Z]{1,2}\d{2,4}$/,
        /^[A-Z0-9-/]{3,12}$/,
      ];
      return patterns.some((regex) => regex.test(batch));
    },

    async addProduct() {
      this.errors = {}; // reset errors

      // ✅ Frontend validation
      if (!this.name || !/^[A-Za-z0-9 ]{4,15}$/.test(this.name))
        this.errors.name =
          "Product name 4-15 chars, letters/numbers/spaces only";
      if (!this.description || !/^[A-Za-z0-9 ]{4,20}$/.test(this.description))
        this.errors.description =
          "Description 4-20 chars, letters/numbers/spaces only";
      if (
        !this.originalPrice ||
        this.originalPrice < 1 ||
        this.originalPrice > 1000
      )
        this.errors.originalPrice = "Original price must be 1-1000";
      if (
        !this.discountPrice ||
        this.discountPrice < 1 ||
        this.discountPrice > 1000
      )
        this.errors.discountPrice = "Discount price must be 1-1000";
      if (this.discountPrice > this.originalPrice)
        this.errors.discountPrice =
          "Discount cannot be greater than original price";
      if (this.quantity < 0)
        this.errors.quantity = "Quantity must be 0 or greater";
      if (!this.manufacturingDate)
        this.errors.manufacturingDate = "Manufacturing date required";
      if (!this.expiryDate) this.errors.expiryDate = "Expiry date required";

      if (this.manufacturingDate && this.expiryDate) {
        const mfgDate = new Date(this.manufacturingDate);
        const expDate = new Date(this.expiryDate);
        if (mfgDate.getTime() === expDate.getTime())
          this.errors.expiryDate = "Expiry must differ from manufacturing date";
        if ((expDate - mfgDate) / (1000 * 60 * 60 * 24) < 10)
          this.errors.expiryDate =
            "Expiry must be at least 10 days after manufacturing";
      }

      if (!this.batchNumber || !this.validateBatchNumber(this.batchNumber))
        this.errors.batchNumber = "Invalid batch number format";
      if (!this.rackNumber || this.rackNumber < 1 || this.rackNumber > 155)
        this.errors.rackNumber = "Rack number must be 1-155";
      if (!this.category) this.errors.category = "Select a category";
      if (!this.image) this.errors.image = "Select an image";

      // Stop if there are validation errors
      if (Object.keys(this.errors).length > 0) return;

      // ✅ Submit form
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("description", this.description);
        formData.append("originalPrice", this.originalPrice);
        formData.append("discountPrice", this.discountPrice);
        formData.append("quantity", this.quantity);
        formData.append("manufacturingDate", this.manufacturingDate);
        formData.append("expiryDate", this.expiryDate);
        formData.append("batchNumber", this.batchNumber);
        formData.append("rackNumber", this.rackNumber);
        formData.append("category", this.category);
        formData.append("image", this.image);

        const res = await axios.post(
          "http://localhost:5000/api/products/addproduct",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        alert(res.data.message);
        this.resetForm();
      } catch (err) {
        const backendMessage = err.response?.data?.message;
        if (backendMessage) {
          if (backendMessage.includes("name"))
            this.errors.name = backendMessage;
          else if (backendMessage.includes("description"))
            this.errors.description = backendMessage;
          else if (backendMessage.includes("Batch"))
            this.errors.batchNumber = backendMessage;
          else if (backendMessage.includes("category"))
            this.errors.category = backendMessage;
          else alert(backendMessage);
        } else {
          alert("Server error");
        }
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.name = "";
      this.description = "";
      this.originalPrice = "";
      this.discountPrice = "";
      this.quantity = "";
      this.manufacturingDate = "";
      this.expiryDate = "";
      this.batchNumber = "";
      this.rackNumber = "";
      this.category = "";
      this.image = null;
      this.preview = null;
      this.errors = {};
    },
  },
  mounted() {
    this.loadCategories();
  },
};
</script>
