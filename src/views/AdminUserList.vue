<template>
  <div class="admin-user-list">
    <h2>👑 All Users</h2>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Email</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Verified</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(user, index) in users" :key="user._id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.name || "-" }}</td>
          <td>{{ user.phone || "-" }}</td>
          <td>
            <span :class="user.isVerified ? 'verified' : 'not-verified'">
              {{ user.isVerified ? "✅ Verified" : "❌ Not Verified" }}
            </span>
          </td>
          <td>
            <button @click="openProfile(user)" class="view-btn">
              View Profile
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="selectedUser" class="modal-overlay" @click.self="closeProfile">
      <div class="modal">
        <h3>👤 User Profile</h3>

        <div class="profile-details">
          <section>
            <h4>🧾 Basic Info</h4>
            <p><strong>Email:</strong> {{ selectedUser.email }}</p>
            <p><strong>Name:</strong> {{ selectedUser.name || "N/A" }}</p>
            <p><strong>Phone:</strong> {{ selectedUser.phone || "N/A" }}</p>
            <p><strong>Role:</strong> {{ selectedUser.role }}</p>
          </section>

          <section v-if="selectedUser.storeName || selectedUser.storeAddress">
            <h4>🏪 Store Details</h4>
            <p>
              <strong>Store Name:</strong> {{ selectedUser.storeName || "N/A" }}
            </p>
            <p>
              <strong>Address:</strong> {{ selectedUser.storeAddress || "N/A" }}
            </p>
            <p>
              <strong>Landmark:</strong> {{ selectedUser.landmark || "N/A" }}
            </p>
            <p><strong>Pincode:</strong> {{ selectedUser.pincode || "N/A" }}</p>
          </section>

          <section>
            <h4>⚙️ Account Status</h4>
            <p>
              <strong>Verified:</strong>
              <span
                :class="selectedUser.isVerified ? 'verified' : 'not-verified'"
              >
                {{ selectedUser.isVerified ? "✅ Yes" : "❌ No" }}
              </span>
            </p>
            <p>
              <strong>Verification Status:</strong>
              <span class="badge">{{ selectedUser.verificationStatus }}</span>
            </p>
            <p>
              <strong>Active:</strong>
              <span :class="selectedUser.isActive ? 'active' : 'inactive'">
                {{ selectedUser.isActive ? "Active 🟢" : "Inactive 🔴" }}
              </span>
            </p>
            <p>
              <strong>Blocked:</strong>
              <span :class="selectedUser.isBlocked ? 'blocked' : 'not-blocked'">
                {{ selectedUser.isBlocked ? "Yes 🚫" : "No ✅" }}
              </span>
            </p>
          </section>

          <section>
            <h4>📅 Account Info</h4>
            <p>
              <strong>Created:</strong> {{ formatDate(selectedUser.createdAt) }}
            </p>
            <p>
              <strong>Updated:</strong> {{ formatDate(selectedUser.updatedAt) }}
            </p>
          </section>
        </div>

        <div class="modal-actions">
          <button
            @click="toggleVerification(selectedUser)"
            class="verify-btn"
            :class="selectedUser.isVerified ? 'unverify' : 'verify'"
          >
            {{
              selectedUser.isVerified ? "❌ Unverify User" : "✅ Verify User"
            }}
          </button>

          <button @click="closeProfile" class="close-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  name: "AdminUserList",
  data() {
    return {
      users: [],
      selectedUser: null,
    };
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await api.get("/auth/users");
        if (res.data.success) {
          this.users = res.data.users;
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    },
    openProfile(user) {
      this.selectedUser = { ...user }; // make a copy
    },
    closeProfile() {
      this.selectedUser = null;
    },
    formatDate(date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleString();
    },
    async toggleVerification(user) {
      try {
        const newStatus = !user.isVerified;
        const res = await api.put(`/auth/user/verify/${user._id}`, {
          isVerified: newStatus,
        });

        if (res.data.success) {
          user.isVerified = newStatus;
          this.selectedUser.isVerified = newStatus;
          await this.fetchUsers(); // refresh list
          alert(
            `User ${newStatus ? "verified ✅" : "unverified ❌"} successfully!`,
          );
        } else {
          alert("Failed to update verification status.");
        }
      } catch (err) {
        console.error("Verification update failed:", err);
        alert("Error verifying user. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.admin-user-list {
  padding: 30px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

th {
  background: #0984e3;
  color: white;
}

tr:hover {
  background: #f1f2f6;
}

.verified {
  color: #00b894;
  font-weight: bold;
}

.not-verified {
  color: #d63031;
  font-weight: bold;
}

.active {
  color: #00b894;
  font-weight: bold;
}

.inactive {
  color: #d63031;
  font-weight: bold;
}

.blocked {
  color: #d63031;
  font-weight: bold;
}

.not-blocked {
  color: #00b894;
  font-weight: bold;
}

.view-btn {
  background: #74b9ff;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: 0.3s;
}

.view-btn:hover {
  background: #0984e3;
}

/* --- Modal --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 25px 30px;
  border-radius: 10px;
  width: 500px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
}

.modal h3 {
  margin-bottom: 15px;
  color: #0984e3;
  text-align: center;
}

.profile-details section {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.profile-details h4 {
  color: #636e72;
  margin-bottom: 10px;
}

.profile-details p {
  margin: 8px 0;
  font-size: 15px;
  color: #2d3436;
}

.badge {
  background: #dfe6e9;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 13px;
  text-transform: capitalize;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.verify-btn {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  transition: 0.3s;
}

.verify {
  background: #00b894;
}

.verify:hover {
  background: #019874;
}

.unverify {
  background: #d63031;
}

.unverify:hover {
  background: #b32122;
}

.close-btn {
  background: #636e72;
  border: none;
  padding: 10px 14px;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: 0.3s;
}

.close-btn:hover {
  background: #2d3436;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
