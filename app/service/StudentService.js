import prisma from "../helpers/prisma.js";

export default class StudentService {
    static async getAll() {
        return await prisma.student.findMany({
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
        });
    }
    
    static async getSingle(id) {
        return await prisma.student.findUnique({
            where: {
                id: Number(id)
            }
        });
    }

    static async delete(id) {
        return await prisma.student.delete({
            where: {
                id: Number(id)
            }
        });
    }
}
