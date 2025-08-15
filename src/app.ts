import express from 'express'
import path from 'path'
import router from './router';
import routerAdmin from './routerAdmin'

//1 -- ENTERANCE --;
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")

// 2- sessions;


// 3- views

//4- routers
app.use('/', router)
app.use('/admin', routerAdmin); //BSSR,EJS
app.use('/', router)           // react

export default app;