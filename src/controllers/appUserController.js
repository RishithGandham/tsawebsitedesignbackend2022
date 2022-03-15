const express = require('express');
const  mongoose = require('mongoose');
const router = express.Router();
const AppUser = mongoose.model('AppUser')
const jwt = require('jwt');
const bcrypt = require('bcrypt');

router.post('/login',  async (req , res) => {
  
})


router.post('/register', async (req, res) => {
  try {
    const {firstName, lastName, email, password} = req.body;
    const sanitizedEmail = email.toLowerCase();
   !(email && password && lastName && firstName) 
     ? res.status(400).send('all input required') 
     : null
    const isUserExists = await AppUser.findByOne({sanitizedEmail});
    isUserExists 
      ? res.status(409).send('This email already exists') 
      : null
    encryptedPass = bcrypt.hash(password)

    

    
    
  }
})

router.post('/update', (req, res) => {
  
})


router.get('/superPrivateResource', (req, res) => {
  
})


router.post('/update', (req, res) => {})