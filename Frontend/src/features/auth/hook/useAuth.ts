import { setUser, setLoading, setError } from "../state/auth.slice";
import {
  register,
  login,
  getCurrentUser,
  selectAccountRole,
} from "../services/auth.api";
import { useDispatch, useSelector } from "react-redux";
import type { Register } from "../type/auth.interface";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(
    (state: { auth: { user: any; loading: boolean; error: string | null } }) =>
      state.auth,
  );

  const hydrateUser = async () => {
    try {
      dispatch(setLoading(true));
      const responseData = await getCurrentUser();
      if (responseData?.user) {
        dispatch(setUser(responseData.user));
      }
      return responseData;
    } catch (err: any) {
      dispatch(setUser(null));
      localStorage.removeItem("token");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRegister = async (data: Register) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const responseData = await register(data);
      if (responseData) {
        dispatch(setUser(responseData.user || responseData));
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }
      }
      return responseData;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const responseData = await login(email, password);
      if (responseData) {
        dispatch(setUser(responseData.user || responseData));
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }
      }
      return responseData;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSelectRole = async (role: "buyer" | "seller") => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const responseData = await selectAccountRole(role);
      if (responseData?.user) {
        dispatch(setUser(responseData.user));
      }
      return responseData;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to save your account role.";
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    loading,
    error,
    handleRegister,
    handleLogin,
    handleSelectRole,
    hydrateUser,
  };
};
