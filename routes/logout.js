const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{

    req.logout(err=>{

        if(err) console.log(err);
        res.redirect('../');

    })

})

module.exports = router;