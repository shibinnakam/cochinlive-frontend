<template>
  <div class="resignation-admin">
    <h2>Resignation Requests</h2>

    <div v-if="resignations.length === 0" class="empty">
      No resignation requests
    </div>

    <div
      v-for="res in resignations"
      :key="res._id"
      class="resignation-card"
      :class="res.status"
    >
      <p><b>Staff:</b> {{ res.staffId?.name }} ({{ res.staffId?.email }})</p>
      <p><b>Reason:</b> {{ res.reason }}</p>
      <p>
        <b>Status:</b> <span class="status">{{ res.status }}</span>
      </p>
      <p v-if="res.adminComment">
        <b>Admin Comment:</b> {{ res.adminComment }}
      </p>

      <div v-if="res.status === 'pending'" class="actions">
        <textarea
          v-model="res.adminComment"
          placeholder="Add admin comment (optional)"
        ></textarea>
        <button
          class="approve"
          @click="decide(res._id, 'approved', res.adminComment)"
        >
          ✅ Approve
        </button>
        <button
          class="reject"
          @click="decide(res._id, 'rejected', res.adminComment)"
        >
          ❌ Reject
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  data() {
    return {
      resignations: [],
    };
  },
  async created() {
    await this.loadResignations();
  },
  methods: {
    async loadResignations() {
      try {
        const res = await axios.get("/resignations/all");
        this.resignations = res.data;
      } catch (error) {
        console.error(error);
        alert("Failed to fetch resignation requests");
      }
    },
    async decide(id, status, adminComment) {
      try {
        const res = await axios.put(`/resignations/${id}/decision`, {
          status,
          adminComment,
        });
        alert(res.data.message);
        await this.loadResignations();
      } catch (error) {
        console.error(error);
        alert("Error processing resignation");
      }
    },
  },
};
</script>

<style scoped>
.resignation-admin {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}
.resignation-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  background: #fff;
  transition: 0.3s;
}
.resignation-card.pending {
  border-left: 5px solid orange;
}
.resignation-card.approved {
  border-left: 5px solid green;
  background: #f0fff0;
}
.resignation-card.rejected {
  border-left: 5px solid red;
  background: #fff5f5;
}
.status {
  text-transform: capitalize;
  font-weight: bold;
}
.actions {
  margin-top: 10px;
}
textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  font-size: 14px;
  resize: vertical;
}
button {
  margin-right: 10px;
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button.approve {
  background: green;
  color: white;
}
button.reject {
  background: red;
  color: white;
}
.empty {
  text-align: center;
  color: #666;
}
</style>
