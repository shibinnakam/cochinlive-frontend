<template>
  <div class="login-container">
    <div class="overlay"></div>
    <div class="login-form-section">
      <div :class="['login-box', isFilled ? 'box-filled' : '']">
        <img src="@/assets/logo.jpeg" alt="Company Logo" class="logo" />
        <h2 class="form-title">{{ formTitle }}</h2>

        <p class="signup-link">
          {{ toggleText }}
          <a href="#" @click.prevent="toggleMode">{{ toggleLinkText }}</a>
        </p>

        <form
          class="login-form"
          @submit.prevent="handleSubmit"
          @input="checkFilled"
          novalidate
        >
          <label for="email" class="sr-only">Email</label>
          <input
            type="email"
            id="email"
            v-model.trim="email"
            placeholder="Enter email"
            required
            autocomplete="username"
            :aria-invalid="emailError ? 'true' : 'false'"
          />
          <p v-if="emailError" class="error">{{ emailError }}</p>

          <div v-if="!isSignup">
            <label for="password" class="sr-only">Password</label>
            <input
              type="password"
              id="password"
              v-model.trim="password"
              placeholder="Enter password"
              required
              autocomplete="current-password"
              :aria-invalid="passwordError ? 'true' : 'false'"
            />
            <p v-if="passwordError" class="error">{{ passwordError }}</p>
          </div>

          <a
            v-if="!isSignup"
            href="#"
            class="forgot-password"
            @click.prevent="forgotPassword"
          >
            Forgot your password?
          </a>

          <button type="submit" class="login-button" :disabled="loading">
            <span v-if="loading">Processing...</span>
            <span v-else>{{ isSignup ? "Sign Up" : "Login" }}</span>
          </button>
        </form>

        <div class="google-login-section">
          <button class="google-button" @click="loginWithGoogle">
            <img src="@/assets/google-icon.png" alt="Google Logo" />
            Continue with Google
          </button>
        </div>

        <footer class="form-footer">
          <small>© 2025 CochinDistributors. All rights reserved.</small>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "@/assets/styles/Login.css";

export default {
  name: "LoginPage",
  data() {
    return {
      isSignup: false,
      email: "",
      password: "",
      isFilled: false,
      emailError: "",
      passwordError: "",
      loading: false,
      // 👇 Auto-detect environment (local vs Render)
      API_BASE:
        window.location.hostname === "localhost"
          ? "http://localhost:5000/api/auth"
          : "https://cochin-backendfinal.onrender.com/api/auth",
    };
  },
  computed: {
    formTitle() {
      return this.isSignup ? "Sign Up" : "Login";
    },
    toggleText() {
      return this.isSignup
        ? "Already have an account?"
        : "Don’t have an account?";
    },
    toggleLinkText() {
      return this.isSignup ? "Login" : "Create an account";
    },
  },
  methods: {
    toggleMode() {
      this.isSignup = !this.isSignup;
      this.resetForm();
    },
    loginWithGoogle() {
      window.location.href = `${this.API_BASE}/google`;
    },
    resetForm() {
      this.email = "";
      this.password = "";
      this.isFilled = false;
      this.emailError = "";
      this.passwordError = "";
    },
    checkFilled() {
      this.isFilled = this.isSignup
        ? this.email.trim() !== ""
        : this.email.trim() !== "" && this.password.trim() !== "";
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    async handleSubmit() {
      this.emailError = "";
      this.passwordError = "";

      if (!this.validateEmail(this.email)) {
        this.emailError = "Please enter a valid email address.";
        return;
      }

      this.loading = true;

      try {
        if (this.isSignup) {
          // Signup
          const { data } = await axios.post(`${this.API_BASE}/register-email`, {
            email: this.email,
          });
          alert(
            data.msg || "A password setup link has been sent to your email.",
          );
          this.toggleMode();
        } else {
          // Login
          const { data } = await axios.post(`${this.API_BASE}/login`, {
            email: this.email,
            password: this.password,
          });

          // Save token and user info
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          alert(`${data.user.role.toUpperCase()} login successful!`);

          // Redirect based on role
          switch (data.user.role) {
            case "user":
              this.$router.push("/user");
              break;
            case "admin":
              this.$router.push("/admin");
              break;
            case "staff":
              this.$router.push("/staff");
              break;
            default:
              this.$router.push("/");
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
        alert(
          err.response?.data?.msg ||
            "Something went wrong. Please try again later.",
        );
      } finally {
        this.loading = false;
      }
    },
    forgotPassword() {
      this.$router.push({ name: "ForgotPassword" });
    },
  },
};
</script>

<style scoped>
/* Local fallback style (main styles come from imported CSS) */
.auth-container {
  display: flex;
  height: 100vh;
}

.left-side {
  width: 50%;
  background-color: #000;
}

.left-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right-side {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
}

.form-box {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

input {
  display: block;
  margin: 0.5rem 0;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 0.5rem;
}

.switch-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.switch-link span {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}
</style>
