import "./App.css";
import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { routes } from "./app.route";
import { useAuth } from "../features/auth/hook/useAuth";

function App() {
  const { hydrateUser } = useAuth();

  useEffect(() => {
    hydrateUser();
  }, []);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
