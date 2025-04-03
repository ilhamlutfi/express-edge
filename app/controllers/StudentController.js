import {
    edge
} from "../../index.js";
import prisma from "../helpers/prisma.js";

export default class StudentController {
    static async index(req, res) {
        const data = {
            students: await prisma.student.findMany({
                select: {
                    id: true,
                    name: true,
                    age: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: {
                    id: 'desc'
                }
            })
        }

        const html = await edge.render('students/index', data);
        res.send(html);
    }

    static async show(req, res) {
        try {
            const {
                id
            } = req.params;
            const student = await prisma.student.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if (!student) {
                return res.send(`<h1>Student not found, id:${id}</h1>`);
            }

            const html = await edge.render('students/show', {
                student
            });
            res.send(html);
        } catch (error) {
            return res.send(`<h1>${error.message}</h1>`);
        }
    }

    static async delete(req, res) {
        try {
            const studentId = parseInt(req.params.id);

            const student = await prisma.student.delete({
                where: {
                    id: studentId
                }
            });

            res.redirect('/students');
        } catch (error) {
             // Handle the case where the student is not found or another error occurs
             if (error.code === 'P2025') {
                 return res.send(`<h1>Student not found, id: ${req.params.id}</h1>`);
             }
            return res.send(`<h1>${error.message}</h1>`);
        }
    }
}
