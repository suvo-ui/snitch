import { Router } from "express";
import { validateRegister, validateLogin } from "../validation/auth.validator.js";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', validateRegister, registerUser)
router.post('/login', validateLogin, loginUser)

export default router