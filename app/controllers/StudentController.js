import StudentRequest from "../requests/StudentRequest.js";
import RequestValidator from "../helpers/validator.js";
import StudentService from "../service/StudentService.js";
import { render } from "../helpers/view.js";

export default class StudentController {
    static async index(req, res) {
        const data = {
            students: await StudentService.getAll(),
        };

        return await render(req, res, 'students/index', data);
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

           return await render(req, res, 'students/show', { student });
        } catch (error) {
            return res.send(`<h1>${error.message}</h1>`);
        }
    }

    static async create(req, res) {
        try {
            return await render(req, res, 'students/create');
        } catch (error) {
            return res.send(`<h1>${error.message}</h1>`); 
        }
    }

    static async store(req, res) {
        try {
            const errors = await RequestValidator.validate(req, StudentRequest.rules());

            if (errors) {
                req.flash('errors', errors);
                req.flash('old', req.body);
                return res.redirect('/students/create');
            }

            const studentData = req.body;
            await StudentService.create(studentData);
            
            req.flash('success', 'Student created successfully!');
            return res.redirect('/students');
        } catch (error) {
            return res.send(`<h1>${error.message}</h1>`)
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

            return await render(req, res, 'students/edit', data);
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

            req.flash('success', 'Student deleted successfully!');
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
