import axios from "axios";
import type { Register } from "../type/auth.interface";

const authApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

authApiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export async function register({ name, username, email, password, isSeller }: Register) {
    try {
        const response = await authApiInstance.post("/register", { name, username, email, password, isSeller });
        return response.data;
    } catch (error) {
        throw error;
    }
}