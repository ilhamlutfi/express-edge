import express from 'express';
import AuthController from '../app/controllers/AuthController.js';

const authRoutes = express.Router();

authRoutes.get('/login', AuthController.login);
authRoutes.post('/login', AuthController.loginAttempt);
authRoutes.get('/register', AuthController.register);
authRoutes.post('/register', AuthController.registerAttempt);

export default authRoutes;

