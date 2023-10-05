import axios from "axios";

function createHttp() {
  return axios.create({
    baseURL: "http://localhost:8000/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const http = createHttp();
