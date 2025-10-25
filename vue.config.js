// vue.config.js
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all", // ✅ This line fixes "Invalid Host header"
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your Node.js backend
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" },
      },
    },
  },
});
