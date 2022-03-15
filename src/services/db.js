const  mongoose = require("mongoose")
require('dotenv').config;

async function connect() {
    await mongoose.connect(process.env.DB_URL);
    console.log("connected to database");
}

module.exports = connect;