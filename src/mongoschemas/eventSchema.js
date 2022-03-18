const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: 'this feild is required',
    },
    date: {
        type: String,
        required: 'this feild is required',
    },
    maxTickets: {
        type: Number,
        required: 'this feild is required',
    },
    ticketsSold: {
        type: Number,
        required: 'this feild is required',
    },
    app_user_id: {
        type: String,
        required: 'this feild is required',
    },
});

module.exports = mongoose.model('Event', eventSchema);
