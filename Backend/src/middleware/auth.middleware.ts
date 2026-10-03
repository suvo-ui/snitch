import User from "../models/user.models.js";
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res
      .status(500)
      .json({ message: "Internal server error", error: message });
  }
};

export const authenticateSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return res.status(401).json({ message: "Access denied. Invalid token." });
    }

    const user = await User.findById(decoded.id);

    if (!user || user.role !== "seller") {
      return res
        .status(403)
        .json({ message: "Access denied. Seller privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res
      .status(500)
      .json({ message: "Internal server error", error: message });
  }
};
