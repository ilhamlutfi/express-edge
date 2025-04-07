import { validationResult } from 'express-validator';

const RequestValidator = {
    async validate(req, rules) {
        await Promise.all(rules.map(rule => rule.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errors.array(); // ⬅️ return array error ke controller
        }

        return null; // gak ada error
    }
};

export default RequestValidator;
