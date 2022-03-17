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
const jwtmiddleware = require('../middleware/jwtMiddleWare');

router.post('/login', async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

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

        console.log(req.body);

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

router.post('/update', (req, res) => {});

router.get('/superPrivateResource', jwtmiddleware, (req, res) => {
    res.send('hacked into the main frame >:)');
});

module.exports = router;
