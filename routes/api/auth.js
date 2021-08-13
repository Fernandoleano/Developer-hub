const express = require('express');
const router = express.Router();

/* 
    @route getting API/auth
    @desc testing the route
    @access public
*/

router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;