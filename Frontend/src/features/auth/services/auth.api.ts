import axios from "axios";
import type { Register } from "../type/auth.interface";

const authApiInstance = axios.create({
    baseURL: "/api/auth",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

authApiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register(userData: Register) {
    try {
        const payload = {
            ...userData,
            name: userData.fullName || userData.name || "",
            username: userData.username || userData.email.split("@")[0],
        };
        const response = await authApiInstance.post("/register", payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function login(email: string, password: string) {
    try {
        const response = await authApiInstance.post("/login", { email, password })
        return response.data
    } catch (error) {
        throw error
    }
}