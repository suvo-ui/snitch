import type { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

export const validateCreateProduct = [
  body("title")
    .notEmpty()
    .withMessage("Product title is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Product title must be at least 2 characters"),
  body("description")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("priceAmount")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0.01 })
    .withMessage("Product price must be a number greater than 0"),
  body("priceCurrency")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"])
    .withMessage("Price currency is invalid"),
  validateResult,
];

export const validateUpdateProduct = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Product title must be at least 2 characters"),
  body("description")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("priceAmount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Product price must be a number greater than 0"),
  body("priceCurrency")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"])
    .withMessage("Price currency is invalid"),
  validateResult,
];

export default validateCreateProduct;
