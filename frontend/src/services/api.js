import axios from "axios";

const API = axios.create({
  baseURL: "https://inventory-management-sys-6sqp.onrender.com/api"
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});

export default API;