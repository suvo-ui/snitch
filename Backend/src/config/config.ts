import dotenv from 'dotenv'

dotenv.config();

type CONFIG = {
    readonly MONGO_URI: string;
    readonly PORT: number;
    readonly JWT_SECRET: string;
    readonly GOOGLE_CLIENT_ID: string;
    readonly GOOGLE_CLIENT_SECRET: string;
    readonly FRONTEND_URL: string;
}

const config: CONFIG = {
    MONGO_URI: process.env.MONGO_URI!,
    PORT: Number(process.env.PORT!),
    JWT_SECRET: process.env.JWT_SECRET!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
}


export default config;