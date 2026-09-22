import User from "../models/user.models.js";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, name, username, email, contact, password, isSeller } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName: fullName || name,
            username,
            email,
            contact: contact || "",
            password: hashedPassword,
            role: isSeller ? 'seller' : "buyer"
        });

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        jwt.sign(
            { id: user._id },
            config.JWT_SECRET,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) {
                    return res.status(500).json({ message: "Internal server error", error: err.message });
                }
                return res.status(201).json({ message: "User created successfully", user: userWithoutPassword, token });
            }
        );
    } catch (error: any) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export { registerUser };
