const express = require('express');
const router = express.Router();

/* 
    @route getting API/profile
    @desc testing the route
    @access public
*/

router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;