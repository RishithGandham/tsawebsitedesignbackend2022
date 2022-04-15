//express
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/isAuthenticated', (req, res) => {
    const {token} = req.body;
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                isTokenValid: false
            });
        }
        return res.status(200).json({
            isTokenValid: true
        });
    });
})


module.exports = router;