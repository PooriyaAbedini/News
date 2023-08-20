const express = require('express');
const router = express.Router();
const { Post }= require('../models/users');

router.get('/', async (req,res)=>{

    if (req.isAuthenticated()){

        try{

            const news = await Post.find()
            res.render('news', { news: news});
           
        } catch(err){ console.log(err) }

        
    }
    else{
        res.redirect('/login');
    }
});

router.get('/:new', async (req,res)=>{

    const title = req.params.new;
    try{

        const specificNew = await Post.findOne({title: title});
         res.render('specificNew', { article: specificNew});

    }catch(err){ console.log(err) }
    
   

}); 

module.exports = router;