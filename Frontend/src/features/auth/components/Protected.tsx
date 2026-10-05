import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import type { RootState } from "../../../app/app.store";

interface ProtectedProps {
  children: ReactNode;
  requiredRole?: "buyer" | "seller";
}

const Protected = ({ children, requiredRole }: ProtectedProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.roleSelectionRequired) {
    return <Navigate to="/choose-role" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;
