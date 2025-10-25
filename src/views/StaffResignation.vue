<template>
  <div class="resignation-form">
    <h2>Apply for Resignation</h2>
    <textarea
      v-model="reason"
      placeholder="Enter your resignation reason"
    ></textarea>
    <button @click="applyResignation">Submit</button>
    <p v-if="message" :class="{ error: isError }">{{ message }}</p>
  </div>
</template>

<script>
import axios from "../axios"; // your configured axios with baseURL

export default {
  data() {
    return {
      reason: "",
      staffId: "", // store staff ID here
      message: "",
      isError: false,
    };
  },
  async mounted() {
    try {
      // 🧠 Fetch staff data from localStorage
      const storedStaff = localStorage.getItem("staffData");

      if (storedStaff) {
        const staff = JSON.parse(storedStaff);
        this.staffId = staff._id || staff.id; // handle either _id or id field
      } else {
        this.message = "Missing staff ID. Please log in again.";
        this.isError = true;
      }
    } catch (err) {
      console.error("Error loading staff data:", err);
      this.message = "Error loading staff details. Please re-login.";
      this.isError = true;
    }
  },
  methods: {
    async applyResignation() {
      this.isError = false;

      if (!this.reason) {
        this.message = "Reason is required";
        this.isError = true;
        return;
      }

      if (!this.staffId) {
        this.message = "Missing staff ID. Please log in again.";
        this.isError = true;
        return;
      }

      try {
        const res = await axios.post("/resignations/apply", {
          reason: this.reason,
          staffId: this.staffId, // ✅ Now included
        });

        this.message = res.data.message;
        this.reason = "";
      } catch (error) {
        console.error("Error applying resignation:", error);
        this.isError = true;

        if (error.response) {
          this.message = error.response.data.message || "Server error";
        } else {
          this.message = "Network or server error";
        }
      }
    },
  },
};
</script>

<style scoped>
.resignation-form {
  max-width: 500px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
}
textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 8px;
  font-size: 14px;
  resize: vertical;
}
button {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
button:hover {
  background-color: #0056b3;
}
p {
  margin-top: 10px;
  font-weight: bold;
}
p.error {
  color: red;
}
p:not(.error) {
  color: green;
}
</style>
