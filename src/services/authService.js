import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${API_BASE}/auth`;

export const login = (data) => axios.post(`${API}/login`, data);
export const register = (data) => axios.post(`${API}/register`, data);
