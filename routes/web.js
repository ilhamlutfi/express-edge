import express from 'express';
import HomeController from '../app/controllers/HomeController.js';
import StudentController from '../app/controllers/StudentController.js';

const router = express.Router();

// route for the home page
router.get('/', HomeController.index);
router.route('/students')
    .get(StudentController.index) // Get all students
router.route('/students/:id')
    .get(StudentController.show) // Get a student by ID
    .delete(StudentController.delete) // Delete a student by ID

export default router;

