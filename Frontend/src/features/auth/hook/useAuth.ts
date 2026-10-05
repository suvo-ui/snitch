import axios from "axios";
import { useCallback } from "react";
import { setUser, setLoading, setError } from "../state/auth.slice";
import {
  register,
  login,
  getCurrentUser,
  selectAccountRole,
} from "../services/auth.api";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/app.store";
import type { Register } from "../type/auth.interface";

const getAuthErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  const hydrateUser = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const responseData = await getCurrentUser();
      if (responseData?.user) {
        dispatch(setUser(responseData.user));
      } else {
        dispatch(setUser(null));
      }
      return responseData;
    } catch {
      dispatch(setUser(null));
      localStorage.removeItem("token");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleRegister = async (data: Register) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const responseData = await register(data);
      if (responseData) {
        dispatch(setUser(responseData.user ?? null));
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }
      }
      return responseData;
    } catch (error: unknown) {
      dispatch(
        setError(
          getAuthErrorMessage(
            error,
            "Registration failed. Please try again.",
          ),
        ),
      );
      throw error;
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
        dispatch(setUser(responseData.user ?? null));
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }
      }
      return responseData;
    } catch (error: unknown) {
      dispatch(
        setError(getAuthErrorMessage(error, "Login failed. Please try again.")),
      );
      throw error;
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
    } catch (error: unknown) {
      dispatch(
        setError(
          getAuthErrorMessage(error, "Unable to save your account role."),
        ),
      );
      throw error;
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
