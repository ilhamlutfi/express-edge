import express from 'express';
import homeRoutes from './home.js';
import studentRoutes from './students.js';
import authRoutes from './auth.js';

const router = express.Router();

router.use('/', authRoutes);
router.use('/', homeRoutes);
router.use('/', studentRoutes);


export default router;
