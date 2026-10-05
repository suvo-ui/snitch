import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  createProduct,
  getProductById,
  getSellerProducts,
} from "../services/product.api";
import {
  setSellerProducts,
  setProducts,
  setProduct,
} from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const fetchSellerProducts = useCallback(async (): Promise<void> => {
    try {
      const products = await getSellerProducts();
      dispatch(setSellerProducts(products));
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }, [dispatch]);

  const addProduct = useCallback(
    async (productData: Parameters<typeof createProduct>[0]) => {
      try {
        const newProduct = await createProduct(productData);
        try {
          const products = await getSellerProducts();
          dispatch(setSellerProducts(products || [newProduct]));
        } catch {
          dispatch(setSellerProducts([newProduct]));
        }
        return newProduct;
      } catch (error) {
        console.error("Error creating product:", error);
        throw error;
      }
    },
    [dispatch],
  );

  const fetchAllProducts = useCallback(async (): Promise<void> => {
    try {
      const products = await getSellerProducts();
      dispatch(setProducts(products));
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  }, [dispatch]);

  const fetchProductById = useCallback(
    async (productId: string): Promise<void> => {
      try {
        const product = await getProductById(productId);
        dispatch(setProduct(product));
      } catch (error) {
        console.error(`Error fetching product with ID ${productId}:`, error);
        throw error;
      }
    },
    [dispatch],
  );

  return {
    fetchSellerProducts,
    addProduct,
    fetchAllProducts,
    fetchProductById,
  };
};
