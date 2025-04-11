import { edge } from '../../index.js';

export default class HomeController {
    static async index(req, res) {
        const data = {
            title: 'Welcome to Edge.js with Express'
        };
        const html = await edge.render('home/index', data);
        return res.send(html);
    }
}
