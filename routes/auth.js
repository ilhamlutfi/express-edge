import express from 'express';
import AuthController from '../app/controllers/AuthController.js';
import { isAuthenticated } from '../app/middlewares/AuthMiddleware.js';

const authRoutes = express.Router();

authRoutes.get('/login', isAuthenticated, AuthController.login);
authRoutes.post('/login', isAuthenticated, AuthController.loginAttempt);
authRoutes.get('/register', AuthController.register);
authRoutes.post('/register', AuthController.registerAttempt);

export default authRoutes;

