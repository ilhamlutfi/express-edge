import { body } from 'express-validator';

const StudentRequest = {
    rules: () => [
        body('name').notEmpty().withMessage('Name is required'),
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Email is not valid'),
        body('age')
            .notEmpty().withMessage('Age is required')
            .isNumeric().withMessage('Age must be a number')
    ]
};

export default StudentRequest;
