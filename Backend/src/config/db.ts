import mongoose from "mongoose";
import config from "./config.js";

export default async function connectToDB() {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log(`MongoDB Connected to ${config.MONGO_URI.split('@')[1]}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}