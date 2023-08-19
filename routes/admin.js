const express = require('express');
const router = express.Router();

const { Post } = require('../models/users');
const Date = require('../models/date');





var titleToModif;
var modifErrs = [];
var pubErrs = [];

router.get('/', (req, res) => {

    if(req.isAuthenticated()){
        
        const role = req.session.passport.user.role;
        
        if(role == 'admin'){
            res.render('admin', { titleFound: '', postFound: '', errs: modifErrs, pubErrs: pubErrs });
            modifErrs = [];
            pubErrs = [];
            
        }
        
    }
    else{
        req.flash('access_denied', 'Access denied!');
        res.redirect('/401');
    }


});



router.post('/article', async (req, res) => {

    const searchedTitle = req.body.searchBox;
    req.params.title = searchedTitle;

    try {

        var postExists = await Post.findOne({ title: searchedTitle });

        if (postExists) {
            //Saving title in case of updating and deleting for PUT and DELETE routes:
            titleToModif = searchedTitle;
        }
        else {
            modifErrs.push('Ther is no article with this title!');
        };
    }
    catch (err) {
        modifErrs.push('Something went wrong please try later.')
        console.log(err);
    };
    if (modifErrs.length > 0) {
        res.redirect('/admin')
    } else {
        res.render('admin', { titleFound: postExists.title, postFound: postExists.post, errs: modifErrs, pubErrs: pubErrs });
    }

});

router.post('/', async (req, res) => {

    const title = req.body.titleToPost;
    const post = req.body.articleToPost;

    try {
        const newPost = await new Post({

            date: Date,
            title: title,
            post: post

        });
        await newPost.save();
        req.flash('successPub_msg','Published!');
        console.log("Successful")
    }
    catch (err) {
        pubErrs.push("Something went wrong please try later")
        console.log(err) 
    }

    res.redirect('/admin');
});

router.patch('/', async (req, res) => {

    const upTitle = req.body.titleToChange;
    const upPost = req.body.postToChange;
    try {

        await Post.findOneAndUpdate(
            { title: titleToModif },
            { date: Date, title: upTitle, post: upPost }
        )
        req.flash('successUp_msg','Updated!');
        res.redirect('/admin');
        
    }
    catch (err) { 
        modifErrs.push('Something went wrong!');
        console.log(err) };


});

router.delete('/', async (req, res) => {

    try {

        await Post.findOneAndDelete({ title: titleToModif });
        req.flash('successDel_msg', 'Deleted!');
        res.redirect('/admin');
       

    } catch (err) {
        modifErrs.push('NOT DELETED!') 
        console.log(err) 
    };



});
module.exports = router;