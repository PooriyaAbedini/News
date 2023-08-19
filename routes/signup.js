const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


//DB Models:
const User = require('../models/users').User;

//Arrays for singup errors:
var signupErrors = [];

//Requests:
router.get('/', (req, res) => {

   res.render('signup', { errs: signupErrors });

   setTimeout(() => {
      signupErrors = [];
   }, 200);




});

router.post('/', async (req, res) => {

   const email = req.body.email;
   const password = req.body.password;

   //Checking required feilds:
   if (!email || !password) {

      signupErrors.push({ msg: "Please fill in all fields" });

   }

   //Check if password has more than 6 characters:
   if (password.length < 6) {

      signupErrors.push({ msg: "Your password should include at least 6 characters" });

   }
   
   //Checking if user there is another user with the email address:
   const userExists = await User.findOne({ 'email': email });
      

      if (userExists) {

         signupErrors.push({ msg: "A user with this email address is  already registered" });
         
         
      }
      //Checking for Errors
      if(signupErrors.length > 0){
         res.redirect('/signup');
      }
      else {
         try {

            await bcrypt.genSalt(10, function (err, salt) {
               if (err) console.log(err);
                  bcrypt.hash(password, salt, (err, hash) => {
                  if (err) console.log(err);

                  const user = new User({
                     email: email,
                     password: hash,
                     role: 'user'
                  });
                  user.save();
               });
            });
         }
         catch (err) {

            req.flash('error_msg', 'Something went wrong, try later');

         }
         req.flash('success_msg', 'Your are registered! Now you can login');
         res.redirect('../login');
      }

     
});

module.exports = router;