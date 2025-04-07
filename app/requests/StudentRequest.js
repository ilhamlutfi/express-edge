import { body } from 'express-validator';
import prisma from '../helpers/prisma.js';

const StudentRequest = {
    rules: () => [
        body('name')
            .notEmpty().withMessage('Name is required'),

        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Email is not valid')
            .custom(async (value, { req }) => {
                const studentId = parseInt(req.params?.id);

                const existing = await prisma.student.findFirst({
                    where: {
                        email: value,
                        ...(studentId && {
                            id: { not: studentId }
                        })
                    }
                });

                if (existing) {
                    throw new Error('Email already in use');
                }

                return true;
            }),

        body('age')
            .notEmpty().withMessage('Age is required')
            .isNumeric().withMessage('Age must be a number')
    ]
};

export default StudentRequest;

