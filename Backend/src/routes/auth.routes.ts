import { Router } from "express";
import {
  validateRegister,
  validateLogin,
} from "../validation/auth.validator.js";
import {
  registerUser,
  loginUser,
  googleCallback,
  getCurrentUser,
  selectAccountRole,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import passport from "passport";
import config from "../config/config.js";

const router = Router();
const frontendLoginUrl = `${config.FRONTEND_URL.replace(/\/$/, "")}/login`;

router.get("/me", authenticateUser, getCurrentUser);
router.patch("/role", authenticateUser, selectAccountRole);
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: frontendLoginUrl,
    session: false,
  }),
  googleCallback,
);

export default router;
