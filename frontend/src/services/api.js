import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const geocodingApi = axios.create({
  baseURL: "https://api.bigdatacloud.net/data",
});

export const locationSearchApi = axios.create({
  baseURL: "https://nominatim.openstreetmap.org",
  headers: {
    "Accept-Language": "en",
  },
});

export default api;
