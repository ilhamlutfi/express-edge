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
        if (!id || isNaN(Number(id))) {
            throw new Error("Invalid ID");
        }
        
        return await prisma.student.findUnique({
            where: {
                id: Number(id)
            }
        });
    }

    static async create(data) {
        return await prisma.student.create({
            data: {
                name: data.name,
                age: parseInt(data.age),
                email: data.email
            }
        })
    }

    static async update(id, data) {
        return await prisma.student.update({
            where: {
                id: Number(id)
            },
            data: {
                name: data.name,
                age: parseInt(data.age),
                email: data.email
            }
        })
    }

    static async delete(id) {
        return await prisma.student.delete({
            where: {
                id: Number(id)
            }
        });
    }
}
