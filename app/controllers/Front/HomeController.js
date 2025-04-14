import { render } from '../../helpers/view.js';

export default class HomeController {
    static async index(req, res) {
        const data = {
            title: 'Welcome to Edge.js with Express'
        }
        return render(req, res, 'front/home/index', data);
    }
}
