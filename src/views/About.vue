<template>
  <div class="about-page">
    <img src="@/assets/bg.jpg" alt="About Top Banner" class="top-banner" />

    <div class="about-content">
      <div class="about-image" v-scroll-animation>
        <img src="@/assets/login-bg.jpg" alt="Who We Are" />
      </div>

      <div class="about-text-box" v-scroll-animation>
        <h2 class="cochinhead">Who We Are</h2>
        <div class="cochintext">
          <p>
            Cochin Distributors is a dedicated supplier of high-quality bakery
            products, committed to serving customers with efficiency,
            reliability, and innovation.
          </p>
          <p>
            We believe in empowering local businesses and maintaining strong
            relationships with our clients. Our focus is not just on delivering
            products but building trust and supporting growth in the food and
            distribution industry.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  directives: {
    // Directive for scroll-based fade-in and slide-up animation
    scrollAnimation: {
      mounted(el) {
        el.style.opacity = 0;
        el.style.transform = "translateY(30px)";
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                el.style.transition = "all 0.8s ease-out";
                el.style.opacity = 1;
                el.style.transform = "translateY(0)";
                observer.unobserve(el); // Stop observing once animated
              }
            });
          },
          { threshold: 0.2 }, // Start animation when 20% of the element is visible
        );
        observer.observe(el);
      },
    },
  },
  // The simple `data()` and `mounted()` for `visible` were removed as the `scrollAnimation` directive handles visibility.
};
</script>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh; /* Ensure it takes full height */
  padding-bottom: 50px; /* Add some space at the bottom */
}

/* Top banner */
.top-banner {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 30px;
}

/* Main content section */
.about-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px;
  gap: 50px;
  width: 90%;
  max-width: 1200px;
  flex-wrap: wrap;
}

/* Left-side image */
.about-image img {
  width: 300px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Text box with border and background */
.about-text-box {
  max-width: 600px;
  background-color: #f7f7f7;
  padding: 25px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cochinhead {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #2c3e50;
}

.cochintext p {
  font-size: 16px;
  line-height: 1.7;
  color: #444;
  margin-bottom: 12px;
  text-align: justify;
}
</style>

<style>
/* Scrollbar Styles - Very Light Green (Professional Look) */

/* Chrome, Safari, Edge */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f5fff5; /* Very light green background */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #b7e4c7; /* Soft green thumb */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #95d5b2; /* Darker on hover */
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #b7e4c7 #f5fff5;
}
</style>
