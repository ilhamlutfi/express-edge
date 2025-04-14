import express from 'express';
import dashboardRoutes from './dashboard.js';
import studentRoutes from './students.js';
import authRoutes from './auth.js';
import homeRoutes from './front/home.js';

const router = express.Router();

router.use('/', homeRoutes);

router.use('/', authRoutes);
router.use('/', dashboardRoutes);
router.use('/', studentRoutes);


export default router;
