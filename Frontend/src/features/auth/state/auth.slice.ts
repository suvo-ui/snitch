import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    user: {} | null;
    error: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    error: null,
    loading: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setUser, setLoading, setError } = authSlice.actions
export default authSlice.reducer