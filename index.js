import dotenv from 'dotenv';
import express from 'express';
import router from './routes/web.js';
import { Edge } from 'edge.js'
import methodOverride from "method-override";
dotenv.config(); // Load environment variables from .env file

const app = express()
const edge = Edge.create()
const port = process.env.PORT || 3000
const base_url = `http://localhost:${port}`;

app.use(methodOverride("_method")); // Middleware method spoofing
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(router)
edge.mount(process.cwd() + '/views'); // Mount folder views untuk mencari template .edge
app.set('view engine', 'edge'); // Set view engine untuk Express
app.set('views', process.cwd() + '/views'); // Set direktori views untuk Express

app.listen(port, () => console.log(`app listening on base_url ${base_url}`))

export { edge } // Export the instance for use in other modules
