import axios from "axios";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: "https://mw8st9-8081.csb.app/api",
  withCredentials: true, // This is crucial for sending cookies with requests
  timeout: 10000,
});

export default api;
