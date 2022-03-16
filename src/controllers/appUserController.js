const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const AppUser = mongoose.model('AppUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const sanitizedEmail = email.toLowerCase();

        //validate input
        if (!(email && password)) {
            res.status(400).send('All input is required');
        }

        //get the user
        const appuser = AppUser.find({ email });

        //unencrypt the password in db and compare both
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, sanitizedEmail },
                process.env.TOKEN_KEY || process.env['TOKEN_KEY'],
                {
                    expiresIn: '15d',
                }
            );

            res.status(200).json({
                appuser: user,
                jwt: token,
            });
            res.status(400).send('invalid credentials');
        }
    } catch (error) {
        res.status(400).send('Invalid Credentials');
        console.log(error);
    }
});

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const sanitizedEmail = email.toLowerCase();
        !(email && password && lastName && firstName)
            ? res.status(400).send('All input required')
            : null;
        const isUserExists = await AppUser.exists({ sanitizedEmail });
        isUserExists
            ? res.status(409).send('This user with this email already exists')
            : null;

        // hash the pass
        encryptedPass = await bcrypt.hash(password, 10);

        //create the AppUser from the model
        const user = await AppUser.create({
            firstName,
            lastName,
            email: sanitizedEmail,
            password: encryptedPass,
        });

        //create, sign and send the jwt
        const token = jwt.sign(
            { user_id: user._id, sanitizedEmail },
            process.env.TOKEN_KEY,
            {
                expiresIn: '15d',
            }
        );

        res.status(200).json({
            jwt: token,
            user: user,
        });
    } catch (error) {
        res.send('error saving user');
        console.log(error);
    }
});

router.post('/update', (req, res) => {

});

router.get('/superPrivateResource', (req, res) => {});

module.exports = router;
