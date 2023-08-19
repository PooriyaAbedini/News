const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
require('dotenv').config();


//Passport config
require('./config/passport')(passport);


//DB config:
const db = process.env.URI;

//connecting mongoose:
mongoose.connect(db, {useNewUrlParser: true})
.then(()=>{console.log("MongoDB connected...")})
.catch(err=> console.log(err));

const app = express();

//Method override setup for put and delete methods
app.use(methodOverride('_method'));

//Body parser: 
app.use (bodyParser.urlencoded({extended: true}));

//Express Session:
app.use(session({

    secret: "secret",
    resave: true,
    saveUninitialized: true,
    
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Connect Flash
app.use(flash());

//Global Vars
app.use((req, res, next) =>{

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.successPub_msg = req.flash('successPub_msg');
    res.locals.successUp_msg = req.flash('successUp_msg');
    res.locals.successDel_msg = req.flash('successDel_msg');
    res.locals.access_denied = req.flash('access_denied');
    
    next();

});

//Static CSS
app.use(express.static(__dirname + '/public'));

//EJS

app.set ('view engine', 'ejs');


//Routes: 
const homeRoute = require('./routes/home');
const adminRoute = require('./routes/admin');
const indexRoute = require('./routes/news');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const logoutRoute = require('./routes/logout');
const contactRoute = require('./routes/contact');
const aboutRoute = require('./routes/about');
const notAlowedRoute = require('./routes/notAlowed');

app.use('/', homeRoute);
app.use('/admin', adminRoute);
app.use('/news', indexRoute);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/logout', logoutRoute);
app.use('/contact', contactRoute);
app.use('/about', aboutRoute);
app.use('/401', notAlowedRoute);


app.listen(5000,()=>{
    console.log("server is running (5000).");
});
