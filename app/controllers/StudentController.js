import { edge } from "../../index.js";

export default class StudentController {
    static async index(req, res) {
        const data = {
            students: [
                { id: 1, name: 'John Doe', age: 20 },
                { id: 2, name: 'Jane Smith', age: 22 },
                { id: 3, name: 'Sam Brown', age: 19 }
            ]
        };
        const html = await edge.render('students/index', data);
        res.send(html);
    }
}
