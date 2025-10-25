<template>
  <div class="category-container">
    <h2>Category Management</h2>

    <!-- Add Form -->
    <form @submit.prevent="addCategory" class="add-form">
      <input
        v-model="name"
        type="text"
        placeholder="Enter category name"
        required
      />
      <button type="submit">+ Add New Category</button>
    </form>

    <!-- Table -->
    <table class="category-table">
      <thead>
        <tr>
          <th>Category Name</th>
          <th>Status</th>
          <th>Last Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>
            <span v-if="editId !== cat._id">{{ cat.name }}</span>
            <input
              v-else
              v-model="editName"
              type="text"
              placeholder="Update category"
            />
          </td>
          <td><span class="published">Published</span></td>
          <td>{{ formatDate(cat.updatedAt) }}</td>
          <td>
            <button
              v-if="editId !== cat._id"
              @click="startEdit(cat)"
              class="btn-icon edit"
            >
              Edit
            </button>

            <button
              v-if="editId === cat._id"
              @click="updateCategory(cat._id)"
              class="btn-icon save"
            >
              Save
            </button>

            <button @click="openDeleteModal(cat._id)" class="btn-icon delete">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <button class="close-btn" @click="closeDeleteModal">✖</button>
        <h3>Are you sure you want to permanently delete this category?</h3>
        <p>This change cannot be undone.</p>
        <div class="modal-actions">
          <button class="cancel" @click="closeDeleteModal">Cancel</button>
          <button class="confirm" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "../assets/styles/AddCategory.css"; // ✅ Import external CSS

export default {
  data() {
    return {
      name: "",
      categories: [],
      editId: null,
      editName: "",
      showDeleteModal: false,
      deleteId: null,
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        this.categories = res.data;
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    },
    async addCategory() {
      try {
        const res = await axios.post("http://localhost:5000/api/categories", {
          name: this.name,
        });
        this.categories.unshift(res.data);
        this.name = "";
      } catch (err) {
        alert(err.response?.data?.error || "Error adding category");
      }
    },
    startEdit(cat) {
      this.editId = cat._id;
      this.editName = cat.name;
    },
    async updateCategory(id) {
      try {
        const res = await axios.put(
          `http://localhost:5000/api/categories/${id}`,
          { name: this.editName },
        );
        const index = this.categories.findIndex((c) => c._id === id);
        if (index !== -1) this.categories[index] = res.data;
        this.editId = null;
        this.editName = "";
      } catch (err) {
        alert(err.response?.data?.error || "Error updating category");
      }
    },

    openDeleteModal(id) {
      this.deleteId = id;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteId = null;
    },
    async confirmDelete() {
      try {
        await axios.delete(
          `http://localhost:5000/api/categories/${this.deleteId}`,
        );
        this.categories = this.categories.filter(
          (c) => c._id !== this.deleteId,
        );
        this.closeDeleteModal();
      } catch (err) {
        alert(err.response?.data?.error || "Error deleting category");
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
  mounted() {
    this.fetchCategories();
  },
};
</script>
