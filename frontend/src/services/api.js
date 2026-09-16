import axios from "axios";

export const geocodingApi = axios.create({
  baseURL: "https://api.bigdatacloud.net/data",
});

export const locationSearchApi = axios.create({
  baseURL: "https://nominatim.openstreetmap.org",
  headers: {
    "Accept-Language": "en",
  },
});
