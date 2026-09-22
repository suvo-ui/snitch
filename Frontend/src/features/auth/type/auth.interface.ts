export interface Register {
    name?: string;
    fullName?: string;
    contactNumber?: string;
    username?: string;
    email: string;
    password: string;
    isSeller?: boolean;
}

export interface User {
    id?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    contactNumber?: string;
    username?: string;
    email: string;
    role?: "buyer" | "seller";
    isSeller?: boolean;
}

export interface AuthResponse {
    message?: string;
    user?: User;
    token?: string;
}
