import express from 'express';
import HomeController from '../app/controllers/HomeController.js';

const homeRoutes = express.Router();

homeRoutes.get('/', HomeController.index);

export default homeRoutes;
