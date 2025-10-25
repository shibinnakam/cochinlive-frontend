<template>
  <div class="home-page">
    <div
      v-for="(bg, index) in backgrounds"
      :key="index"
      class="background-layer"
      :style="{ backgroundImage: `url(${bg})` }"
      :class="{ active: backgroundIndex === index }"
    ></div>

    <div class="main-content-wrapper">
      <header :class="{ scrolled: isScrolled }">
        <nav class="navbar">
          <div class="logo-area">
            <img src="@/assets/logo.png" alt="Logo" class="site-logo" />
            <span class="site-name">MyWebsite</span>
          </div>
          <ul class="nav-links">
            <li><router-link to="/" exact>Home</router-link></li>
            <li><router-link to="/about">About</router-link></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#contact">Contact</a></li>
            <li>
              <router-link to="/login" class="login-link">Login</router-link>
            </li>
          </ul>
        </nav>
      </header>

      <section class="hero">
        <h1>Welcome to My Website</h1>
        <p>Explore our products and services</p>
      </section>

      <section class="cochin-section">
        <div class="cochin-container">
          <div class="cochin-images" :class="{ 'slide-left': animate }">
            <img src="@/assets/bg.jpg" class="img-large" alt="Main" />
            <div class="img-small-column">
              <img src="@/assets/bakery1.jpg" class="img-small" alt="Bakery" />
              <img src="@/assets/logo.jpeg" class="img-small" alt="Logo" />
              <img
                src="@/assets/login-bg.jpg"
                class="img-small"
                alt="Login BG"
              />
              <img src="@/assets/logo.png" class="img-small" alt="Logo" />
            </div>
          </div>

          <div class="cochin-content" :class="{ 'slide-right': animate }">
            <h3 class="cochinhead">
              <span class="welcome-red">WELCOME TO</span><br />
              <strong>Cochin Distributors</strong>
            </h3>
            <p class="cochintext">
              At Cochin Distributors, we believe in delivering the finest
              quality baking products to every kitchen, whether you're a home
              baker or a commercial chef... Our selection includes premium
              flours, high-quality baking agents, and essential tools that make
              your baking easier and more delicious. With years of trusted
              service and a commitment to excellence, Cochin Distributors is
              your reliable partner in every recipe.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      isScrolled: false,
      animate: false, // For the cochin-section image/text slide animation
      backgroundIndex: 0,
      backgrounds: [
        // Ensure these paths are correct
        require("@/assets/bakery1.jpg"),
        require("@/assets/bakery2.jpg"),
        require("@/assets/bg.jpg"),
        require("@/assets/login-bg.jpg"),
      ],
      interval: null,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);

    // Start the animation for the Cochin section shortly after load
    setTimeout(() => {
      this.animate = true;
    }, 100);

    // Background slide show interval
    this.interval = setInterval(() => {
      this.backgroundIndex =
        (this.backgroundIndex + 1) % this.backgrounds.length;
    }, 5000); // Change background every 5 seconds
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    clearInterval(this.interval);
  },
  methods: {
    handleScroll() {
      // Toggle the 'scrolled' class on the header after scrolling past 50px
      this.isScrolled = window.scrollY > 50;
    },
  },
};
</script>

<style scoped>
.home-page {
  /* This is the container for the background layers */
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: #f5f5f5; /* Fallback/bottom color */
}

.main-content-wrapper {
  /* This wrapper holds all foreground content, sits above the backgrounds */
  position: relative;
  z-index: 2;
}

/* Background fade layers */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh; /* Only cover the viewport for the hero */
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  z-index: 1; /* Below the main content wrapper */
}
.background-layer.active {
  opacity: 1;
}

/* --- Navbar and Hero Styles --- */
header {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 10;
  transition: background-color 0.3s ease;
  padding: 0.8rem 2rem;
}
header.scrolled {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
.logo-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.site-logo {
  height: 40px;
  width: 40px;
}
.site-name {
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
}
header.scrolled .site-name {
  color: #333;
}
.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}
.nav-links a,
.nav-links .router-link-exact-active {
  text-decoration: none;
  font-weight: 500;
  color: white;
  transition: color 0.3s ease;
}
header.scrolled .nav-links a,
header.scrolled .nav-links .router-link-exact-active {
  color: #333;
}
.login-link {
  padding: 6px 12px;
  border: 1px solid white;
  border-radius: 4px;
  transition: all 0.3s ease;
}
header.scrolled .login-link {
  border-color: #333;
}
.login-link:hover {
  background-color: #007bff;
  color: white !important;
  border-color: #007bff;
}

.hero {
  height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 4rem;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
  position: relative;
  z-index: 1;
}

/* --- Cochin Section Styles --- */
.cochin-section {
  padding: 4rem 2rem; /* Added padding top/bottom */
  background-color: #fff;
  position: relative;
  z-index: 3; /* Ensure it covers background layers below the fold */
}

.cochin-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4rem; /* Increased gap for separation */
  align-items: flex-start;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}
.cochin-images {
  display: flex;
  gap: 1rem;
  opacity: 0;
  transform: translateX(-100%);
  transition: all 1s ease;
}
.cochin-content {
  max-width: 500px; /* Adjusted max-width */
  opacity: 0;
  transform: translateX(100%);
  transition: all 1s ease;
}
.cochinhead {
  margin: 0 0 1rem 0; /* Added bottom margin */
  font-size: 2rem; /* Slightly larger heading */
  line-height: 1.2;
}
.welcome-red {
  color: red;
  font-weight: bold;
  display: block; /* Make WELCOME TO its own line */
  font-size: 1rem;
}
.cochintext {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  text-align: justify;
}
.img-large {
  width: 250px; /* Adjusted size */
  height: 400px; /* Adjusted size */
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
.img-small-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.img-small {
  width: 250px;
  height: 195px; /* Adjusted size */
  object-fit: contain;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Slide-in classes */
.slide-left {
  transform: translateX(0);
  opacity: 1;
}
.slide-right {
  transform: translateX(0);
  opacity: 1;
}
</style>
