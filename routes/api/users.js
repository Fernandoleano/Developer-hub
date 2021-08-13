const express = require('express');
const router = express.Router();

/* 
    @route getting API/user
    @desc testing the route
    @access public
*/

router.get('/', (req, res) => res.send('User route'));

module.exports = router;