import express from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import {
  createProduct,
  getProducts,
} from "../controllers/product.controller.js";
import { validateCreateProduct } from "../validation/product.validator.js";
import multer from "multer";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

router.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),
  validateCreateProduct,
  createProduct,
);

router.get("/seller", authenticateSeller, getProducts);

export default router;
