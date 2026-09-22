import { Router } from "express";
import { validateRegister } from "../validation/auth.validator.js";
import { registerUser } from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', validateRegister, registerUser)

export default router