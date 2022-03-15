const  mongoose = require("mongoose")
require('dotenv').config;

async function connect() {
    await mongoose.connect('mongodb+srv://websitedesigndatabase:pass@cluster0.rmf4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
      .then(() => {
      console.log("connected to database");
    }).catch((err) => {
        console.log('Error connecting to database.')
        console.error(err);
    });

}

module.exports = connect;