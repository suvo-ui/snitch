import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Protected from "../features/auth/components/Protected";
import RequireRoleSelection from "../features/auth/components/RequireRoleSelection";
import RoleSelection from "../features/auth/pages/RoleSelection";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import AllProducts from "../features/products/pages/AllProducts";
import ProductDetails from "../features/products/pages/ProductDetails";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <AllProducts />
      </Protected>
    ),
  },
  {
    path: "/products/:productId",
    element: (
      <Protected>
        <ProductDetails />
      </Protected>
    ),
  },
  {
    path: "/choose-role",
    element: (
      <RequireRoleSelection>
        <RoleSelection />
      </RequireRoleSelection>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/seller",
    children: [
      {
        path: "/seller/create-product",
        element: (
          <Protected requiredRole="seller">
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "/seller/dashboard",
        element: (
          <Protected requiredRole="seller">
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: "/seller/products/:productId",
        element: (
          <Protected requiredRole="seller">
            <SellerProductDetails />
          </Protected>
        ),
      },
    ],
  },
]);
