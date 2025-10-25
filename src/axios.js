// src/axios.js
import axios from "axios";

// ✅ Create an Axios instance with your backend base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Change if backend URL differs in production
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Optional: handle expired tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
