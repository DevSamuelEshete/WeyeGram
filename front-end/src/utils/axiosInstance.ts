import axios from "axios";
import { BASE_URI } from "../constants";

const axiosInstance = axios.create({
  baseURL: BASE_URI,
  withCredentials: true,
});

export default axiosInstance;
