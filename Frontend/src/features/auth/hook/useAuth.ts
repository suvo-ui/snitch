import { setUser, setLoading, setError } from "../state/auth.slice";
import { register } from "../services/auth.api";
import { useDispatch } from "react-redux";
import type { Register } from "../type/auth.interface";

export const useAuth = () => {
    const dispatch = useDispatch()

    const handleRegister = async ({ name, username, email, password, isSeller = false }: Register) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await register({ name, username, email, password, isSeller });
            if (data) {
                dispatch(setUser(data));
            }
            return data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Registration failed";
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return { handleRegister }

}