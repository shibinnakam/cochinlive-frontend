<template>
  <div class="profile-page">
    <header class="profile-header">
      <h2>
        <i class="fas fa-user-circle"></i> User Profile
        <span v-if="user?.isVerified" class="verified-tick">✔️</span>
      </h2>
    </header>

    <div v-if="user" class="profile-container">
      <form @submit.prevent="saveProfile" class="profile-form">
        <!-- Email -->
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="user.email" disabled />
        </div>

        <!-- Name -->
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            v-model="user.name"
            placeholder="Enter your name"
            @blur="validateName"
          />
          <p v-if="errors.name" class="error">{{ errors.name }}</p>
        </div>

        <!-- Phone -->
        <div class="form-group">
          <label>Phone</label>
          <input
            type="text"
            v-model="user.phone"
            placeholder="Enter phone number"
            @blur="validatePhone"
          />
          <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
        </div>

        <!-- Pincode -->
        <div class="form-group">
          <label>Pincode</label>
          <input
            type="text"
            v-model="user.pincode"
            placeholder="Enter pincode"
            @blur="validatePincode"
          />
          <p v-if="errors.pincode" class="error">{{ errors.pincode }}</p>
        </div>

        <!-- Store Name -->
        <div class="form-group">
          <label>Store Name</label>
          <input
            type="text"
            v-model="user.storeName"
            placeholder="Enter store name"
            @blur="validateStoreName"
          />
          <p v-if="errors.storeName" class="error">{{ errors.storeName }}</p>
        </div>

        <!-- Store Address -->
        <div class="form-group">
          <label>Store Address</label>
          <input
            type="text"
            v-model="user.storeAddress"
            placeholder="Enter store address"
            @blur="validateStoreAddress"
          />
          <p v-if="errors.storeAddress" class="error">
            {{ errors.storeAddress }}
          </p>
        </div>

        <!-- Landmark -->
        <div class="form-group">
          <label>Landmark</label>
          <input
            type="text"
            v-model="user.landmark"
            placeholder="Enter landmark"
            @blur="validateLandmark"
          />
          <p v-if="errors.landmark" class="error">{{ errors.landmark }}</p>
        </div>

        <!-- Password -->
        <div v-if="!user.googleId" class="form-group password-section">
          <label>Change Password</label>
          <input
            type="password"
            v-model="newPassword"
            placeholder="Enter new password"
            @blur="validatePassword"
          />
          <p v-if="errors.password" class="error">{{ errors.password }}</p>
        </div>

        <!-- Save Button -->
        <button
          type="submit"
          class="save-btn"
          :disabled="saving || !isFormValid"
        >
          <span v-if="saving">⏳ Saving...</span>
          <span v-else>💾 Save Profile</span>
        </button>

        <!-- Admin verify -->
        <div v-if="isAdmin" class="verify-section">
          <button
            class="verify-btn"
            :class="user.isVerified ? 'unverify' : 'verify'"
            @click.prevent="toggleVerification"
          >
            {{ user.isVerified ? "❌ Unverify User" : "✅ Verify User" }}
          </button>
        </div>

        <!-- Messages -->
        <p v-if="message" :class="['message', messageType]">{{ message }}</p>
      </form>
    </div>

    <div v-else class="no-user">
      <p>No user data found. Please log in again.</p>
      <router-link to="/login" class="login-btn">Login</router-link>
    </div>
  </div>
</template>

<script>
import api from "@/axios";
import "@/assets/styles/ProfilePage.css";

export default {
  name: "ProfilePage",
  data() {
    return {
      user: null,
      newPassword: "",
      loggedUser: null,
      isAdmin: false,
      message: "",
      messageType: "",
      saving: false,
      errors: {},
    };
  },
  computed: {
    isFormValid() {
      return (
        Object.values(this.errors).every((e) => !e) &&
        this.user?.name &&
        this.user?.phone &&
        this.user?.pincode &&
        this.user?.storeName &&
        this.user?.storeAddress &&
        this.user?.landmark
      );
    },
  },
  async created() {
    await this.loadUser();
  },
  methods: {
    async loadUser() {
      try {
        this.loggedUser = JSON.parse(localStorage.getItem("user"));
        if (!this.loggedUser) {
          this.$router.push("/login");
          return;
        }

        const userId =
          this.$route.params.userId ||
          this.loggedUser._id ||
          this.loggedUser.id;

        this.isAdmin = this.loggedUser.role === "admin";

        const res = await api.get(`/auth/user/${userId}`);
        this.user = res.data.success ? res.data.user : this.loggedUser;
      } catch (err) {
        console.error("Error loading user:", err);
      }
    },

    // ================= VALIDATIONS =================

    validateName() {
      const raw = this.user.name ?? "";
      if (/^\s/.test(raw))
        return (this.errors.name = "Name cannot start with a space.");
      const name = raw.trim();
      if (!name) return (this.errors.name = "Name is required.");
      if (name.length < 4)
        return (this.errors.name = "Name must be at least 4 characters.");
      if (name.split(" ").length > 4)
        return (this.errors.name = "Maximum 3 spaces allowed.");
      if (!/^[A-Za-z ]+$/.test(name))
        return (this.errors.name =
          "Only letters and spaces allowed, no numbers or symbols.");
      this.errors.name = "";
    },

    validatePhone() {
      const phone = this.user.phone?.trim() || "";
      if (!phone) return (this.errors.phone = "Phone number is required.");
      if (!/^[6-9]\d{9}$/.test(phone))
        return (this.errors.phone =
          "Enter a valid 10-digit Indian phone number (starts with 6-9).");
      this.errors.phone = "";
    },

    validatePincode() {
      const pin = this.user.pincode?.trim() || "";
      if (!pin) return (this.errors.pincode = "Pincode is required.");
      if (!/^\d{6}$/.test(pin))
        return (this.errors.pincode = "Pincode must be exactly 6 digits.");
      this.errors.pincode = "";
    },

    validateStoreName() {
      const raw = this.user.storeName ?? "";
      if (/^\s/.test(raw))
        return (this.errors.storeName = "Cannot start with a space.");
      const name = raw.trim();
      if (!name) return (this.errors.storeName = "Store name is required.");
      if (name.length > 25)
        return (this.errors.storeName = "Max 25 characters allowed.");
      if (name.split(" ").length > 4)
        return (this.errors.storeName = "Maximum 3 spaces allowed.");
      if (/^\d{5,}$/.test(name))
        return (this.errors.storeName =
          "Cannot contain only numbers (up to 4 digits allowed).");
      this.errors.storeName = "";
    },

    validateStoreAddress() {
      const raw = this.user.storeAddress ?? "";
      if (/^\s/.test(raw))
        return (this.errors.storeAddress = "Cannot start with a space.");
      const addr = raw.trim();
      if (!addr) return (this.errors.storeAddress = "Address is required.");
      if (addr.length > 30)
        return (this.errors.storeAddress = "Max 30 characters allowed.");
      if (addr.split(" ").length > 5)
        return (this.errors.storeAddress = "Maximum 4 spaces allowed.");
      this.errors.storeAddress = "";
    },

    validateLandmark() {
      const raw = this.user.landmark ?? "";
      if (/^\s/.test(raw))
        return (this.errors.landmark = "Cannot start with a space.");
      const landmark = raw.trim();
      if (!landmark)
        return (this.errors.landmark = "Landmark field is required.");
      if (landmark.length < 4)
        return (this.errors.landmark =
          "Landmark must be at least 4 characters long.");
      if (landmark.length > 15)
        return (this.errors.landmark = "Maximum 15 characters allowed.");
      this.errors.landmark = "";
    },

    validatePassword() {
      const raw = this.newPassword ?? "";
      if (!raw) return (this.errors.password = "");
      if (/^\s/.test(raw))
        return (this.errors.password = "Password cannot start with a space.");
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!regex.test(raw.trim()))
        return (this.errors.password =
          "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number & 1 special symbol.");
      this.errors.password = "";
    },

    // ==================================================

    async saveProfile() {
      this.validateName();
      this.validatePhone();
      this.validatePincode();
      this.validateStoreName();
      this.validateStoreAddress();
      this.validateLandmark();
      this.validatePassword();

      if (!this.isFormValid) return;

      this.saving = true;
      try {
        const userId = this.user._id || this.user.id;
        const payload = { ...this.user };
        if (this.newPassword && !this.user.googleId)
          payload.password = this.newPassword.trim();

        const res = await api.put(`/auth/user/update/${userId}`, payload);
        if (res.data.success) {
          this.user = res.data.user;
          localStorage.setItem("user", JSON.stringify(res.data.user));
          this.newPassword = "";
          this.showMessage("✅ Profile saved successfully!", "success");
        } else {
          this.showMessage("❌ Failed to save profile.", "error");
        }
      } catch (err) {
        console.error("Error saving profile:", err);
        this.showMessage("⚠️ Could not save profile. Try again.", "error");
      } finally {
        this.saving = false;
      }
    },

    async toggleVerification() {
      try {
        const res = await api.put(`/auth/user/verify/${this.user._id}`);
        if (res.data.success) {
          this.user = res.data.user;
          this.showMessage(res.data.message, "success");
        }
      } catch (err) {
        console.error("Error toggling verification:", err);
        this.showMessage("Failed to update verification status.", "error");
      }
    },

    showMessage(msg, type) {
      this.message = msg;
      this.messageType = type;
      setTimeout(() => (this.message = ""), 4000);
    },
  },
};
</script>

<style scoped>
.error {
  color: #ff4d4f;
  font-size: 0.85rem;
  margin-top: 3px;
}
</style>
