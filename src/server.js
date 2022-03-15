
const dotenv = require('dotenv').config()


//register schemas 
Events = require('./mongoschemas/eventSchema')
AppUser = require('./mongoschemas/appUserSchema')

//express
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');


//db
const connect = require('./config/db');

//controllers
const eventController = require('./controllers/eventController');

async function bootServer() {
  try {
    app.use(bodyParser.json());
    //db
    connect();

    
    //register the controllers
    app.use('/eventResource', eventController);
    

    //listen
    app.listen(port, () => {
      console.log('app listening on port:', 5000);
    })
  } catch (error) {
    console.error(error);
    console.log('An Error Occured Whilst Starting')
  }
}


 
module.exports = {bootServer};
