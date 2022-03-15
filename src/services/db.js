const  mongoose = require("mongoose")
require('dotenv').config;

async function connect() {
    await mongoose.connect('mongodb+srv://websitedesigndatabase:pass@cluster0.rmf4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(() => {
      console.log("connected to database");
    });

}

module.exports = connect;