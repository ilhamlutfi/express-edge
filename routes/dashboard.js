import express from 'express';
import DashboardController from '../app/controllers/DashboardController.js';
import { isNotAuthenticated } from '../app/middlewares/AuthMiddleware.js';

const dashboardRoutes = express.Router();

dashboardRoutes.use(isNotAuthenticated);
dashboardRoutes.get('/dashboard', DashboardController.index);

export default dashboardRoutes;
