import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
  timeout: 10_000,
});

export default apiClient;
