import { setUser, setLoading, setError } from "../state/auth.slice";
import { register, login } from "../services/auth.api";
import { useDispatch, useSelector } from "react-redux";
import type { Register } from "../type/auth.interface";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state: { auth: { user: any; loading: boolean; error: string | null } }) => state.auth);

    const handleRegister = async (data: Register) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const responseData = await register(data);
            if (responseData) {
                dispatch(setUser(responseData));
                if (responseData.token) {
                    localStorage.setItem("token", responseData.token);
                }
            }
            return responseData;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please try again.";
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
                dispatch(setUser(responseData));
                if (responseData.token) {
                    localStorage.setItem("token", responseData.token);
                }
            }
            return responseData;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Login failed. Please try again.";
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
        handleLogin
    };
};