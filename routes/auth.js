import express from 'express';
import AuthController from '../app/controllers/AuthController.js';
import { isAuthenticated } from '../app/middlewares/AuthMiddleware.js';
import rateLimit from 'express-rate-limit';

const authRoutes = express.Router();
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 menit
    max: 10, // Maksimal 10 permintaan per IP dalam 1 menit
    message: 'Too many requests from this IP, please try again later.',
    skipFailedRequests: false, // jangan mengabaikan permintaan yang gagal
    keyGenerator: (req) => req.ip // rate limit berdasarkan IP
})

authRoutes.get('/login', isAuthenticated, AuthController.login);
authRoutes.post('/login', authLimiter, isAuthenticated, AuthController.loginAttempt);
authRoutes.get('/register', AuthController.register);
authRoutes.post('/register', authLimiter, AuthController.registerAttempt);

export default authRoutes;

