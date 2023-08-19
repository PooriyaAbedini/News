const express = require('express');
const router = express.Router();
const passport = require('passport');


//DB Models:
const User = require('../models/users').User;

//Arrays for login errors:
var loginErrors = [];


//Requests
router.get('/', (req, res) => {

    res.render('login', { errs: loginErrors });
    loginErrors = [];

});

router.post('/', async (req, res, next) => {

    var email = req.body.email;
    var password = req.body.password;
    var userRole = 'user';


    //Checking required feilds:
    if (!email || !password) {

        loginErrors.push({ msg: "Please fill in all fields" });

    }
    const user = await User.findOne({ email: email });

    if (!user) loginErrors.push("Not registered yet!");
    console.log(user.role);
    if(user.role == 'admin') userRole = 'admin';

    if (loginErrors.length > 0) {
        res.redirect('login');
    }
    else {
        if(userRole == 'admin'){
            passport.authenticate('local', {

                successRedirect: '/admin',
                failureRedirect: '/login',
                failureFlash: true
    
            })(req, res, next);
            
        }
        else{
            passport.authenticate('local', {

                successRedirect: '/news',
                failureRedirect: '/login',
                failureFlash: true
    
            })(req, res, next);
        } 
    }
    
});

module.exports = router ;