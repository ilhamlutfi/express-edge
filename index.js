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

dotenv.config();

const app = express();
const edge = Edge.create();
const port = process.env.PORT || 3000;
const base_url = `http://localhost:${port}`;

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

app.use(router);

edge.mount(process.cwd() + '/views');
app.set('view engine', 'edge');
app.set('views', process.cwd() + '/views');

app.listen(port, () => console.log(`App listening on ${base_url}`));

export {
    edge
};
