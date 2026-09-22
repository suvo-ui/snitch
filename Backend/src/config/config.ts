import dotenv from 'dotenv'

dotenv.config();

type CONFIG = {
    readonly MONGO_URI: string;
    readonly PORT: number;
    readonly JWT_SECRET: string;
}

const config: CONFIG = {
    MONGO_URI: process.env.MONGO_URI!,
    PORT: Number(process.env.PORT!),
    JWT_SECRET: process.env.JWT_SECRET!,
}


export default config;