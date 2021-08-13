const express = require('express');
const router = express.Router();

/* 
    @route getting API/post
    @desc testing the route
    @access public
*/

router.get('/', (req, res) => res.send('Post route'));

module.exports = router;