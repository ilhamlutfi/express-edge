import express from 'express';
import StudentController from '../app/controllers/StudentController.js';
import isAuthenticated from '../app/middlewares/AuthMiddleware.js';

const studentRoutes = express.Router();

studentRoutes.use(isAuthenticated) // Middleware for all student routes
studentRoutes.route('/students')
    .get(StudentController.index)
    .post(StudentController.store);

studentRoutes.get('/students/create', StudentController.create);

studentRoutes.route('/students/:id')
    .get(StudentController.show)
    .put(StudentController.update)
    .delete(StudentController.delete);

studentRoutes.get('/students/:id/edit', StudentController.edit);

export default studentRoutes;
