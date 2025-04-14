import dotenv from 'dotenv';
import express from 'express';
import router from './routes/web.js';
import { Edge } from 'edge.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import { generateCsrfToken, verifyCsrfToken } from './app/helpers/csrf.js';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import flash from 'connect-flash';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

dotenv.config();

const app = express();
const edge = Edge.create();
const port = process.env.PORT || 3000;
const base_url = `http://localhost:${port}`;

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    headers: true,
});

app.use(express.static(path.resolve('public')));
app.set('trust proxy', 1);
app.use(limiter);
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(flash());
app.disable('x-powered-by');

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true if https
        maxAge: 24 * 60 * 60 * 1000
    },
    store: new (createMemoryStore(session))({
        checkPeriod: 43200000 // prune expired entries every 12h
    }),
}));

// CSRF
app.use(generateCsrfToken);
app.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return verifyCsrfToken(req, res, next);
    }
    next();
});

// Template engine
edge.mount(process.cwd() + '/views');
app.set('view engine', 'edge');
app.set('views', process.cwd() + '/views');
edge.global('base_url', base_url);

// Router
app.use(router);

// Not found handler (harus di bawah router)
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// Error handler (juga di paling akhir)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message);
});

app.listen(port, () => console.log(`App listening on ${base_url}`));

export { edge };
