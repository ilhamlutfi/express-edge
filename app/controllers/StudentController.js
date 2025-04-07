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
            csrfToken: res.locals.csrfToken,
            success: req.flash('success')[0] ?? null,
        };

        return res.send(await edge.render('students/index', data));
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

            return res.send(await edge.render('students/show', {
                student
            }));
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

            return res.send(await edge.render('students/edit', {
                student: data.student,
                csrfToken: data.csrfToken,
                errors: req.flash('errors'),
                old: req.flash('old')
            }));
        } catch (error) {
            return res.send(`<h1>${error.message}</h1>`);
        }
    }

    static async update(req, res) {
        try {
            const studentId = parseInt(req.params.id);

            const errors = await RequestValidator.validate(req, StudentRequest.rules());

            if (errors) {
                req.flash('errors', errors);
                req.flash('old', req.body);
                return res.redirect(`/students/${studentId}/edit`);
            }

            const studentData = req.body;

            await StudentService.update(studentId, studentData);

            req.flash('success', 'Student updated successfully!');
            return res.redirect('/students');
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

            return res.redirect('/students');
        } catch (error) {
            // Handle the case where the student is not found or another error occurs
            if (error.code === 'P2025') {
                return res.send(`<h1>${error.meta?.cause || error.message}</h1>`);
            }
            return res.send(`<h1>${error.message}</h1>`);
        }
    }
}
