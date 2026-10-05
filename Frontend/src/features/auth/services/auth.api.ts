import axios from "axios";
import type { AuthResponse, Register } from "../type/auth.interface";

const authApiInstance = axios.create({
  baseURL: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

authApiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register(userData: Register) {
  const payload = {
    ...userData,
    name: userData.fullName || userData.name || "",
    username: userData.username || userData.email.split("@")[0],
  };
  const response = await authApiInstance.post<AuthResponse>("/register", payload);
  return response.data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await authApiInstance.post<AuthResponse>("/login", {
    email,
    password,
  });
  return response.data;
}

export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await authApiInstance.get<AuthResponse>("/me");
  return response.data;
}

export async function selectAccountRole(
  role: "buyer" | "seller",
): Promise<AuthResponse> {
  const response = await authApiInstance.patch<AuthResponse>("/role", { role });
  return response.data;
}
