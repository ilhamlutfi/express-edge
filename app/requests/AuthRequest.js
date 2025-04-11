import { body } from 'express-validator';
import prisma from '../helpers/prisma.js';

const LoginRequest = {
    rules: () => [
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Email is not valid'),
        
        body('password')
            .notEmpty().withMessage('Password is required')
    ]
};

const RegisterRequest = {
    rules: () => [
        body('name')
            .notEmpty().withMessage('Name is required'),

        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Email is not valid')
            .custom(async (email) => {
                const user = await prisma.user.findUnique({
                    where: { email }
                });
                if (user) {
                    throw new Error('Email has already been taken');
                }
                return true;
            }),

        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

        body('password_confirmation')
            .notEmpty().withMessage('Password confirmation is required')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            }),
    ]
};

export {
    LoginRequest,
    RegisterRequest
};

