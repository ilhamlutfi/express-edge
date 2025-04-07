import {
    edge
} from "../../index.js";
import StudentRequest from "../requests/StudentRequest.js";
import { validationResult } from "express-validator";
import RequestValidator from "../helpers/validator.js";
import StudentService from "../service/StudentService.js";

export default class StudentController {
    static async index(req, res) {
        const data = {
            students: await StudentService.getAll(),
            csrfToken: res.locals.csrfToken
        };

        const html = await edge.render('students/index', data);
        res.send(html);
    }

    static async show(req, res) {
        try {
            const {
                id: studentId // ambil id dari params, ganti nama id jadi studentId
            } = req.params;

            const student = await StudentService.getSingle(studentId);

            if (!student) {
                return res.send(`<h1>Student not found, id: ${studentId}</h1>`);
            }

            const html = await edge.render('students/show', {
                student
            });
            res.send(html);
        } catch (error) {
            return res.send(`<h1>${error.message}</h1>`);
        }
    }

    static async edit(req, res) {
        try {
            const studentId = parseInt(req.params.id);

            const data = {
                student: await StudentService.getSingle(studentId),
                csrfToken: res.locals.csrfToken,
            };

            if (!data.student) {
                return res.send(`<h1>Student not found, id:${studentId}</h1>`);
            }

            res.send(await edge.render('students/edit', {
                student: data.student,
                csrfToken: data.csrfToken
            }));
        } catch (error) {
            return res.send(`<h1>${error.message}</h1>`);
        }
    }

    static async update(req, res) {
        try {
            const errors = await RequestValidator.validate(req, StudentRequest.rules());

            if (errors) {
                return res.status(422).json({
                    status: 'validation_failed',
                    message: 'Tolong periksa kembali inputan kamu!',
                    errors
                });
            }

            const studentId = parseInt(req.params.id);

            const studentData = req.body;

            await StudentService.update(studentId, studentData);

            res.redirect('/students');
        } catch (error) {
            if (error.code === 'P2025') {
                return res.send(`<h1>${error.meta?.cause || error.message}</h1>`);
            }

            return res.send(`<h1>${error.message}</h1>`);
        }
    }

    static async delete(req, res) {
        try {
            const studentId = parseInt(req.params.id);

            // delete have default behavior to throw an error if the record is not found
            await StudentService.delete(studentId);

            res.redirect('/students');
        } catch (error) {
            // Handle the case where the student is not found or another error occurs
            if (error.code === 'P2025') {
                return res.send(`<h1>${error.meta?.cause || error.message}</h1>`);
            }
            return res.send(`<h1>${error.message}</h1>`);
        }
    }
}
