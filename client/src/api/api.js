// src/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "https://logictraceai.onrender.com"
});

// Interceptor for future auth
// api.interceptors.request.use(config => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default api;
