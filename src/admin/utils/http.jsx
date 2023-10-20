import axios from "axios";
import { getUserData } from "./function";
const userData = getUserData();
function createHttp() {
  return axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userData?.token}`,
    },
  });
}

export const http = createHttp();
