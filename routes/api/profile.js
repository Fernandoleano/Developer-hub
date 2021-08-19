const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validatorResult, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

/* 
    @route GET API/profile/me
    @desc testing the route
    @access private
*/

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        // check if there is no profile
        if (!profile) {
            return res.status(400).json({ msg: 'No profile found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});

/* 
    @route POST API/profile
    @desc Create/update a user profile
    @access private
*/
router.post('/', [ auth, [
    check('status', 'Status is required')
    .not()
    .isEmpty(),
    check('skills', 'Skills is required')
    .not()
    .isEmpty()
] 
    ], 
    async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.status(400).json({ errors: erros.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkdin
        } = req.body;

        // buidling profile
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profilesFields.company = company;
        if (website) profilesFields.website = website;
        if (location) profilesFields.location = location;
        if (bio) profilesFields.bio = bio;
        if (status) profilesFields.status = status;
        if (githubusername) profilesFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // building social objects
        profileFields.socials = {}
        if (youtube) profilesFields.youtube = youtube;
        if (twitter) profilesFields.twitter = twitter;
        if (facebook) profilesFields.facebook = facebook;
        if (linkdin) profilesFields.linkdin = linkdin;
        if (instagram) profilesFields.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile){
                // updating user profile
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profilesFields }, 
                    { new: true }
                );
                
                return res.json(profile);
            }

            // create user profile
            await profile.save();
            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error' + err.message);
        }
});

/*
    @route GET API/profile
    @desc get all profiles
    @access Public
*/
router.get('/', async(req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar',]);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error' + err.message);        
    }
});

/*
    @route GET API/profile/user/:user_id
    @desc get all profiles by user ID
    @access Public
*/
router.get('/user/:user_id', async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar',]);
        if (!profile) return res.status(400).json({ msg: 'User does not exists.' });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'User does not exists.' });
        }
        res.status(500).send('Server Error' + err.message);        
    }
});

/*
    @route DELETE API/profile
    @desc Delete profiles, user & posts
    @access Priate
*/
router.delete('/', auth, async(req, res) => {
    try {
        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "User deleted" });
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'User does not exists.' });
        }
        res.status(500).send('Server Error' + err.message);        
    }
});


module.exports = router;