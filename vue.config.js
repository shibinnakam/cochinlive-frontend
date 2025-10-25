const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    allowedHosts: "all", // ✅ Fixes "Invalid Host header" when using Netlify, ngrok, or remote tunnels

    proxy: {
      "/api": {
        target: "http://localhost:5000", // 👈 your Node.js/Express backend
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" }, // keeps /api prefix in requests
      },
    },
  },
});
