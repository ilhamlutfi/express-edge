import dotenv from 'dotenv';
import express from 'express';
import router from './routes/web.js';
import {
    Edge
} from 'edge.js';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import {
    generateCsrfToken,
    verifyCsrfToken
} from './app/helpers/csrf.js';
import session from 'express-session';
import flash from 'connect-flash';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const edge = Edge.create();
const port = process.env.PORT || 3000;
const base_url = `http://localhost:${port}`;

// Rate limiter untuk membatasi 100 permintaan per 15 menit dari setiap IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Maksimal 100 permintaan per IP dalam 15 menit
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    headers: true, // Menyertakan header rate-limit di response
});

// Terapkan rate limiter di seluruh aplikasi (global)
app.use(limiter);

app.use(methodOverride("_method")); // Middleware method spoofing
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ 
    extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for parsing cookies

// ✅ Middleware CSRF agar token tersedia di views
app.use(generateCsrfToken);

// ✅ Middleware CSRF untuk validasi sebelum request DELETE, POST, dan PUT
app.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return verifyCsrfToken(req, res, next);
    }
    next();
});

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set ke true jika menggunakan HTTPS
        maxAge: 24 * 60 * 60 * 1000 // Waktu kedaluwarsa sesi 24 jam (24 jam * 60 menit * 60 detik * 1000 milidetik)
    }
})); // Session middleware
app.use(flash()); // Flash middleware

app.use(router);

edge.mount(process.cwd() + '/views');
app.set('view engine', 'edge');
app.set('views', process.cwd() + '/views');

app.listen(port, () => console.log(`App listening on ${base_url}`));

export {
    edge
};
