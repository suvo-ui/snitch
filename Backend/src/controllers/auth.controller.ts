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
        const user = await User.create({
            fullName: fullName || name,
            username,
            email,
            contact: contact || "",
            password,
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
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "strict",
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                });
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

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Must include .select("+password") because select: false is set in schema
        const user = await User.findOne({ email }).select("+password");
        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

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
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "strict",
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                });
                return res.status(200).json({
                    message: "Logged in successfully",
                    user: userWithoutPassword,
                    token
                });
            }
        );
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export { registerUser, loginUser };


