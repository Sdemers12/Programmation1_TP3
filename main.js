const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const port = process.env.PORT || 4000;
const dbPath = process.env.DB_PATH;
const dbOptions = {useNewUrlParser: true};

const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const connectFlash = require('connect-flash');

const mainRouter = require('./route/user');
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(cookieParser('my_secret_code'));
app.use(expressSession({
    secret: "my_secret_code",
    cookie: {
        maxAge: 4000000
    },
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(connectFlash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

app.use(express.static('./public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(methodOverride('_method'));

const User = require('./model/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(mainRouter);

mongoose.connect(dbPath, dbOptions)
    .then(() => console.log(`La base de données est connecté sur ${dbPath}`))
    .catch(err => console.log(err));
app.listen(port, console.log(`Notre serveur tourne sur http://localhost:${port}`));