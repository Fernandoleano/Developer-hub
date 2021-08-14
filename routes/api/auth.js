const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validatorResult, validationResult } = require('express-validator/check');

const User = require('../../models/User');

/* 
    @route Get API/auth
    @desc testing the route
    @access public
*/

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        rex.status(500).send('Server error: ' + err.message);
    }
});

/* 
    @route POST API/auth
    @desc Authenticate user
    @access public
*/

router.post('/', [
    check('email', 'Include a valid email email is required').isEmail(),
    check('password is required').exists()
], 
   async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });

        // If they do I will send back an error
        if (!user) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'Email or password does not match please try again!' } ]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        // check if there is no match
        if (!isMatch) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'Email or password does not match please try again!' } ]});
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 36000 }, // This is recommended, but optional
            (err, token) => {
                if(err) throw err;
                res.join({ token });
            });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: ' + err.message);
    }
});

module.exports = router;