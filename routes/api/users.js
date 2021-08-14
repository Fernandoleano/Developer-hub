const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
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
], 
   async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });

        // If they do I will send back an error
        if (user) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' } ]});
        }

        // Get users a avatar
        const avater = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        })
        
        // Encrypt user password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

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