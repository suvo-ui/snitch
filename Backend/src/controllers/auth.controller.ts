import User from "../models/user.models.js";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fullName, name, username, email, contact, password, isSeller } =
      req.body;
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
      role: isSeller ? "seller" : "buyer",
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
        }
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        return res.status(201).json({
          message: "User created successfully",
          user: userWithoutPassword,
          token,
        });
      },
    );
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
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
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
        }
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        return res.status(200).json({
          message: "Logged in successfully",
          user: userWithoutPassword,
          token,
        });
      },
    );
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const googleUser = req.user as
    | {
        id: string;
        displayName: string;
        emails?: Array<{ value: string }>;
      }
    | undefined;

  if (
    !googleUser?.id ||
    !googleUser.displayName ||
    !googleUser.emails?.[0]?.value
  ) {
    return res.status(400).json({ message: "Invalid Google profile" });
  }

  const { id, displayName } = googleUser;
  const email = googleUser.emails[0].value;

  let user = await User.findOne({
    email,
  });

  if (!user) {
    user = await User.create({
      email,
      googleId: id,
      fullName: displayName,
      roleSelectionRequired: true,
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  const frontendUrl = config.FRONTEND_URL || "http://localhost:5173";
  const redirectPath = user.roleSelectionRequired ? "/choose-role" : "/";
  res.redirect(`${frontendUrl.replace(/\/$/, "")}${redirectPath}`);
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        contact: user.contact,
        role: user.role,
        roleSelectionRequired: user.roleSelectionRequired === true,
        googleId: user.googleId,
      },
      token,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const selectAccountRole = async (req: Request, res: Response) => {
  const selectedRole = req.body?.role;
  if (selectedRole !== "buyer" && selectedRole !== "seller") {
    return res
      .status(400)
      .json({ message: "A valid account role is required" });
  }

  const authenticatedUser = req.user as { id: string } | undefined;
  if (!authenticatedUser?.id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: authenticatedUser.id, roleSelectionRequired: true },
      { $set: { role: selectedRole, roleSelectionRequired: false } },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res
        .status(409)
        .json({ message: "Role selection is not pending for this account" });
    }

    return res.status(200).json({
      message: "Account role saved",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        contact: user.contact,
        role: user.role,
        roleSelectionRequired: false,
        googleId: user.googleId,
      },
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Unable to save account role", error: error.message });
  }
};

export {
  registerUser,
  loginUser,
  googleCallback,
  getCurrentUser,
  selectAccountRole,
};
