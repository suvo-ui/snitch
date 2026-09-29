import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1 className="text-5xl underline p-8">Hello World</h1>,
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
