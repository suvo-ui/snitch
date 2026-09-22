export interface Register {
    name: string;
    username: string;
    email: string;
    password: string;
    isSeller?: boolean;
}

export interface User {
    id?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    username?: string;
    email: string;
    role?: "buyer" | "seller";
}

export interface AuthResponse {
    message?: string;
    user?: User;
    token?: string;
}
