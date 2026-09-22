import type { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateRegister = [
    body('fullName').notEmpty().isLength({ min: 2 }).withMessage('Full name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('contact').notEmpty().withMessage('Contact is required').matches(/^[0-9]{10}$/).withMessage('Contact must be at least 10 digits'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').notEmpty().withMessage('Role is required').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller'),
    validateResult
];