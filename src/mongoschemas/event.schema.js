const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: 'this feild is required',
    },
    description: {
        type: String,
        required: 'this feild is required',
    },
    img_url: {
        type: String,
        required: 'this feild is required',
    },
    
    quiz: [{question: String, answer: String}],
    registeredUsers: {
        type: Number,
        required: 'this feild is required', 
        default: 0
    },
    date: {
        type: Date,
        required: 'this feild is required',
    }

});

module.exports = mongoose.model('Event', eventSchema);
