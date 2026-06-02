import axios from "axios";

const API = "https://modaclic-backend-production-35a0.up.railway.app/auth";

export const login = (data) => axios.post(`${API}/login`, data);
export const register = (data) => axios.post(`${API}/register`, data);
