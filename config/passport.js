const mongoose = require('mongoose');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/users').User;
const Admin = require('../models/users').Admin


module.exports = function (passport) {

    passport.use(
        'local', new localStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {

            //Match User
            User.findOne({ email: email })
            .then(user => {

                if (!user) {
                    return done(null, false, { message: 'This email-address is not registered yet' });
                }
                //Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {

                    if (err) throw err;

                    if (isMatch) {

                        return done(null, user);

                    }
                    else {
                        return done(null, false, { message: 'Wrong password!' })
                    }

                })


            })
            .catch(err => { console.log(err) });
        })
    )

        //Serializing and Deserializing:

        passport.serializeUser((User, done) => {

            process.nextTick(()=>{
    
                return done(null, {
                    id: User.id,
                    email: User.email,
                    role: User.role
                })
    
            })
            
        });
        
        passport.deserializeUser(async (id, done) => {
    
            var err ;
            var user;
            
                try{
    
                     user = User.findById(id)
    
                }catch(error){
                    console.log(err);
                     err = error;
                }
           
            return done(err,user);
    
        });

   
}