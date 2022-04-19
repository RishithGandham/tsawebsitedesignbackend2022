//dot env
require('dotenv').config();

//express
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//mongoose
const mongoose = require('mongoose');
const AppUser = mongoose.model('AppUser');

//middle ware
const jwtmiddleware = require('../auth/checkjwt.middleware');
const getAppUserFromReq = require('../auth/getappuser.middleware');
const checkIfAdmin = require('../auth/admincheck.middleware');

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

router.post('/login', async (req, res) => {
    try {
        
        // Get user input
        const { email, password } = req.body;

        if (!validateEmail(email)) return res.status(400).send('Invalid email');
        


        // Validate user input
        if (!(email && password)) {
            return res.status(400).send('All  input is required');
        }
        // Validate if user exist in our database
        const user = await AppUser.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '15d',
                }
            );

            // user
            return res.status(200).json({
                jwt: token,
                user: user,
            });
        }
        return res.status(400).send('Invalid Credentials');
    } catch (err) {
        res.status(400).send('Invalid Credentials');
        console.log(err);
    }
});

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!validateEmail(email)) return res.status(400).send('Invalid email');
        if (password.length < 8) return res.status(400).send('Password must be at least 8 characters');

        if (!(email && password && firstName && lastName)) {
            return res.status(400).send('All input is required');
        }

        const oldUser = await AppUser.findOne({ email });

        if (oldUser) {
            return res.status(409).send('User Already Exist. Please Login');
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await AppUser.create({
            firstName,
            lastName,
            email: email, // sanitize: convert email to lowercase
            password: encryptedPassword,
            statistics: {eventsViewed: 0, quizzesAttempted: 0, averageQuizScore: 0},
            admin: false,
            subscribedEvents: []
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: '15d',
            }
        );

        // return new user
        return res.status(201).json({
            jwt: token,
            user: user,
        });
    } catch (error) {
        res.send('error saving user');
        console.log(error);
    }
});

router.get('/userdetails', jwtmiddleware, async (req, res) => {
    console.log(req.user);
    return res.status(200).json({
        user: req.user,
    });
});

//update a user taking in a token so that only the user can update their own profile
router.post('/update/', jwtmiddleware, getAppUserFromReq, async (req, res) => {
    const { firstName, lastName, password } = req.body;

    if (!validateEmail(email)) return res.status(400).send('Invalid email');
    if (password.length < 8) return res.status(400).send('Password must be at least 8 characters');
    
    if (!(email && password && firstName && lastName)) {
        return res.status(400).send('All input is required');
    }

    const oldUser = await AppUser.findOne({ email });

    if(!oldUser) return res.status(400).send('User does not exist');

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // update user in database
    const user = await AppUser.findOneAndUpdate(
        { _id: req.user._id },
        { firstName, lastName, password: encryptedPassword },
        { new: true }
    )
        .then((user) => {
            console.log(user);
            res.status(200).json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('Error updating user');
        });
});

// get the users statistics
router.get('/statistics', jwtmiddleware, getAppUserFromReq,  (req, res) => {
    try {
        console.log(req.user)
        const { statistics } = req.user;
        return res.status(200).json({
            statistics,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error getting statistics')
    }
    
});






//hello
module.exports = router;
