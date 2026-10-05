import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { createProduct, getProducts } from "../services/product.api";
import { setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      const products = await getProducts();
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
          const products = await getProducts();
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

  return { fetchProducts, addProduct };
};
