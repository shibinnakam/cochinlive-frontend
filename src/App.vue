<template>
  <div id="app">
    <!-- Navbar only visible when NOT on a dashboard, utility, or cart route -->
    <Navbar v-if="!isDashboard" @open-login="showLogin = true" />

    <!-- Main Page Content. This renders the currently matched component (Home, About, Admin, Staff, etc.) -->
    <router-view />

    <!-- Login Modal (reusing the Login.vue component as a modal) -->
    <LoginModal v-if="showLogin" @close="showLogin = false" />
  </div>
</template>

<script>
import Navbar from "@/components/AppNavbar.vue";
// Assuming you want to use the full Login component as a modal here.
import LoginModal from "@/views/Login.vue";

export default {
  name: "App",
  components: { Navbar, LoginModal },
  data() {
    return {
      showLogin: false,
    };
  },
  computed: {
    isDashboard() {
      // Hide the navbar on routes meant to be full-screen dashboards or standalone forms
      return (
        this.$route.path.startsWith("/admin") ||
        this.$route.path.startsWith("/staff") ||
        this.$route.path.startsWith("/user") ||
        this.$route.path.startsWith("/cart") ||
        this.$route.path.startsWith("/forgot-password")
      );
    },
  },
};
</script>

<style>
#app {
  /* This ensures the application takes up the whole screen without extra padding/margins */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
