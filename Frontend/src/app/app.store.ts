import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice";
import productReducer from "../features/products/state/product.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
