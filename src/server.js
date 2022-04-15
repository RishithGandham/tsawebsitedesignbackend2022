const dotenv = require('dotenv').config();

//register schemas
Events = require('./mongoschemas/event.schema.js');
AppUser = require('./mongoschemas/appuser.schema.js');
const cors = require('cors');

//express
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

//db
const connect = require('./config/database.config.js');

//controllers
const eventController = require('./controllers/event.controller.js');
const userController = require('./controllers/appuser.controller.js');
const authController = require('./controllers/auth.controller.js');

async function bootServer() {
    try {
        app.use(cors());
        app.use(bodyParser.json());
        //db
        connect();

        //register the controllers
        app.use('/eventResource', eventController);
        app.use('/userResource', userController);
        app.use('/authResource', authController);
        app.get('/', (req, res) => {
            res.send('welcome to the API!');
        });

        //listen
        app.listen(port, () => {
            console.log('app listening on port:', port);
        });
    } catch (error) {
        console.error(error);
        console.log('An Error Occured Whilst Starting');
    }
}

module.exports = { bootServer };
