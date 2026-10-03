import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Protected from "../features/auth/components/Protected";
import RequireRoleSelection from "../features/auth/components/RequireRoleSelection";
import RoleSelection from "../features/auth/pages/RoleSelection";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <h1 className="text-5xl underline p-8">Hello World</h1>
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
]);
