import prisma from '../helpers/prisma.js';
import RequestValidator from '../helpers/validator.js';
import { render } from '../helpers/view.js';
import { LoginRequest, RegisterRequest } from '../requests/AuthRequest.js';
import bcrypt from 'bcrypt';

export default class AuthController {
    static async login(req, res) {
        return await render(req, res, 'auth/login');
    }

    static async loginAttempt(req, res) {
        try {
            const errors = await RequestValidator.validate(req, LoginRequest.rules());

            if (errors) {
                req.flash('errors', errors);
                req.flash('old', req.body);
                return res.redirect('/login');
            }

            const {
                email,
                password
            } = req.body;

            // Check if user exists
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (!user) {
                req.flash('errors', [{
                    msg: 'Invalid email or password'
                }]);
                req.flash('old', req.body);
                return res.redirect('/login');
            }

            // Compare password
            const validPassword = await bcrypt.compare(password, user.password);

            if (!user || !validPassword) {
                req.flash('errors', [{
                    msg: 'Invalid email or password'
                }]);
                req.flash('old', req.body);
                return res.redirect('/login');
            }

            // Set session user
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

            req.flash('success', 'Login successful!');
            return res.redirect('/dashboard');
        } catch (error) {
            // Handle the case where is not found or another error occurs
            if (error.code === 'P2025') {
                return res.send(`<h1>${error.meta?.cause || error.message}</h1>`);
            }
            return res.send(`<h1>${error.message}</h1>`);
        }
    }

    static async register(req, res) {
        const data = {
            csrfToken: res.locals.csrfToken,
            errors: req.flash('errors'),
            old: req.flash('old')[0] ?? {}
        }

        return await render(req, res, 'auth/register', data);
    }

    static async registerAttempt(req, res) {
        try {
            const errors = await RequestValidator.validate(req, RegisterRequest.rules());

            if (errors) {
                req.flash('errors', errors);
                req.flash('old', req.body);
                return res.redirect('/register');
            }

            // Jika lolos validasi, lanjut create user
            const { name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'user'
                }
            });

            req.flash('success', 'Registration successful!');
            return res.redirect('/login');
        } catch (error) {
            // Handle the case where is not found or another error occurs
            if (error.code === 'P2025') {
                return res.send(`<h1>${error.meta?.cause || error.message}</h1>`);
            }
            return res.send(`<h1>${error.message}</h1>`);
        }
    }
}

