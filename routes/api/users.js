const express = require('express');
const router = express.Router();
const { check, validatorResult, validationResult } = require('express-validator/check');

const User = require('../../models/User');

/* 
    @route POST API/user
    @desc register the user
    @access public
*/

router.post('/', [
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Include a valid email email is required').isEmail(),
    check('password', "Please enter a password with 8 or more characters").isLength({ min: 8 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if the user exists

    // If they do I will send back an error

    // Get users a avatar
    
    // Encrypt user password

    // Return jsonwebtoken

    res.send('User route');
});

module.exports = router;