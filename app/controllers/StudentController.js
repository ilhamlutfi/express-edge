import { edge } from "../../index.js";
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
}
