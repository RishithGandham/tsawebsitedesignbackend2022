const mongoose = require('mongoose');
require('dotenv').config;
const DB_URI = process.env.DB_URI || process.env['DB_URI'];

async function connect() {
    await mongoose
        .connect(DB_URI)
        .then(() => {
            console.log('connected to database');
        })
        .catch((err) => {
            console.log('Error connecting to database.');
            console.error(err);
        });
}

module.exports = connect;
