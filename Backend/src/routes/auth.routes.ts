import { Router } from "express";
import {
  validateRegister,
  validateLogin,
} from "../validation/auth.validator.js";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import passport from "passport";
import { googleCallback } from "../controllers/auth.controller.js";
const router = Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallback,
);

export default router;
