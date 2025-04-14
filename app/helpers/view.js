// helpers/view.js
import { edge } from '../../index.js';

export const render = async (req, res, view, data = {}) => {
    const html = await edge.render(view, {
        csrfToken: res.locals.csrfToken,
        success: req.flash('success')[0] ?? null,
        errors: req.flash('errors'),
        old: req.flash('old')[0] ?? {},
        session: req.session ?? [],
        ...data,
    });
    return res.send(html);
};
