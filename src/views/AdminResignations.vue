<template>
  <div>
    <h2>Staff Resignations</h2>
    <table border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Date of Joining</th>
          <th>Resignation Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in resignations" :key="r._id">
          <td>{{ r.staffId.name }}</td>
          <td>{{ r.staffId.email }}</td>
          <td>{{ new Date(r.staffId.dateOfJoining).toLocaleDateString() }}</td>
          <td>{{ new Date(r.appliedAt).toLocaleDateString() }}</td>
          <td>{{ r.status }}</td>
          <td>
            <button
              v-if="r.status === 'pending'"
              @click="decide(r._id, 'approved')"
            >
              Approve
            </button>
            <button
              v-if="r.status === 'pending'"
              @click="decide(r._id, 'rejected')"
            >
              Reject
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      resignations: [],
    };
  },
  created() {
    this.fetchResignations();
  },
  methods: {
    async fetchResignations() {
      try {
        const res = await axios.get("/resignations/all");
        this.resignations = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    async decide(id, status) {
      try {
        await axios.put(`/resignations/${id}/decision`, { status });
        this.fetchResignations(); // refresh list
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
