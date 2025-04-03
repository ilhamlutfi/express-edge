import dotenv from 'dotenv';
import express from 'express';
import router from './routes/web.js';
import {
    Edge
} from 'edge.js'
import csrf from 'csrf';
import methodOverride from "method-override";
dotenv.config(); // Load environment variables from .env file

const app = express()
const edge = Edge.create()
const csrfProtection = csrf(); // Middleware CSRF
const port = process.env.PORT || 3000
const base_url = `http://localhost:${port}`;

app.use(methodOverride("_method")); // Middleware method spoofing
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
    extended: true
})) // for parsing application/x-www-form-urlencoded

// Hanya untuk metode POST, PUT, DELETE
app.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        csrfProtection(req, res, next);
    } else {
        next();
    }
});

// Rute untuk meng-handle CSRF token dan routing lainnya
app.use(async (req, res, next) => {
    // Menyediakan CSRF token hanya untuk form yang memodifikasi data
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Error handling untuk CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        // Jika token CSRF invalid
        res.status(403).send('Form has expired or CSRF token is invalid');
    } else {
        next(err);
    }
});


app.use(router)

edge.mount(process.cwd() + '/views'); // Mount folder views untuk mencari template .edge
app.set('view engine', 'edge'); // Set view engine untuk Express
app.set('views', process.cwd() + '/views'); // Set direktori views untuk Express

app.listen(port, () => console.log(`app listening on base_url ${base_url}`))

export {
    edge
} // Export the instance for use in other modules
