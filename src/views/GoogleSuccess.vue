<template>
  <div class="google-success">
    <p>Logging you in...</p>
  </div>
</template>

<script>
export default {
  name: "GoogleSuccess",
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = JSON.parse(decodeURIComponent(urlParams.get("user")));

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "staff") {
        this.$router.push("/staff");
      } else {
        this.$router.push("/user");
      }
    } else {
      this.$router.push("/login");
    }
  },
};
</script>
