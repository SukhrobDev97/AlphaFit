import cors from "cors"
import express from 'express'
import path from 'path'
import router from './router';
import routerAdmin from './router-Admin'
import morgan from 'morgan'
import { MORGAN_FORMAT } from './libs/config';

import session from 'express-session';
import ConnectMongoDb from "connect-mongodb-session";
import { T } from './libs/types/common';
import cookieParser from 'cookie-parser';

const MongoDBStore = ConnectMongoDb(session);
const store = new MongoDBStore({
    uri:String(process.env.MONGO_URL),
    collection: "sessions",
})
store.on('error', function(error) {
    console.error('SESSION STORE ERROR:', error);
  });

//1 -- ENTERANCE --;
const app = express();
app.use(express.static(path.join(process.cwd(), "src/public")));
console.log("STATIC PATH:", path.join(process.cwd(), "src/public"));
app.use ("/uploads", express.static("./uploads"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));


// 2- sessions;
app.use(
    session({
        secret:String(process.env.SESSION_SECRET),
        cookie:{
            maxAge:1000 * 3600 * 3, //3hours
        },
        store: store,
        resave: true,
        saveUninitialized:true
    })
);

app.use(function(req,res,next){
    const sessionINstance = req.session as T;
    res.locals.member = sessionINstance.member;
    next();
})
// 3- views
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")

//4- routers

app.use('/admin', routerAdmin); //BSSR,EJS
app.use('/', router)           // react

export default app;