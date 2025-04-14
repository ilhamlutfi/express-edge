import express from 'express';
import HomeController from '../../app/controllers/Front/HomeController.js';

const homeRoutes = express.Router();

homeRoutes.get('/', HomeController.index);
homeRoutes.get('/home', HomeController.index);

export default homeRoutes;
