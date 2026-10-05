import axios from "axios";

export interface Product {
  id?: string | number;
  _id?: string;
  title?: string;
  description?: string;
  price?: {
    amount: number;
    currency: string;
  };
  images?: Array<{ url: string; alt?: string }>;
  [key: string]: unknown;
}

export type ProductPayload = FormData | Partial<Product> | Record<string, unknown>;

const apiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true, // Include credentials for cross-origin requests
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function createProduct(productData: ProductPayload): Promise<Product> {
  try {
    const response = await apiInstance.post("/", productData);
    return (response.data.product || response.data) as Product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function getSellerProducts(): Promise<Product[]> {
  try {
    const response = await apiInstance.get("/seller");
    return response.data.products as Product[];
  } catch (error) {
    console.error("Error fetching seller products:", error);
    throw error;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await apiInstance.get("/");
    return response.data.products as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductById(productId: string): Promise<Product> {
  try {
    const response = await apiInstance.get(`/products/${productId}`);
    return response.data.product as Product;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
}