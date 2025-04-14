import { render } from '../helpers/view.js';

export default class DashboardController {
    static async index(req, res) {
        const data = {
            title: 'Dashboard Page',
        };

        return render(req, res, 'dashboard/index', data);
    }
}
