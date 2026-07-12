import axios from "axios";

const api = axios.create({
  baseURL: "https://realxr-website-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to log all requests and responses
api.interceptors.request.use(
  (config) => {
    console.log("🚀 Request:", config.method?.toUpperCase(), config.url);
    console.log("Headers:", config.headers);
    if (config.data) {
      console.log("Data:", config.data);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    console.log("Data:", response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        "❌ Response Error:",
        error.response.status,
        error.response.config.url,
      );
      console.error("Error Data:", error.response.data);
    } else {
      console.error("❌ Network Error:", error.message);
    }
    return Promise.reject(error);
  },
);


export default api;